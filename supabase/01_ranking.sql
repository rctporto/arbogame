-- ArboGame · ranking online
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run. Pode rodar de novo sem problema.
--
-- Segurança:
--  * A tabela fica fechada (RLS ligado e sem políticas): ninguém lê nem grava direto.
--  * O site só usa as duas funções abaixo, que conferem tudo no servidor.
--  * Só guardamos apelido, faixa de idade, código da turma e pontos. Nada de nome completo, e-mail ou foto.

create extension if not exists pgcrypto;

create table if not exists public.ranking (
  jogador   uuid        not null,          -- identificador aleatório criado no aparelho
  jogo      text        not null,          -- 'geral' ou o id do minijogo
  apelido   text        not null,
  faixa     smallint    not null default 1, -- 1 Mirim, 2 Explorador, 3 Cientista
  turma     text        not null default '',
  pontos    integer     not null default 0,
  atualizado timestamptz not null default now(),
  primary key (jogador, jogo)
);
create index if not exists ranking_top on public.ranking (jogo, pontos desc);
create index if not exists ranking_turma on public.ranking (turma, jogo, pontos desc);

alter table public.ranking enable row level security;
revoke all on public.ranking from anon, authenticated;

-- Palavras que não podem aparecer em apelidos (minúsculas, sem acento).
create or replace function public.apelido_ok(t text) returns boolean
language sql immutable as $$
  select t ~ '^[A-Za-zÀ-ÿ0-9 ]{2,20}$'
     and not exists (
       select 1 from unnest(array[
         'merda','porra','caralho','buceta','puta','puto','viado','fdp','pqp','vsf','foda',
         'cu ','bosta','idiota','burro','otario','arrombado','corno','vagabund','piroca',
         'xoxota','cacete','desgraca','imbecil','retardado','macaco','nazi','sexo','porn'
       ]) w
       where translate(lower(t)||' ', 'áàâãäéèêëíìîïóòôõöúùûüç', 'aaaaaeeeeiiiiooooouuuuc') like '%'||w||'%'
     );
$$;

create or replace function public.enviar_pontos(
  p_jogador uuid, p_apelido text, p_faixa int, p_turma text, p_jogo text, p_pontos int
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_apelido text := btrim(regexp_replace(coalesce(p_apelido,''), '\s+', ' ', 'g'));
  v_turma   text := upper(btrim(coalesce(p_turma,'')));
  v_max     int  := case when p_jogo = 'geral' then 5000 else 1500 end;
  v_ult     timestamptz;
begin
  if p_jogador is null then raise exception 'jogador inválido'; end if;
  if p_jogo not in ('geral','esvazia','varre','coleta','espanta','memoria') then raise exception 'jogo inválido'; end if;
  if not public.apelido_ok(v_apelido) then raise exception 'apelido inválido'; end if;
  if v_turma !~ '^[A-Z0-9-]{0,12}$' then raise exception 'código de turma inválido'; end if;
  if p_pontos is null or p_pontos < 0 or p_pontos > v_max then raise exception 'pontuação inválida'; end if;
  if p_faixa not in (1,2,3) then p_faixa := 1; end if;

  -- no máximo um envio a cada 3 segundos por jogador e jogo
  select atualizado into v_ult from ranking where jogador = p_jogador and jogo = p_jogo;
  if v_ult is not null and v_ult > now() - interval '3 seconds' then return; end if;

  insert into ranking (jogador, jogo, apelido, faixa, turma, pontos, atualizado)
  values (p_jogador, p_jogo, v_apelido, p_faixa, v_turma, p_pontos, now())
  on conflict (jogador, jogo) do update
    set apelido = excluded.apelido, faixa = excluded.faixa, turma = excluded.turma,
        pontos = greatest(ranking.pontos, excluded.pontos), atualizado = now();
end $$;

create or replace function public.top_ranking(p_jogo text default 'geral', p_turma text default null, p_limite int default 10)
returns table (apelido text, faixa smallint, turma text, pontos integer)
language sql stable security definer set search_path = public as $$
  select r.apelido, r.faixa, r.turma, r.pontos
  from ranking r
  where r.jogo = p_jogo
    and (coalesce(p_turma,'') = '' or r.turma = upper(btrim(p_turma)))
    and r.pontos > 0
  order by r.pontos desc, r.atualizado asc
  limit least(greatest(coalesce(p_limite,10),1),50);
$$;

revoke all on function public.enviar_pontos(uuid,text,int,text,text,int) from public;
revoke all on function public.top_ranking(text,text,int) from public;
grant execute on function public.enviar_pontos(uuid,text,int,text,text,int) to anon, authenticated;
grant execute on function public.top_ranking(text,text,int) to anon, authenticated;

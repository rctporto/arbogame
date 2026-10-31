// ArboGame · configuração do ranking online (Firestore, projeto Firebase separado)
// O script scripts/criar-ranking.sh mostra estes dois valores no fim.
// A apiKey do Firebase é pública por natureza: quem protege o banco são as regras (ranking/firestore.rules).
// Enquanto os campos estiverem vazios, o jogo mostra só o ranking deste aparelho.
window.ARBO_CONFIG = {
  firebaseProjectId: "",
  firebaseApiKey: ""
};

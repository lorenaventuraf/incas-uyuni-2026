/* Configuração pública do backend (Supabase). A chave abaixo é pública por natureza:
   a leitura é aberta e a escrita exige o código de piloto, checado no banco (RLS). */
window.CFG = {
  url: "https://doqtppldrwyowzifmrqt.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcXRwcGxkcnd5b3d6aWZtcnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NzA1NDEsImV4cCI6MjEwNzA0NjU0MX0.4HbZuP7BL5haNpxuWQEJE7vl8rVOuweuYkTY_2J8Vg0",
  bucket: "media",
  folder: "trip2026",
  maxVideoMB: 45,
  // Só mostra registros a partir daqui (zera os testes sem apagar nada). Atualizar na véspera da saída.
  since: "2026-10-09T21:06:30Z"
};

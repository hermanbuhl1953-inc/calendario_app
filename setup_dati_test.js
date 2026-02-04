/**
 * SCRIPT SETUP DATI TEST - Esegui in Browser Console
 * 
 * USO:
 * 1. Apri DevTools (F12)
 * 2. Console tab
 * 3. Copy-paste tutto questo codice
 * 4. Premi ENTER
 * 
 * Popola automaticamente le 7 liste con dati test
 */

console.log("🚀 Avviando setup dati test...");

// Attendi che db sia caricato
if (!window.db) {
  console.error("❌ db-sharepoint.js non caricato! Aspetta 5 sec e riprova.");
  setTimeout(() => console.log("Riprova ora"), 5000);
  throw new Error("db not loaded");
}

// DATI TEST
const testistruttori = [
  { Nome: "Mario", Cognome: "Rossi", Area: "Scorta", Qualifica: "Capo Istruttore" },
  { Nome: "Luigi", Cognome: "Bianchi", Area: "Condotta", Qualifica: "Istruttore" },
  { Nome: "Anna", Cognome: "Verdi", Area: "Verifica", Qualifica: "Istruttore" },
];

const testAttivita = [
  { Titolo: "CORSO PDT-CT", Data: "2026-02-10", Tipo: "CORSO" },
  { Titolo: "CORSO ADT", Data: "2026-02-15", Tipo: "CORSO" },
  { Titolo: "Riunione staff", Data: "2026-02-12", Tipo: "RIUNIONE" },
];

const testFestivi = [
  { Data: "2026-01-01", Tipo: "Festivo Nazionale", Descrizione: "Capodanno" },
  { Data: "2026-01-06", Tipo: "Festivo Nazionale", Descrizione: "Epifania" },
  { Data: "2026-04-25", Tipo: "Festivo Nazionale", Descrizione: "Festa della Liberazione" },
  { Data: "2026-05-01", Tipo: "Festivo Nazionale", Descrizione: "Festa del Lavoro" },
  { Data: "2026-06-02", Tipo: "Festivo Nazionale", Descrizione: "Festa della Repubblica" },
  { Data: "2026-08-15", Tipo: "Festivo Nazionale", Descrizione: "Ferragosto" },
  { Data: "2026-11-01", Tipo: "Festivo Nazionale", Descrizione: "Ognissanti" },
  { Data: "2026-12-08", Tipo: "Festivo Nazionale", Descrizione: "Immacolata Concezione" },
  { Data: "2026-12-25", Tipo: "Festivo Nazionale", Descrizione: "Natale" },
  { Data: "2026-12-26", Tipo: "Festivo Nazionale", Descrizione: "Santo Stefano" },
];

const testUtenti = [
  { Username: "mario.rossi", Email: "mario.rossi@trenord.it", Ruolo: "Editor", Area: "Scorta" },
  { Username: "luigi.bianchi", Email: "luigi.bianchi@trenord.it", Ruolo: "Viewer", Area: "Condotta" },
];

const testAree = [
  { Nome: "Scorta", Colore: "#FF4444" },
  { Nome: "Condotta", Colore: "#4444FF" },
  { Nome: "Verifica", Colore: "#44FF44" },
  { Nome: "Manovra", Colore: "#FFFF44" },
];

// FUNZIONE: Popola una lista
async function populateList(listName, items) {
  console.log(`📝 Popolo ${listName}...`);
  let success = 0;
  let failed = 0;

  for (const item of items) {
    try {
      const result = await db.callSharePointAPI(
        `lists/getByTitle('${listName}')/items`,
        "POST",
        item
      );
      console.log(`  ✅ ${JSON.stringify(item)}`);
      success++;
    } catch (error) {
      console.log(`  ❌ ERRORE: ${error.message}`);
      failed++;
    }
  }

  console.log(`${listName}: ${success} ok, ${failed} falliti`);
  return { success, failed };
}

// ESECUZIONE
(async () => {
  try {
    console.log("\n=== POPOLO DATI TEST ===\n");

    await populateList("CalendarioIstruttori", testistruttori);
    await populateList("CalendarioAttivita", testAttivita);
    await populateList("CalendarioFestivi", testFestivi);
    await populateList("CalendarioUtenti", testUtenti);
    await populateList("CalendarioAree", testAree);

    console.log("\n✅ SETUP COMPLETATO!");
    console.log("Refresh pagina e verifica liste in SharePoint");
    
  } catch (error) {
    console.error("❌ ERRORE SETUP:", error);
  }
})();

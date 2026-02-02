# 📋 Guida Installazione SharePoint - Passo per Passo

## 🎯 Obiettivo
Rendere l'app Calendario Istruttori accessibile a 80 colleghi tramite SharePoint/Teams senza installare nulla sui loro PC.

---

## 📦 PASSO 1: Preparare i File

### File da caricare:
1. ✅ `index.html` (il file principale)
2. ✅ Cartella `static/` con tutti i contenuti

### Verifica prima di caricare:
```
✓ index.html
✓ static/js/db-storage.js
✓ static/js/calendario-app.js
```

**OPZIONALE:** Rinomina `index.html` → `index.aspx` per migliore integrazione SharePoint

---

## 🌐 PASSO 2: Carica su SharePoint

### Opzione A: SharePoint Online (Microsoft 365)

1. **Accedi a SharePoint**
   - Vai su `https://[tuaazienda].sharepoint.com`
   - O apri da Microsoft 365

2. **Crea Libreria/Cartella**
   - Nella homepage del sito
   - Click "+ Nuovo" → "Cartella"
   - Nome: `CalendarioIstruttori`

3. **Carica File**
   - Entra nella cartella `CalendarioIstruttori`
   - Click "Carica" → "File"
   - Seleziona `index.html`
   - Click "Carica" → "Cartella"
   - Seleziona la cartella `static/`

4. **Verifica Struttura**
   ```
   CalendarioIstruttori/
   ├── index.html (o index.aspx)
   └── static/
       └── js/
           ├── db-storage.js
           └── calendario-app.js
   ```

5. **Testa**
   - Click su `index.html`
   - Dovrebbe aprirsi nel browser
   - ✅ Se vedi la schermata di login: FUNZIONA!

---

## 🔗 PASSO 3: Condividi con i Colleghi

### Metodo 1: Link Diretto

1. **Ottieni link**
   - Click destro su `index.html`
   - "Copia link"
   - Esempio: `https://tuaazienda.sharepoint.com/sites/sitename/CalendarioIstruttori/index.html`

2. **Condividi**
   - Invia il link via email ai 80 colleghi
   - Aggiungi ai preferiti del browser
   - Crea un collegamento nella intranet aziendale

### Metodo 2: Microsoft Teams (CONSIGLIATO)

1. **Apri Teams**
   - Seleziona il canale dove vuoi l'app

2. **Aggiungi Tab**
   - Click sul `+` accanto ai tab
   - Scegli "Sito Web"
   - Nome: `Calendario Istruttori`
   - URL: [link a index.html su SharePoint]
   - Salva

3. **Risultato**
   - Tutti i membri del team vedono la tab
   - Click e si apre direttamente l'app
   - Nessuna installazione necessaria

### Metodo 3: Embedded in Pagina SharePoint

1. **Crea pagina SharePoint**
   - Nella home del sito
   - "+ Nuovo" → "Pagina"

2. **Aggiungi Web Part**
   - Click "+" → "Embed"
   - Inserisci URL completo di `index.html`

3. **Pubblica**
   - Salva e pubblica la pagina
   - Link alla pagina ai colleghi

---

## 👥 PASSO 4: Gestione Permessi

### Opzione A: Tutti possono modificare
```
Permessi → Condividi → Tutti (Modifica)
```
⚠️ Attenzione: ognuno gestisce i suoi dati localmente nel browser

### Opzione B: Solo visualizzazione per alcuni
```
Permessi → Condividi → Gruppo X (Lettura)
```

**NOTA IMPORTANTE:** 
Anche con permessi "Lettura", gli utenti possono usare l'app! I dati sono nel loro browser (LocalStorage), non sul server SharePoint.

---

## 🔐 PASSO 5: Configurazione Iniziale

### Primo Accesso

1. **Login con admin**
   - Username: `admin`
   - Password: `admin`

2. **Cambia password** (IMPORTANTE!)
   - Modifica nel codice o crea nuovo utente

3. **Aggiungi istruttori**
   - Tab "Istruttori"
   - Aggiungi tutti gli istruttori

4. **Configura attività**
   - Tab "Attività"
   - Aggiungi i tipi di corso/attività

5. **Esporta backup iniziale**
   - Tab "Export/Import"
   - Scarica JSON
   - Salva su SharePoint come `calendario_master.json`

---

## 🔄 PASSO 6: Sincronizzazione Dati (IMPORTANTE!)

### Problema
Ogni utente ha dati nel suo browser locale. Come sincronizzare?

### Soluzione: File JSON Condiviso

1. **Designa un Amministratore**
   - Es. segreteria o coordinatore

2. **Workflow Settimanale**
   
   **Lunedì mattina (Amministratore):**
   - Esporta JSON aggiornato
   - Salva su SharePoint: `\\SharePoint\CalendarioIstruttori\backup\calendario_settimana_[data].json`
   - Invia email: "Nuovo backup disponibile"

   **Tutti gli altri:**
   - Scaricano il JSON
   - Tab "Export/Import" → Importa
   - Dati sincronizzati!

3. **Automation (opzionale)**
   - Usa Power Automate per notificare upload nuovo backup
   - Crea calendario ricorrente per i backup

---

## 📱 PASSO 7: Istruzioni per i Colleghi

### Email da inviare ai 80 colleghi:

```
Oggetto: Nuovo Calendario Istruttori - Accesso Web

Ciao a tutti,

È disponibile la nuova app Calendario Istruttori accessibile direttamente dal browser.

🔗 LINK: [inserisci link]

📱 Come usare:
1. Apri il link (funziona su PC, tablet, smartphone)
2. Login: admin / admin (la prima volta)
3. Inizia a usare!

💾 Sincronizzazione dati:
- Ogni settimana riceverai un file JSON
- Tab "Export/Import" → Importa il file
- I tuoi dati saranno aggiornati

📌 Aggiungi ai preferiti per accesso rapido!

Per supporto: [tuo contatto]

Buon lavoro!
```

---

## ✅ CHECKLIST PRE-LANCIO

Prima di condividere con tutti:

- [ ] File caricati su SharePoint
- [ ] `index.html` si apre correttamente
- [ ] Login funziona
- [ ] Testato su Chrome/Edge
- [ ] Testato da mobile
- [ ] Backup JSON salvato
- [ ] Permessi SharePoint configurati
- [ ] Email di annuncio preparata
- [ ] Piano sincronizzazione definito
- [ ] Persona responsabile backup identificata

---

## 🚨 Troubleshooting

### Problema: File non si apre
**Soluzione:** 
- Verifica estensione `.html` o `.aspx`
- Prova con browser diverso (Chrome/Edge)
- Verifica permessi SharePoint

### Problema: Pagina bianca
**Soluzione:**
- Apri console browser (F12)
- Controlla errori JavaScript
- Verifica che cartella `static/` sia nella stessa directory

### Problema: "Errore caricamento"
**Soluzione:**
- Controlla connessione internet (CDN Bootstrap/FontAwesome)
- Verifica percorsi file JavaScript

### Problema: Dati non si salvano
**Soluzione:**
- Controlla LocalStorage abilitato nel browser
- Verifica che non sia in modalità navigazione privata
- Cancella cache e riprova

---

## 📊 Monitoraggio Uso

SharePoint fornisce analytics:
- Visualizzazioni pagina
- Utenti unici
- Download file

Per vedere:
`SharePoint → Impostazioni Sito → Analisi sito`

---

## 🎓 Formazione Utenti

### Webinar/Video Tutorial (opzionale)
Registra uno screencast di 10 minuti:
1. Come accedere (2 min)
2. Navigazione interfaccia (3 min)
3. Aggiungere impegno (3 min)
4. Export/Import (2 min)

Carica video su Stream/SharePoint.

---

## 📞 Supporto

**Livello 1:** FAQ document su SharePoint  
**Livello 2:** Email supporto  
**Livello 3:** Chiamata/Teams meeting  

---

## 🎉 Lancio!

Quando sei pronto:
1. ✅ Tutti i check completati
2. 📧 Invia email annuncio
3. 📱 Messaggio su Teams
4. 📌 Aggiungi link a intranet
5. 🎊 Monitora feedback prime settimane

---

**Buona fortuna! 🚀**

---

*Versione 1.0 - Febbraio 2026*

# 🚀 SETUP SharePoint Trenord - STASERA

**Obiettivo**: Testare db-sharepoint.js con vostri 2 utenti oggi  
**Tempo**: 45 minuti setup + 30 min test = 1 ora 15 totali  
**Sito**: PIAN.FABB.EGESTIONEABILITAZIONI  

---

## ⏱️ TIMELINE STASERA

```
16:00 - Crea 7 liste (15 min)
16:15 - Carica file statici (5 min)
16:20 - Test lettura (5 min)
16:25 - Test scrittura (10 min)
16:35 - Test offline (10 min)
16:45 - Test 2 browser contemporaneo (10 min)
16:55 - Documentare errori (se ci sono)
```

---

## STEP 1: CREA 7 LISTE (15 MIN)

### Accedi a SharePoint
```
Vai: https://trenord.sharepoint.com/sites/PIAN.FABB.EGESTIONEABILITAZIONI
Click: "+ New" → "+ List"
```

### Lista 1: CalendarioIstruttori
```
Name: CalendarioIstruttori
Type: Blank list

Columns (dopo creation):
+ Nome (Text)
+ Cognome (Text)
+ Area (Choice: Scorta, Condotta, Verifica, Manovra)
+ Qualifica (Text)

Data: Aggiungi 2 test rows:
  Row 1: Mario, Rossi, Scorta, Capo Istruttore
  Row 2: Luigi, Bianchi, Condotta, Istruttore
```

### Lista 2: CalendarioAttivita
```
Name: CalendarioAttivita
Columns:
+ Titolo (Text)
+ Data (Date)
+ Tipo (Choice: CORSO, COMMISSIONE, RIUNIONE, ALTRO)

Data: Aggiungi 1 test row:
  CORSO PDT-CT, 2026-02-10, CORSO
```

### Lista 3: CalendarioImpegni
```
Name: CalendarioImpegni
Columns:
+ IDIstruttore (Text)
+ DataInizio (Date)
+ DataFine (Date)
+ Tipo (Choice: CORSO, FERIE, MALATTIA, COMMISSIONE, RIUNIONE)
+ IDCorso (Text - nullable)
+ Note (Text)

Data: (lascia vuota per ora, test via app)
```

### Lista 4: CalendarioFestivi
```
Name: CalendarioFestivi
Columns:
+ Data (Date)
+ Tipo (Choice: Festivo Nazionale, Festivo Aziendale, Ponte)
+ Descrizione (Text)

Data: Aggiungi festività italiane 2026:
  2026-01-01, Festivo Nazionale, Capodanno
  2026-01-06, Festivo Nazionale, Epifania
  2026-04-25, Festivo Nazionale, Festa della Liberazione
  2026-05-01, Festivo Nazionale, Festa del Lavoro
  2026-06-02, Festivo Nazionale, Festa della Repubblica
  2026-08-15, Festivo Nazionale, Ferragosto
  2026-11-01, Festivo Nazionale, Ognissanti
  2026-12-08, Festivo Nazionale, Immacolata
  2026-12-25, Festivo Nazionale, Natale
  2026-12-26, Festivo Nazionale, Santo Stefano
```

### Lista 5: CalendarioUtenti
```
Name: CalendarioUtenti
Columns:
+ Username (Text - unique)
+ Email (Email)
+ Ruolo (Choice: Admin, Supervisor, Editor, Viewer)
+ Area (Choice: Scorta, Condotta, Verifica, Manovra, All)

Data: Aggiungi 2 utenti test:
  Row 1: mario.rossi, mario.rossi@trenord.it, Editor, Scorta
  Row 2: luigi.bianchi, luigi.bianchi@trenord.it, Viewer, Condotta
```

### Lista 6: CalendarioAree
```
Name: CalendarioAree
Columns:
+ Nome (Choice: Scorta, Condotta, Verifica, Manovra)
+ Colore (Text)

Data:
  Scorta, #FF4444 (rosso)
  Condotta, #4444FF (blu)
  Verifica, #44FF44 (verde)
  Manovra, #FFFF44 (giallo)
```

### Lista 7: CalendarioAuditLog
```
Name: CalendarioAuditLog
Columns:
+ Azione (Text)
+ Utente (Text)
+ Data (DateTime)
+ Dettagli (Text)

Data: (auto-populated dal app)
```

---

## STEP 2: UPLOAD FILE STATICI (5 MIN)

### Crea cartella upload
```
Nel sito, vai a: Documenti Condivisi
New → Folder → "CalendarioApp"
```

### Upload questi file
```
CalendarioApp/
├── index.aspx ← QUESTO È IL FILE PRINCIPALE (già rinominato)
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── calendario-app.js
│   │   ├── db-sharepoint.js ← ATTIVO di default in index.aspx
│   │   └── db-storage.js
│   └── lib/
│       └── fontawesome/
│           ├── all.min.css
│           └── webfonts/ (tutti i font)
```

### ⚠️ IMPORTANTE: index.aspx già configurato
```
index.aspx ha già db-sharepoint.js attivato di default.
NON serve Flask - funziona direttamente su SharePoint!
```

### URL per aprire app
```
https://trenord.sharepoint.com/sites/PIAN.FABB.EGESTIONEABILITAZIONI/
Documenti%20Condivisi/CalendarioApp/index.aspx
```

### 🎉 NOVITÀ: 4 VISTE INTEGRATE
L'app ora ha **4 visualizzazioni** accessibili via tab:
1. **📅 Vista Calendario**: FullCalendar mensile (stile Google)
2. **📊 Vista Timeline**: Timeline con filtri (Area, Mese, Cerca, Tipo)
3. **📋 Vista Lista**: Tabella ordinabile paginata (20/pag)
4. **📈 Dashboard**: 6 widget KPI + mini calendar

**Performance**: Filtri riducono celle dal 98% (14k → 300 celle)

---

## STEP 3: TEST CHECKLIST (30 MIN)

### Test 1: Apri app
```
Apri: [URL da sopra]
Expected: Carica pagina, vedi navbar
❌ Se errore CORS: Vedi troubleshooting sotto
```

### Test 2: Login
```
Click: "Login"
Usa credenziali Trenord
Expected: Entra, vedi lista istruttori vuota (normale)
❌ Se: "Not authorized" → Controlla liste permessi
```

### Test 3: Crea impegno
```
Click: "Nuovo Impegno"
Riempi:
  - Istruttore: Mario Rossi
  - Data inizio: 2026-02-10
  - Giorni: 3
  - Tipo: CORSO
Click: Save
Expected: ✅ "Impegno salvato", ricompare in lista
❌ Se non salva: Vedi troubleshooting
```

### Test 4: Refresh browser
```
Refresh F5
Expected: Impegno è ancora lì (salvato su SharePoint)
❌ Se sparisce: db-sharepoint.js non legge correttamente
```

### Test 5: Test offline
```
Apri DevTools (F12) → Network → Offline
Crea nuovo impegno
Click: Save
Expected: ✅ Salva localmente (fallback localStorage)
Torna online: Impegno deve syncronizzare
```

### Test 6: 2 Browser contemporaneo
```
Browser 1: Crea impegno "Test Mario"
Browser 2: Aggiorna (F5)
Expected: Impegno appare in Browser 2 (sync in tempo reale)
❌ Se non appare: Sync ogni 30 sec è lento, aspetta
```

---

## TROUBLESHOOTING

### ❌ Errore: "CORS error" o "401 Unauthorized"
**Causa**: db-sharepoint.js non riesce ad autenticarsi  
**Fix**:
1. Apri DevTools (F12) → Console
2. Cerca errori dettagliati
3. Controlla: Sei loggato con account Trenord?
4. Controlla: Hai permessi Edit su liste SharePoint?

**Se non sai darmi screenshot dell'errore**

---

### ❌ Errore: "List not found: CalendarioIstruttori"
**Causa**: Nome lista è diverso o non creata  
**Fix**:
1. Vai a SharePoint
2. Verifica: Esattamente "CalendarioIstruttori" (case sensitive su API)
3. Se nome è diverso: Edit db-sharepoint.js lista 20 circa:
```javascript
// CAMBIA QUESTO:
this.lists = {
  'istruttori': 'CalendarioIstruttori',  // ← Qui
  'attivita': 'CalendarioAttivita',
  ...
}
```

---

### ❌ Errore: "Cannot read property of undefined"
**Causa**: db-sharepoint.js non carica o JavaScript errore  
**Fix**:
1. DevTools (F12) → Console → Scroll up
2. Manda mi il primo errore rosso

---

### ❌ Non salva impegno / Salva ma non appare in lista
**Causa**: addImpegno() in db-sharepoint.js ha bug  
**Fix**:
1. DevTools (F12) → Network tab
2. Crea impegno
3. Guarda "CalendarioImpegni" POST request
4. Status: deve essere 201 (Created)
5. Se 4xx/5xx: SharePoint reject il dato
6. Manda mi screenshot del request/response

---

## COSA DEVO SAPERE DOPO TEST

Se oggi va tutto ok (✅✅✅):
```
1. Nessun errore CORS/401?
2. Legge liste correttamente?
3. Salva impegni?
4. Sync tra 2 browser funziona?
5. Offline fallback funziona?
```

Se ci sono bug (❌):
```
1. Screenshot errore console
2. URL esatto dove testi
3. Cosa stai tentando quando fallisce
4. Che errore vedi
```

---

## NOTE IMPORTANTI

⚠️ **DOPO TEST STASERA**: Non deletare liste!  
Servono per test domani con secondo utente.

⚠️ **Se test fallisce**: Non è disastro  
Significa: db-sharepoint.js ha bug → Fissiamo mercoledì mattina

⚠️ **Permessi SharePoint**: Assicurati che:
- Tu sei Owner sito
- Utente test #2 è almeno Editor
- Entrambi potete accedere lists

---

## CONTATTI DURANTE TEST

Se blocchi durante test, dammi:
1. Screenshot errore
2. Step dove blocca
3. URL esatto

Anche se è le 18:00, mando risposta subito 👍

---

**PRONTI? Creale le 7 liste e poi dimmi come va! ☕** 🚀

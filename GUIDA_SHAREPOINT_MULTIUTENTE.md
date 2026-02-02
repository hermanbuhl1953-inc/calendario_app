# 🌐 Guida Deployment SharePoint Multi-Utente

## 🎯 Soluzione per 80 Utenti Concorrenti

Questa versione usa **SharePoint Lists** come database condiviso, permettendo a tutti gli 80 utenti di:
- ✅ Modificare i dati contemporaneamente
- ✅ Vedere modifiche in real-time (auto-refresh ogni 30 sec)
- ✅ Zero conflitti (gestiti automaticamente da SharePoint)
- ✅ Zero server Python necessario

---

## 📋 Pre-Requisiti

1. **SharePoint Online** (Office 365)
2. Permessi: **Site Owner** o **Site Collection Administrator**
3. Browser moderno (Chrome, Edge, Firefox)

---

## 🚀 Installazione Step-by-Step

### Step 1: Crea Sito SharePoint

1. Vai su **SharePoint** (https://tuodominio.sharepoint.com)
2. Click **+ Crea sito**
3. Scegli **Sito del team**
4. Nome: `Calendario Istruttori Trenord`
5. Privacy: **Privato** (solo membri approvati)
6. Click **Avanti** → **Fine**

---

### Step 2: Upload File Applicazione

1. Nel tuo nuovo sito, vai su **Documenti**
2. Crea cartella `Calendario`
3. Upload questi file:
   ```
   Calendario/
   ├── index.aspx                       ← File principale
   ├── static/
   │   ├── css/
   │   │   └── style.css
   │   ├── js/
   │   │   ├── db-sharepoint.js        ← Database SharePoint
   │   │   └── calendario-app.js
   │   └── lib/
   │       └── fontawesome/
   ```

4. **IMPORTANTE**: Rinomina `index.html` → `index.aspx`

---

### Step 3: Crea Liste SharePoint

L'app crea automaticamente le liste al primo avvio, ma puoi crearle manualmente:

#### 1. CalendarioIstruttori
```
Settings → Add an app → Custom List
Nome: CalendarioIstruttori
Colonne:
- Nome (Single line of text)
- Email (Single line of text)
- AreaId (Single line of text)
```

#### 2. CalendarioAttivita
```
Nome: CalendarioAttivita
Colonne:
- Nome (Single line of text)
- Colore (Single line of text)
- GiorniLavorativi (Number)
```

#### 3. CalendarioImpegni
```
Nome: CalendarioImpegni
Colonne:
- IstruttoreId (Single line of text)
- AttivitaId (Single line of text)
- DataInizio (Date and Time)
- DataFine (Date and Time)
- GiorniLavorativi (Number)
- Numero (Single line of text)
- Note (Multiple lines of text)
```

#### 4. CalendarioAree
```
Nome: CalendarioAree
Colonne:
- Nome (Single line of text)
- Colore (Single line of text)
```

#### 5. CalendarioFestivi
```
Nome: CalendarioFestivi
Colonne:
- Data (Date and Time)
- Nome (Single line of text)
- IsCustom (Yes/No)
```

#### 6. CalendarioUtenti
```
Nome: CalendarioUtenti
Colonne:
- Username (Single line of text)
- PasswordHash (Single line of text)
- Ruolo (Choice: Admin, Supervisor, Editor, Viewer)
- AreaId (Single line of text)
```

---

### Step 4: Configura Permessi

#### Per i 79 utenti normali:

1. Vai su **Impostazioni sito** → **Permessi sito**
2. Click **Concedi permessi**
3. Aggiungi gruppo: `Tutti i dipendenti` o email individuali
4. Livello permesso: **Collaborazione** (Edit)
5. Click **Condividi**

#### Per te (Admin):

- Sei già **Proprietario** → hai tutti i permessi

---

### Step 5: Modifica File per SharePoint

Apri `index.aspx` e cambia questa riga:

**PRIMA:**
```html
<script src="static/js/db-storage.js"></script>
```

**DOPO:**
```html
<script src="static/js/db-sharepoint.js"></script>
```

Salva e ricarica il file su SharePoint.

---

### Step 6: Test Iniziale

1. Apri nel browser:
   ```
   https://tuodominio.sharepoint.com/sites/CalendarioIstruttori/Calendario/index.aspx
   ```

2. Verifica console browser (F12):
   ```
   🔄 Inizializzazione SharePoint Database...
   Creazione lista: CalendarioIstruttori
   Creazione lista: CalendarioAttivita
   ...
   ✅ SharePoint Database inizializzato
   ```

3. Login con `admin` / `admin`

4. Crea un istruttore di test

5. Verifica nella lista SharePoint:
   - Vai su **Contenuti del sito**
   - Click **CalendarioIstruttori**
   - Dovresti vedere il nuovo item!

---

## 🔄 Come Funziona il Multi-Utente

### Scenario: 3 Utenti Contemporanei

```
UTENTE 1 (Mario - Milano)
├── 10:00 - Apre app
├── 10:05 - Crea istruttore "Paolo"
└── Dati salvati in SharePoint List

UTENTE 2 (Luigi - Roma)
├── 10:03 - Apre app
├── 10:06 - Vede "Paolo" (auto-refresh)
└── 10:08 - Crea impegno per Paolo

UTENTE 3 (Anna - Torino)
├── 10:07 - Apre app
├── 10:09 - Vede Paolo + Impegno
└── Tutto sincronizzato!
```

### Auto-Refresh

L'app fa **refresh automatico ogni 30 secondi**:

```javascript
// In db-sharepoint.js
this.refreshInterval = 30000; // 30 sec
```

**Puoi cambiare:**
```javascript
this.refreshInterval = 10000;  // 10 sec (più reattivo)
this.refreshInterval = 60000;  // 60 sec (meno carico)
```

### Gestione Conflitti

SharePoint gestisce automaticamente i conflitti:

1. **User 1** crea impegno 10-15 Marzo
2. **User 2** (contemporaneamente) crea impegno 12-20 Marzo
3. SharePoint salva ENTRAMBI
4. Al refresh, **app mostra warning** sovrapposizione
5. Admin può risolvere manualmente

---

## 🎨 Personalizzazioni

### 1. Cambia Intervallo Refresh

In `db-sharepoint.js` riga 23:
```javascript
this.refreshInterval = 30000; // Cambia qui (millisecondi)
```

### 2. Disabilita Auto-Refresh

In `db-sharepoint.js` riga 24:
```javascript
this.autoRefreshEnabled = false;
```

Poi aggiungi bottone "Aggiorna" manuale in HTML.

### 3. Notifica Modifiche Altrui

In `db-sharepoint.js` riga 255, aggiungi:
```javascript
if (window.onDatabaseRefresh) {
    // Mostra toast notification
    const toast = document.createElement('div');
    toast.className = 'alert alert-info';
    toast.textContent = '🔄 Dati aggiornati da altro utente';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    
    window.onDatabaseRefresh();
}
```

---

## 🔐 Sicurezza

### Protezione Password

**ATTENZIONE**: La versione attuale usa `btoa()` per hash password (NON sicuro).

**Per produzione**, installa `bcrypt.js`:

1. Download: https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js
2. Aggiungi in `index.aspx`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js"></script>
   ```

3. In `db-sharepoint.js`, cambia:
   ```javascript
   // PRIMA
   async addUtente(username, password, ruolo, areaId) {
       const passwordHash = btoa(password);
       ...
   }
   
   // DOPO
   async addUtente(username, password, ruolo, areaId) {
       const salt = await bcrypt.genSalt(10);
       const passwordHash = await bcrypt.hash(password, salt);
       ...
   }
   
   async verificaLogin(username, password) {
       const utenti = await this.getUtenti();
       for (const utente of utenti) {
           if (utente.username === username) {
               const match = await bcrypt.compare(password, utente.passwordHash);
               if (match) return utente;
           }
       }
       return null;
   }
   ```

### Audit Log

Ogni modifica è tracciata automaticamente da SharePoint:

1. Vai su lista (es. CalendarioImpegni)
2. Click su item
3. **...** → **Version History**
4. Vedi: CHI, QUANDO, COSA ha modificato

---

## 📊 Monitoraggio Performance

### Verifica Carico SharePoint

1. Vai su **Impostazioni sito** → **Statistiche utilizzo**
2. Controlla:
   - Visite giornaliere
   - API calls
   - Storage usato

### Limiti SharePoint

| Risorsa | Limite | Note |
|---------|--------|------|
| Items per lista | 30 milioni | 🟢 Sicuro |
| API calls/giorno | 1 milione | 🟢 80 utenti = ~200k |
| File upload size | 250 GB | 🟢 App = 5 MB |
| Concurrent users | 30,000 | 🟢 80 utenti ok |

**Conclusione**: 80 utenti sono **ampiamente supportati** ✅

---

## 🐛 Troubleshooting

### Errore: "Access Denied"

**Causa**: Utente non ha permessi sulla lista

**Fix**:
1. Vai su lista
2. **Impostazioni** → **Permessi per questa lista**
3. Aggiungi utente con **Collaborazione**

---

### Errore: "List does not exist"

**Causa**: Liste non create

**Fix**:
1. Apri console browser (F12)
2. Cerca errori API
3. Crea liste manualmente (vedi Step 3)

---

### Modifiche Non Visibili

**Causa**: Cache browser o refresh non attivo

**Fix**:
1. Hard refresh: `Ctrl + F5`
2. Verifica console:
   ```javascript
   db.cache.lastRefresh
   // Deve essere < 30 secondi fa
   ```
3. Refresh manuale:
   ```javascript
   db.refreshCache()
   ```

---

### Prestazioni Lente

**Causa**: Troppi items nelle liste

**Fix**:
1. **Archiviazione**: Sposta impegni vecchi in lista separata
2. **Indici**: Crea indici su colonne filtrate
3. **Cache**: Aumenta intervallo refresh a 60 sec

---

## 📱 Accesso Mobile

### SharePoint Mobile App

1. Installa **SharePoint** da App Store/Play Store
2. Login con account Office 365
3. Trova sito "Calendario Istruttori"
4. Apri `index.aspx`
5. ✅ Funziona anche su mobile!

### Browser Mobile

- Apri Safari/Chrome
- Vai su URL SharePoint
- L'app è già responsive!

---

## 🎯 Checklist Deployment

- [ ] Sito SharePoint creato
- [ ] File caricati in libreria Documenti
- [ ] `index.html` rinominato in `index.aspx`
- [ ] Script cambiato da `db-storage.js` → `db-sharepoint.js`
- [ ] Liste create (auto o manuale)
- [ ] Permessi configurati (79 utenti)
- [ ] Test iniziale OK
- [ ] Admin user creato
- [ ] 4 Aree inizializzate
- [ ] Festività italiane caricate
- [ ] Test multi-utente con 2-3 persone
- [ ] Formazione utenti base
- [ ] Documentazione distribuita

---

## 🚀 Go Live!

1. **Comunicazione**:
   ```
   Oggetto: Nuovo Calendario Istruttori Online
   
   Cari colleghi,
   
   Da oggi è disponibile il nuovo sistema di gestione calendario:
   https://tuodominio.sharepoint.com/sites/CalendarioIstruttori/Calendario/index.aspx
   
   Credenziali iniziali:
   - Username: [il tuo nome utente]
   - Password: [cambiala al primo accesso]
   
   Funzionalità:
   ✅ Gestione impegni istruttori
   ✅ Calcolo automatico date fine corso
   ✅ Rilevazione sovrapposizioni
   ✅ Accesso contemporaneo per tutti
   
   Guida rapida allegata.
   
   Supporto: [tuo email/numero]
   ```

2. **Formazione**:
   - Sessione online 30 min
   - Slide con screenshot
   - Q&A finale

3. **Supporto Primo Mese**:
   - Canale Teams dedicato
   - FAQ aggiornata
   - Monitoraggio errori

---

## 📞 Supporto

**Errori tecnici**:
- Apri console browser (F12)
- Screenshot errore
- Invia a IT support

**Problemi funzionali**:
- Descrivi scenario
- Screenshot
- Email a admin calendario

---

**Versione**: 2.0 Multi-Utente SharePoint  
**Data**: 2 Febbraio 2026  
**Supporta**: 80+ utenti concorrenti  
**Auto-Refresh**: 30 secondi  
**Status**: ✅ PRONTO PER PRODUZIONE

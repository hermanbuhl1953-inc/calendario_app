# 🗓️ Calendario Istruttori - Versione Statica SharePoint

## 📌 Descrizione

Questa è la **versione completamente statica** dell'applicazione Calendario Istruttori, progettata per essere distribuita su **SharePoint/OneDrive** senza necessità di server o Python.

### ✨ Caratteristiche

- ✅ **100% Client-Side** - Nessun server necessario
- ✅ **Nessuna installazione** - Funziona direttamente nel browser
- ✅ **Dati persistenti** - Usa LocalStorage del browser
- ✅ **Export/Import** - Backup in formato JSON
- ✅ **Responsive** - Funziona su desktop, tablet e mobile
- ✅ **Compatibile SharePoint** - Pronta per essere caricata

## 🚀 Come usare su SharePoint/OneDrive

### Metodo 1: SharePoint

1. **Carica i file**
   - Vai nella tua SharePoint library
   - Crea una cartella (es. "CalendarioIstruttori")
   - Carica tutti i file:
     - `index.html` (o rinomina in `index.aspx`)
     - Cartella `static/` completa

2. **Condividi con i colleghi**
   - Imposta i permessi di accesso
   - Condividi il link alla cartella
   - Gli utenti apriranno `index.html` nel browser

3. **Usa come Web Part** (opzionale)
   - In un canale Teams, aggiungi tab "Sito Web"
   - Punta al file `index.html` su SharePoint
   - Tutti potranno accedere direttamente da Teams

### Metodo 2: OneDrive

1. **Carica su OneDrive**
   - Carica tutti i file in una cartella OneDrive
   - Condividi la cartella con i 80 colleghi

2. **Accesso**
   - I colleghi aprono `index.html` direttamente
   - Il browser esegue tutto localmente

### Metodo 3: File Server Aziendale

1. **Copia su rete condivisa**
   - Metti tutti i file in una cartella di rete (es. `\\server\apps\calendario\`)
   - I colleghi aprono il file da `Esplora File`

2. **Crea collegamento**
   - Crea un collegamento sul desktop dei PC
   - Punta a `\\server\apps\calendario\index.html`

## 📁 Struttura File Necessari

```
CalendarioIstruttori/
├── index.html                    # File principale
├── static/
│   └── js/
│       ├── db-storage.js        # Gestione dati LocalStorage
│       └── calendario-app.js    # Logica applicazione
```

**NOTA:** I CSS e JS di Bootstrap/FontAwesome vengono caricati da CDN, quindi serve connessione internet. Se lavori offline, scarica le librerie localmente.

## 🔐 Login

**Credenziali default:**
- Username: `admin`
- Password: `admin`

⚠️ **IMPORTANTE:** Cambia la password alla prima installazione!

## 💾 Gestione Dati

### Dove vengono salvati i dati?

I dati sono salvati nel **LocalStorage del browser** di ogni utente. Questo significa:

- ✅ Ogni utente ha la sua copia locale dei dati
- ✅ I dati persistono anche chiudendo il browser
- ✅ Privacy: i dati restano sul PC dell'utente
- ⚠️ Attenzione: cancellare la cache del browser cancella i dati

### Condivisione Dati tra Utenti

Per sincronizzare i dati tra i colleghi:

1. **Un utente esporta i dati**
   - Tab "Export/Import"
   - Click "Scarica Backup JSON"
   - Salva il file (es. `calendario_backup_2026-02-02.json`)

2. **Gli altri importano**
   - Tab "Export/Import"
   - Carica il file JSON
   - Click "Importa da File"

3. **Sincronizzazione periodica**
   - Designa un "amministratore" che gestisce il backup master
   - Ogni settimana/mese esporta e condivide il file aggiornato
   - Gli altri importano per sincronizzare

### Backup Automatico

⚠️ **Raccomandazione:** Esporta un backup JSON ogni settimana e salvalo su SharePoint/OneDrive!

## 🛠️ Funzionalità

### 📅 Calendario
- Visualizzazione mensile
- Filtra per istruttore
- Click su giorno per vedere impegni
- Navigazione mese precedente/successivo
- Pulsante "Oggi"

### 👥 Gestione Istruttori
- Aggiungi nuovo istruttore
- Modifica dati (nome, email)
- Disattiva/Riattiva istruttori
- Elimina istruttori

### 📋 Gestione Impegni
- Crea nuovo impegno/corso
- Assegna istruttore e attività
- Calcolo automatico data fine (giorni lavorativi)
- Note, luogo, aula, posti
- Visualizza lista completa impegni

### 🏷️ Tipi Attività
- Aggiungi tipi di attività personalizzati
- Colori distintivi
- Categorie

### 📤 Export/Import
- Esporta tutti i dati in JSON
- Importa da backup
- Reset completo database

## 🌐 Compatibilità Browser

- ✅ Chrome (consigliato)
- ✅ Edge (consigliato)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer non supportato

## 🔧 Personalizzazione

### Cambiare Colori

Modifica nel file `index.html` le variabili CSS:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --success-color: #27ae60;
    --danger-color: #e74c3c;
}
```

### Aggiungere Utenti

Nel file `static/js/db-storage.js`, modifica la funzione `getDefaultUtenti()`:

```javascript
getDefaultUtenti() {
    return [
        {
            id: 1,
            username: 'admin',
            password: this.hashPassword('admin'),
            nome: 'Amministratore',
            cognome: 'Sistema',
            ruolo: 'Admin',
            attivo: true
        },
        // Aggiungi altri utenti qui
        {
            id: 2,
            username: 'mario.rossi',
            password: this.hashPassword('password123'),
            nome: 'Mario',
            cognome: 'Rossi',
            ruolo: 'Utente',
            attivo: true
        }
    ];
}
```

## 📱 Uso Mobile

L'app è responsive e funziona su smartphone/tablet. I colleghi possono:
- Aprire il link SharePoint dal cellulare
- Aggiungere alla home screen come app
- Usare offline (dopo prima apertura)

## ❓ Domande Frequenti

### I dati sono al sicuro?
Sì, restano nel browser dell'utente. Fai backup regolari in JSON.

### Posso usare offline?
Sì, dopo la prima apertura. I CDN di Bootstrap/FontAwesome richiedono internet solo al primo caricamento.

### Quanti utenti possono usarla?
Illimitati! Ogni utente ha la sua copia locale.

### Come condivido aggiornamenti?
Export JSON → Condividi file → Import su altri PC.

## 🆘 Supporto

Per problemi o domande:
1. Controlla che il browser sia aggiornato
2. Verifica permessi di accesso ai file
3. Prova a cancellare cache e ricaricare
4. Usa sempre Chrome o Edge per migliori prestazioni

## 📜 Licenza

Uso interno aziendale.

---

**Versione:** 1.0.0 (Statica)  
**Data:** Febbraio 2026  
**Compatibile con:** SharePoint, OneDrive, File Server

# 🚀 CALENDARIO ISTRUTTORI - WEB APP

Sistema completo di gestione impegni per istruttori ferroviari.

## 📋 CARATTERISTICHE

✅ **Gestione Impegni**
   - Aggiungi, modifica, elimina impegni
   - Menu a tendina per istruttori e attività
   - Calcolo automatico date

✅ **Calendario Visivo**
   - Vista annuale completa
   - 1 riga per istruttore
   - Celle colorate per tipo attività
   - Click su cella → dettagli impegno

✅ **Dettaglio Corsi**
   - Timeline attività per corso
   - Grafici e statistiche
   - Sezione note modificabile

✅ **Export Excel**
   - Genera file Excel completo
   - Database + Calendari
   - Download immediato

✅ **Statistiche**
   - Dashboard con numeri chiave
   - Grafici attività
   - Controllo sovrapposizioni

## 🛠️ INSTALLAZIONE

### PREREQUISITI

- Python 3.8 o superiore
- pip (gestore pacchetti Python)

### INSTALLAZIONE DIPENDENZE

1. Apri terminale/prompt dei comandi

2. Naviga alla cartella dell'app:
```bash
cd calendario_app
```

3. Installa le dipendenze:
```bash
pip install -r requirements.txt --break-system-packages
```

### INIZIALIZZAZIONE DATABASE

4. Inizializza il database:
```bash
python database.py
```

Vedrai:
```
✅ Database inizializzato con successo!
✅ Dati di esempio inseriti!
```

## 🚀 AVVIO APPLICAZIONE

5. Avvia il server:
```bash
python app.py
```

Vedrai:
```
🚀 Avvio Calendario Istruttori...
📍 Accedi a: http://localhost:5000
⚠️  Premi CTRL+C per fermare il server
```

6. Apri il browser e vai su:
```
http://localhost:5000
```

## 👥 ACCESSO MULTI-UTENTE

### PER RETE LOCALE

Se vuoi che altri PC nella tua rete accedano:

1. Trova il tuo IP locale:
   - Windows: `ipconfig` (cerca "Indirizzo IPv4")
   - Linux/Mac: `ifconfig` o `ip addr`

2. Gli altri utenti apriranno:
```
http://TUO_IP:5000
```

Esempio:
```
http://192.168.1.100:5000
```

### PER SERVER AZIENDALE

1. Copia tutta la cartella `calendario_app` sul server

2. Installa dipendenze sul server

3. Avvia app sul server (lasciala in esecuzione)

4. Tutti gli utenti aprono:
```
http://nome_server:5000
```

## 📖 GUIDA ALL'USO

### 1. GESTIRE IMPEGNI

**Aggiungere Impegno:**
1. Click su "Impegni" nel menu
2. Click "Aggiungi Nuovo Impegno"
3. Compila il form:
   - ID Corso (opzionale, per raggruppare attività)
   - Istruttore (obbligatorio)
   - Attività (obbligatorio)
   - Data Inizio (obbligatorio)
   - Giorni Lavorativi (obbligatorio)
   - Note (opzionale)
4. Click "Salva"

**Modificare Impegno:**
1. Nella tabella impegni, click pulsante "Modifica" (icona matita)
2. Modifica i campi
3. Click "Salva"

**Eliminare Impegno:**
1. Click pulsante "Elimina" (icona cestino)
2. Conferma

### 2. VISUALIZZARE CALENDARIO

1. Click su "Calendari" nel menu
2. Seleziona anno (2025-2030)
3. Vedi calendario completo:
   - 1 riga per istruttore
   - Celle colorate = impegni
4. **Click su cella colorata** per vedere dettagli
5. Se ha ID Corso, click "Vai al Corso"

### 3. DETTAGLIO CORSO

1. Nel calendario, click su cella con ID Corso
2. Oppure, dagli impegni, click sul badge ID Corso
3. Vedi:
   - Timeline completa attività
   - Grafici
   - Totale giorni
4. Puoi aggiungere note sul corso

### 4. EXPORT EXCEL

1. Click "Export Excel" nel menu
2. File scaricato automaticamente
3. Apri con Excel/LibreOffice
4. Contiene database completo

## 🎨 LEGENDA COLORI

- 🟢 **Verde**: CORSO PDT-CT
- 🔵 **Azzurro**: CORSO ADT
- 🟣 **Viola**: CORSO AMC, Tirocinio
- 🟠 **Arancione**: CORSO COMM.LE, Pratiche
- 🔵 **Blu**: ESAMI (varie tonalità)
- 🟡 **Giallo**: FERIE
- 🔴 **Rosso**: MALATTIA
- ⚫ **Grigio**: Varie, Riunioni

## 🔧 PERSONALIZZAZIONE

### Aggiungere Istruttori

Modifica `database.py`, sezione `istruttori_default`:
```python
istruttori_default = [
    "ANTONELLI S.",
    "NUOVO ISTRUTTORE",  # Aggiungi qui
    # ...
]
```

Poi rigenera database:
```bash
rm calendario.db
python database.py
```

### Aggiungere Tipi Attività

Modifica `database.py`, sezione `attivita_default`:
```python
attivita_default = [
    ("NUOVA ATTIVITÀ", "COLORE_HEX", "CATEGORIA"),
    # ...
]
```

Esempio:
```python
("CORSO SPECIALE", "FF5733", "CORSO"),
```

## 🐛 RISOLUZIONE PROBLEMI

**Problema: Errore "port 5000 already in use"**
Soluzione: Cambia porta in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

**Problema: Pagina bianca**
Soluzione:
1. Verifica server in esecuzione
2. Controlla console per errori
3. Riavvia server

**Problema: Calendario vuoto**
Soluzione:
1. Verifica impegni inseriti nel database
2. Controlla anno corretto
3. Premi F5 per ricaricare

**Problema: Non vedo colori**
Soluzione:
1. Controlla JavaScript attivo nel browser
2. Svuota cache (Ctrl+F5)
3. Verifica console browser (F12)

## 📞 SUPPORTO

Per problemi o domande:
1. Controlla questa guida
2. Controlla console server per errori
3. Controlla console browser (F12)

## 🔒 SICUREZZA

⚠️ **IMPORTANTE:**
- Questa app è per RETE INTERNA
- NON esporre su Internet senza sicurezza
- Nessun sistema di autenticazione incluso
- Backup periodici del file `calendario.db`

## 📁 STRUTTURA FILE

```
calendario_app/
├── app.py              # Server Flask principale
├── database.py         # Gestione database
├── requirements.txt    # Dipendenze Python
├── calendario.db       # Database SQLite (creato automaticamente)
├── templates/          # Template HTML
│   ├── base.html
│   ├── index.html
│   ├── impegni.html
│   ├── calendario.html
│   └── corso.html
└── static/             # File statici
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## 🎉 BUON LAVORO!

Il sistema è pronto per essere usato da 40-50 istruttori!

---

**Sviluppato con ❤️ per Istruttori Ferroviari**

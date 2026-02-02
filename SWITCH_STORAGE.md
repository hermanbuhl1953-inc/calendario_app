# 🔄 Come Passare da Locale a SharePoint Multi-Utente

## 🎯 Due Modalità Disponibili

### **Modalità 1: LocalStorage** (Singolo Utente)
- ✅ File locale sul tuo PC
- ✅ Zero configurazione
- ✅ Funziona offline
- ❌ Ogni utente ha i SUOI dati separati
- ❌ Non sincronizza tra utenti

### **Modalità 2: SharePoint** (80+ Utenti Concorrenti)
- ✅ Database condiviso su SharePoint
- ✅ Tutti vedono stessi dati
- ✅ Auto-sincronizzazione ogni 30 sec
- ✅ Gestione conflitti automatica
- ⚠️ Richiede SharePoint Online
- ⚠️ Richiede configurazione liste

---

## 🔧 Switch da LocalStorage a SharePoint

### Step 1: Apri `index.html`

Cerca queste righe (circa riga 699):

```html
<!-- OPZIONE 1: LocalStorage (file locale, singolo utente) -->
<script src="static/js/db-storage.js"></script>

<!-- OPZIONE 2: SharePoint Multi-Utente (80+ utenti concorrenti) -->
<!-- <script src="static/js/db-sharepoint.js"></script> -->
```

### Step 2: Commenta LocalStorage, Attiva SharePoint

**PRIMA:**
```html
<script src="static/js/db-storage.js"></script>
<!-- <script src="static/js/db-sharepoint.js"></script> -->
```

**DOPO:**
```html
<!-- <script src="static/js/db-storage.js"></script> -->
<script src="static/js/db-sharepoint.js"></script>
```

### Step 3: Rinomina e Upload

1. Rinomina: `index.html` → `index.aspx`
2. Upload su SharePoint nella libreria Documenti
3. Crea le liste SharePoint (vedi GUIDA_SHAREPOINT_MULTIUTENTE.md)

### Step 4: Test

Apri nel browser:
```
https://tuodominio.sharepoint.com/sites/TuoSito/Documenti/index.aspx
```

Controlla console (F12):
```
✅ SharePoint Database inizializzato
```

---

## 🔙 Switch da SharePoint a LocalStorage

Inverti il processo:

```html
<script src="static/js/db-storage.js"></script>
<!-- <script src="static/js/db-sharepoint.js"></script> -->
```

Salva e apri `index.html` nel browser locale.

---

## 📊 Confronto Performance

| Caratteristica | LocalStorage | SharePoint |
|---------------|--------------|------------|
| **Utenti simultanei** | 1 | 80+ |
| **Sincronizzazione** | ❌ No | ✅ Sì (30 sec) |
| **Conflitti** | N/A | ✅ Gestiti |
| **Offline** | ✅ Sì | ❌ No |
| **Setup** | 0 min | 30 min |
| **Costo** | Gratis | Office 365 |
| **Performance** | ⚡ Istantaneo | 🔄 ~500ms API |

---

## 🎯 Quando Usare Cosa?

### Usa **LocalStorage** se:
- ✅ Sei solo tu a usare l'app
- ✅ Vuoi testare senza SharePoint
- ✅ Ogni ufficio ha i SUOI dati separati
- ✅ Non serve sincronizzazione

### Usa **SharePoint** se:
- ✅ 80 persone devono modificare
- ✅ Serve database centrale condiviso
- ✅ Hai Office 365 disponibile
- ✅ Vuoi audit log automatico
- ✅ Serve backup professionale

---

## 🚀 Migrazione Dati da LocalStorage a SharePoint

Hai già dati in LocalStorage e vuoi migrare?

### Script di Migrazione

1. Apri `index.html` (versione LocalStorage)
2. Apri console browser (F12)
3. Esegui:

```javascript
// 1. Esporta dati LocalStorage
const datiLocali = {
    istruttori: JSON.parse(localStorage.getItem('istruttori') || '[]'),
    attivita: JSON.parse(localStorage.getItem('attivita') || '[]'),
    impegni: JSON.parse(localStorage.getItem('impegni') || '[]'),
    aree: JSON.parse(localStorage.getItem('aree') || '[]'),
    festivi: JSON.parse(localStorage.getItem('festiviCustom') || '[]'),
    utenti: JSON.parse(localStorage.getItem('utenti') || '[]')
};

// 2. Salva in file JSON
const blob = new Blob([JSON.stringify(datiLocali, null, 2)], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'migrazione_sharepoint.json';
a.click();
```

4. Passa a versione SharePoint (cambia script in `index.html`)
5. Apri versione SharePoint
6. Usa funzione "Import JSON" nell'app
7. Seleziona file `migrazione_sharepoint.json`
8. ✅ Tutti i dati sono in SharePoint!

---

## ⚠️ IMPORTANTE: Backup Prima di Migrare

**SEMPRE** fai backup prima di passare a SharePoint:

1. Esporta dati LocalStorage (script sopra)
2. Salva `migrazione_sharepoint.json` in luogo sicuro
3. Testa SharePoint con pochi dati
4. Verifica tutto funziona
5. Solo DOPO importa tutto

---

## 📞 Help!

### "Non funziona su SharePoint!"

**Checklist debug:**

1. Console browser mostra errori?
   ```
   F12 → Tab Console → Cerca errori rossi
   ```

2. Script corretto caricato?
   ```javascript
   // In console
   console.log(db.constructor.name);
   // Deve essere: "SharePointDatabase"
   ```

3. Liste create?
   ```
   Vai su: Contenuti del sito
   Dovresti vedere: CalendarioIstruttori, CalendarioAttivita, ecc.
   ```

4. Permessi?
   ```
   Prova ad aprire manualmente una lista
   Se vedi "Access Denied" → problema permessi
   ```

### "LocalStorage non si sincronizza!"

**È normale!** LocalStorage NON sincronizza tra browser/utenti.

Per sincronizzazione serve SharePoint (vedi sopra).

---

## 🎓 Best Practice

### Per Sviluppo/Test
```
Usa: LocalStorage
- Veloce
- Nessuna configurazione
- Test immediati
```

### Per Produzione 80 Utenti
```
Usa: SharePoint
- Database professionale
- Sincronizzazione real-time
- Audit log incluso
```

### Per Deployment Ibrido
```
Due versioni parallele:
1. index_local.html → LocalStorage (demo/test)
2. index_sharepoint.aspx → SharePoint (produzione)
```

---

**Versione**: 2.0  
**Supporta**: Entrambe le modalità  
**Switch**: 1 riga di codice  
**Migrazione**: Script automatico incluso

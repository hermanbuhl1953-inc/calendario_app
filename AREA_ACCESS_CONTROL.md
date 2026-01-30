# Sistema di Aree e Autorizzazioni - Calendario Istruttori

## 📋 Panoramica

Il sistema implementa un controllo degli accessi basato su **4 aree di competenza** e **3 livelli di autorizzazione**.

---

## 🎯 Aree di Competenza

1. **Scorta** (Rosso: #dc3545)
2. **Condotta** (Blu: #0d6efd)
3. **Verifica** (Verde: #198754)
4. **Manovra** (Giallo: #ffc107)

---

## 👥 Livelli di Autorizzazione

### 1. **Admin** 
- **Accesso**: Completo a tutte le aree e funzionalità
- **Permessi**:
  - ✅ Visualizza tutte le aree
  - ✅ Gestisce utenti (crea/modifica/disattiva)
  - ✅ Gestisce istruttori e assegna aree
  - ✅ Edita calendari, corsi, attività
  - ✅ Accesso Audit Log
  - ✅ Configurazione sistema (festività, tipi attività)

### 2. **Supervisor** (Capo Istruttori)
- **Accesso**: Tutte le aree, senza gestione utenti
- **Permessi**:
  - ✅ Visualizza tutte le aree
  - ✅ Edita calendari, corsi, attività
  - ✅ Gestisce impegni e sostituzioni
  - ✅ Export Excel
  - ✅ Report giorni
  - ❌ NO gestione utenti
  - ❌ NO Audit Log
  - ❌ NO configurazione sistema

### 3. **Editor/Viewer** (Istruttore)
- **Accesso**: Solo area assegnata
- **Permessi**:
  - ✅ Visualizza solo la propria area
  - ✅ Vede calendari e istruttori della propria area
  - ✅ (Editor) Può editare impegni della propria area
  - ❌ NO accesso ad altre aree
  - ❌ NO gestione utenti
  - ❌ NO configurazione

---

## 🔧 Implementazione Tecnica

### Database

**Tabella `aree`**:
```sql
CREATE TABLE aree (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    descrizione TEXT,
    colore TEXT,
    attiva INTEGER DEFAULT 1
);
```

**Modifiche alle tabelle esistenti**:
```sql
ALTER TABLE istruttori ADD COLUMN area TEXT;
ALTER TABLE utenti ADD COLUMN area TEXT;
```

**Nuovo ruolo**:
```sql
INSERT INTO ruoli (nome, descrizione)
VALUES ('supervisor', 'Capo Istruttori - Vede tutte le aree, edita calendari, no gestione utenti');
```

### Decoratori di Autorizzazione

**`@require_login`**: Richiede login valido

**`@require_role('Admin')`**: Solo Admin

**`@require_editor`**: Admin o Editor

**`@require_supervisor`**: Admin, Supervisor o Editor (no Viewer)

**`get_user_area_filter()`**: Restituisce area dell'utente o None per Admin/Supervisor

**`filter_by_area(query, area_column)`**: Aggiunge filtro WHERE per area

### Route Protette

**Sempre filtrate per area (Istruttori)**:
- `/impegni` - Lista impegni/assenze
- `/calendario/<anno>` - Calendario annuale
- `/api/impegni` - GET impegni
- `/api/istruttori` - GET lista istruttori
- `/vista_istruttori` - Vista dettagli istruttori

**Accessibili solo ad Admin**:
- `/admin/utenti` - Gestione utenti
- `/admin/audit-log` - Log audit
- `/api/utenti` - CRUD utenti

**Accessibili ad Admin e Supervisor**:
- `/api/impegni` POST - Creazione impegni
- `/api/corsi` POST - Creazione corsi
- Tutte le modifiche a calendari

---

## 📝 Come Usare

### 1. Assegnare Area ad un Istruttore

**Via Admin UI** (`/istruttori`):
1. Click "Modifica" su istruttore
2. Selezionare Area dal menu a tendina
3. Salva

**Via API**:
```javascript
PUT /api/istruttori/{id}
{
  "nome": "ROSSI MARIO",
  "email": "rossi@trenord.it",
  "area": "Scorta",
  "attivo": 1
}
```

### 2. Creare Utente con Area

**Via Admin UI** (`/admin/utenti`):
1. Compila form "Aggiungi Nuovo Utente"
2. Seleziona Ruolo (es. "Viewer" per istruttore)
3. Seleziona Area di Competenza (es. "Condotta")
4. Lascia "Tutte" se Admin o Supervisor

**Via API**:
```javascript
POST /api/utenti
{
  "username": "rossi.m",
  "password": "password123",
  "ruolo": "Viewer",
  "area": "Condotta",
  "nome": "Mario",
  "cognome": "Rossi"
}
```

### 3. Creare Capo Istruttori

**Via Admin UI**:
1. Vai a `/admin/utenti`
2. Compila form nuovo utente
3. Seleziona Ruolo: **supervisor**
4. Area: lascia **"Tutte"** (vede tutte le aree)
5. Crea utente

Il Capo Istruttori:
- Vedrà tutti i calendari e istruttori
- Potrà editare corsi e impegni
- NON vedrà menu "Admin" nella navbar

---

## 🧪 Testing

### Test 1: Filtro Area Istruttori
1. Login come utente con area "Scorta"
2. Verifica che `/impegni` mostri solo istruttori area Scorta
3. Verifica che `/calendario/2026` mostri solo impegni area Scorta
4. Verifica che dropdown istruttori mostri solo area Scorta

### Test 2: Supervisor Vede Tutto
1. Login come supervisor
2. Verifica accesso a tutte le aree
3. Verifica che menu "Admin" NON appaia
4. Verifica possibilità di editare corsi

### Test 3: Admin Accesso Completo
1. Login come Admin
2. Verifica visibilità tutte le aree
3. Verifica accesso a `/admin/utenti`
4. Verifica possibilità di creare/modificare utenti

---

## 🔄 Migration

**Eseguita automaticamente** con:
```bash
python migration_add_areas.py
```

**Output atteso**:
```
✅ Aggiunta colonna 'area' a tabella istruttori
✅ Aggiunta colonna 'area' a tabella utenti
✅ Creata tabella 'aree'
✅ Inserita area: Scorta
✅ Inserita area: Condotta
✅ Inserita area: Verifica
✅ Inserita area: Manovra
✅ Creato ruolo 'supervisor'
✅ Creati indici per area e ruolo
```

---

## ⚠️ Note Importanti

1. **Istruttori senza area**: Se un istruttore non ha area assegnata, NON apparirà negli elenchi filtrati. Assegnare sempre un'area.

2. **Utenti senza area**: Admin e Supervisor non devono avere area assegnata (NULL o vuoto = vedono tutto).

3. **Compatibilità**: Gli istruttori e utenti esistenti non hanno area assegnata. Dopo la migration, Admin deve assegnare le aree manualmente.

4. **Visibilità Corsi**: Un corso è visibile se almeno un istruttore del corso appartiene all'area dell'utente loggato.

---

## 📊 Esempi Pratici

### Scenario 1: Istruttore Scorta
- **Utente**: Mario Rossi, ruolo Viewer, area Scorta
- **Vede**: Solo istruttori e impegni area Scorta
- **Può**: Visualizzare calendari e report della sua area
- **Non può**: Vedere altre aree, modificare, accedere admin

### Scenario 2: Capo Area Condotta
- **Utente**: Luigi Verdi, ruolo Supervisor, nessuna area
- **Vede**: Tutte le 4 aree
- **Può**: Editare calendari, creare corsi, gestire impegni
- **Non può**: Creare utenti, vedere audit log

### Scenario 3: Amministratore IT
- **Utente**: Admin Trenord, ruolo Admin, nessuna area
- **Vede**: Tutto
- **Può**: Tutto (gestione utenti, configurazione, audit)

---

## 🚀 Deploy su Render

La migration viene eseguita automaticamente al deploy:
1. Render rileva modifiche in `database.py` 
2. Esegue `migration_add_areas.py` se non già eseguita
3. Admin deve poi assegnare aree manualmente via UI

---

**Ultima modifica**: 30 Gennaio 2026  
**Versione**: 1.0

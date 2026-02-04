# 🏗️ ARCHITETTURA RINATA - SharePoint/Teams NATIVE

> **Constraint**: SOLO SharePoint + Teams. Zero componenti esterni.
> **Data**: Febbraio 2026
> **Status**: Strategy Document (da implementare)

---

## 🎯 NUOVO PARADIGMA

### ❌ VECCHIO APPROCCIO (Abbandonare)
```
Flask Server ← → SQLite ← → Static HTML/localStorage
                                ↓
                          db-sharepoint.js incomplete
```

### ✅ NUOVO APPROCCIO (NATIVO)
```
SharePoint Lists (DB) ← → Teams Tab (UI - SPFx) ← → Teams Bot (Comandi)
                              ↓
                        Power Automate (Workflows)
```

---

## 🏛️ ARCHITETTURA COMPLETA

### **TIER 1: SharePoint Lists (Source of Truth)**

```sql
/* Elenchi necessari in SharePoint */

1. ISTRUTTORI
   - ID (PK)
   - Nome (Text)
   - Email (Text)
   - Area (Choice: Scorta|Condotta|Verifica|Manovra)
   - Attivo (Yes/No)
   - Created/Modified
   - Modified By
   - Created By

2. TIPI_ATTIVITA
   - ID (PK)
   - Nome (Text)
   - Colore (Hex, Text)
   - Categoria (Choice: Formazione|Assenza|Altro)

3. IMPEGNI (CRITICO!)
   - ID (PK)
   - Istruttore (Lookup → ISTRUTTORI.ID)
   - Attivita (Lookup → TIPI_ATTIVITA.ID)
   - DataInizio (Date)
   - DataFine (Date)
   - GiorniLavorativi (Number)
   - Note (MultilineText)
   - IDCorso (Text - opzionale, raggruppa impegni)
   - Area (Lookup → ISTRUTTORI.Area)
   - ModifiedBy (Person)
   - Modified (DateTime)
   - CreatedBy (Person)
   - Created (DateTime)
   - SyncVersion (Number) ← CRITICO per offline sync

4. SOSTITUZIONI
   - ID (PK)
   - ImpegnoID (Lookup → IMPEGNI.ID)
   - DataSostituzione (Date)
   - IstruttoreOriginale (Lookup → ISTRUTTORI.ID)
   - IstruttoreSostituto (Lookup → ISTRUTTORI.ID)
   - Note (MultilineText)

5. FESTIVI_CUSTOM
   - ID (PK)
   - Data (Date)
   - Descrizione (Text)
   - Tipo (Choice: AZIENDALE|LOCALE)

6. AUDIT_LOG
   - ID (PK)
   - Azione (Choice: CREATE|UPDATE|DELETE)
   - Tabella (Choice: IMPEGNI|ISTRUTTORI|etc)
   - RecordID (Number)
   - Dettagli (JSON, LargeText)
   - Utente (Person)
   - Timestamp (DateTime)

7. UTENTI
   - ID (PK)
   - Username (Text)
   - Email (Text)
   - Nome (Text)
   - Cognome (Text)
   - Ruolo (Choice: Admin|Supervisor|Editor|Viewer)
   - Area (Choice: Scorta|Condotta|Verifica|Manovra|null)
   - Attivo (Yes/No)
```

---

### **TIER 2: Teams Tab + SPFx (User Interface)**

#### Opzione A: COMPLESSA ma NATIVA (Consigliata per Trenord)
```typescript
// React SPFx Webpart
// Runs in Teams Tab natively

import { SharePointAPI } from '@microsoft/sp-http';
import React, { useState, useEffect } from 'react';

export class CalendarioWebpart extends React.Component {
  private sp: SharePointAPI;
  
  state = {
    impegni: [],
    istruttori: [],
    syncStatus: 'synced', // synced | syncing | offline
    offlineQueue: [],
    lastSyncTime: null,
  };

  async componentDidMount() {
    // 1. Carica da cache IndexedDB
    const cachedData = await this.loadFromIndexedDB();
    this.setState(cachedData);
    
    // 2. Tenta sincronizzazione con SharePoint
    if (navigator.onLine) {
      await this.syncWithSharePoint();
    } else {
      this.setState({ syncStatus: 'offline' });
    }
    
    // 3. Listen for online/offline
    window.addEventListener('online', () => this.syncWithSharePoint());
    window.addEventListener('offline', () => this.setState({ syncStatus: 'offline' }));
  }

  async syncWithSharePoint() {
    this.setState({ syncStatus: 'syncing' });
    
    try {
      // Carica IMPEGNI dalla SharePoint REST API
      const response = await fetch(
        `${this.siteUrl}/_api/web/lists/getByTitle('IMPEGNI')/items?$select=*&$orderby=Created desc`,
        { headers: { 'Accept': 'application/json' } }
      );
      
      const data = await response.json();
      const impegni = data.value;
      
      // Riconcilia offline changes
      await this.reconcileOfflineChanges(impegni);
      
      // Salva in IndexedDB
      await this.saveToIndexedDB(impegni);
      
      this.setState({
        impegni,
        syncStatus: 'synced',
        lastSyncTime: new Date(),
      });
    } catch (err) {
      console.error('Sync error:', err);
      this.setState({ syncStatus: 'offline' });
    }
  }

  async saveImpegno(impegno) {
    if (!navigator.onLine) {
      // Salva in offline queue + IndexedDB
      this.state.offlineQueue.push({
        action: 'create',
        data: impegno,
        timestamp: Date.now(),
      });
      
      await this.saveToIndexedDB({
        ...this.state,
        offlineQueue: this.state.offlineQueue,
      });
      
      alert('Salvato offline. Sincronizzerò quando online.');
      return;
    }
    
    // Online: salva direttamente su SharePoint
    try {
      const response = await fetch(
        `${this.siteUrl}/_api/web/lists/getByTitle('IMPEGNI')/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RequestDigest': this.requestDigest, // CSRF token
          },
          body: JSON.stringify(impegno),
        }
      );
      
      if (!response.ok) {
        throw new Error(`SharePoint error: ${response.status}`);
      }
      
      // Rilancia sync
      await this.syncWithSharePoint();
    } catch (err) {
      alert(`Errore salvataggio: ${err.message}`);
    }
  }

  render() {
    return (
      <div>
        <div className="sync-status">
          Status: {this.state.syncStatus}
          {this.state.lastSyncTime && (
            <span> (ultimo sync: {this.state.lastSyncTime.toLocaleTimeString()})</span>
          )}
          {this.state.offlineQueue.length > 0 && (
            <span className="offline-warning">
              ⚠️ {this.state.offlineQueue.length} modifche in sospeso
            </span>
          )}
        </div>
        
        {/* Calendario Grid */}
        {/* Lista impegni */}
        {/* Modal aggiunta impegno */}
      </div>
    );
  }
}
```

#### Opzione B: VELOCE ma LIMITATA
```html
<!-- HTML iframe dentro Teams Tab -->
<!-- Usa db-sharepoint.js migliorato -->

<!DOCTYPE html>
<html>
<head>
  <script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>
  <script src="db-sharepoint.js"></script>
  <script src="calendario-app.js"></script>
</head>
<body>
  <div id="app"></div>
  
  <script>
    // Carica dati dalla SharePoint REST API
    const db = new SharePointDatabase({
      siteUrl: Office.context.officeTheme.siteUrl,
    });
    
    db.init().then(() => {
      initApp();
    });
  </script>
</body>
</html>
```

**CONSIGLIATO**: Opzione A (SPFx) per produzione Trenord
- Autenticazione integrata Teams
- Offline-first con IndexedDB
- Sync intelligente
- Performance ottima

---

### **TIER 3: Teams Bot (Comandi + Notifiche)**

```python
# Python Bot Framework (runs in Azure App Service as microservice)

from botbuilder.core import TurnContext
from botbuilder.schema import Activity, ChannelAccount
import json

class CalendarioBot(ActivityHandler):
    """
    Bot di Teams per comandi calendario
    - /calendario list - mostra impegni oggi
    - /calendario impegni user:mario - filtra per istruttore
    - @Calendario add mario 2026-02-10 3 giorni CORSO - aggiunge impegno
    """
    
    async def on_message_activity(self, turn_context: TurnContext):
        text = turn_context.activity.text.lower()
        
        # /calendario list
        if text.startswith('/calendario list'):
            impegni = await self.get_impegni_today()
            await self.send_card(turn_context, impegni)
        
        # /calendario impegni user:NAME
        elif text.startswith('/calendario impegni'):
            user = self.extract_username(text)
            impegni = await self.get_impegni_by_user(user)
            await self.send_card(turn_context, impegni)
        
        # @Calendario add ...
        elif text.startswith('@calendario add'):
            await self.handle_add_impegno(turn_context, text)

    async def get_impegni_today(self):
        """Legge da SharePoint IMPEGNI list"""
        spo_response = await self.sp.get(
            f"{self.site_url}/_api/web/lists/getByTitle('IMPEGNI')/items?"
            f"$filter=DataInizio eq '{today}'"
        )
        return spo_response.json()['value']

    async def handle_add_impegno(self, turn_context: TurnContext, text: str):
        """Crea nuovo impegno via Teams comando"""
        # Parse: @Calendario add mario 2026-02-10 3 giorni CORSO
        parts = text.split()
        
        impegno = {
            fields: {
                'IstruttoreTitle': parts[2],  # mario
                'DataInizio': parts[3],        # 2026-02-10
                'GiorniLavorativi': int(parts[4]),  # 3
                'AttivitaTitle': parts[6],    # CORSO
            }
        }
        
        # POST a SharePoint
        response = await self.sp.post(
            f"{self.site_url}/_api/web/lists/getByTitle('IMPEGNI')/items",
            json=impegno
        )
        
        if response.status_code == 201:
            await turn_context.send_activity(
                f"✅ Impegno creato per {parts[2]} il {parts[3]}"
            )
        else:
            await turn_context.send_activity(
                f"❌ Errore: {response.text}"
            )

    async def send_card(self, turn_context: TurnContext, impegni: list):
        """Invia Adaptive Card con impegni"""
        card = {
            "type": "message",
            "attachments": [{
                "contentType": "application/vnd.microsoft.card.adaptive",
                "contentUrl": None,
                "content": {
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.4",
                    "body": [
                        {
                            "type": "TextBlock",
                            "text": "📅 Impegni di oggi",
                            "weight": "bolder",
                            "size": "large"
                        },
                        *[{
                            "type": "FactSet",
                            "facts": [
                                {"name": "Istruttore", "value": imp['fields']['IstruttoreTitle']},
                                {"name": "Attività", "value": imp['fields']['AttivitaTitle']},
                                {"name": "Giorni", "value": str(imp['fields']['GiorniLavorativi'])},
                            ]
                        } for imp in impegni]
                    ]
                }
            }]
        }
        
        await turn_context.send_activity(Activity.from_dict(card))
```

---

### **TIER 4: Power Automate (Workflows)**

```json
{
  "name": "Notifica nuovi impegni",
  "description": "Quando un impegno è creato, notifica in Teams",
  "trigger": "SharePoint - When an item is created (IMPEGNI list)",
  "actions": [
    {
      "action": "Get item",
      "from": "SharePoint IMPEGNI",
      "itemId": "@triggerBody()?['ID']"
    },
    {
      "action": "Post adaptive card to Teams channel",
      "channel": "@{variables('TeamsChannelId')}",
      "card": {
        "body": [
          {
            "type": "TextBlock",
            "text": "🆕 Nuovo impegno creato",
            "weight": "bolder"
          },
          {
            "type": "FactSet",
            "facts": [
              {
                "name": "Istruttore",
                "value": "@{body('Get_item')?['fields']?['IstruttoreTitle']}"
              },
              {
                "name": "Data inizio",
                "value": "@{body('Get_item')?['fields']?['DataInizio']}"
              },
              {
                "name": "Attività",
                "value": "@{body('Get_item')?['fields']?['AttivitaTitle']}"
              }
            ]
          }
        ]
      }
    },
    {
      "action": "Send Teams message to user",
      "recipient": "@{body('Get_item')?['fields']?['CreatedById']}",
      "message": "Impegno salvato con successo ✅"
    }
  ]
}
```

---

## 🔄 FLUSSO DATI COMPLETO (Offline-First)

### Scenario 1: **Utente Online**
```
User clicks "Salva impegno"
    ↓
Check navigator.onLine
    ↓ YES
POST to SharePoint REST API
    ↓ 201 Created
Update IndexedDB cache
    ↓
Power Automate triggers (notifica Teams)
    ↓
✅ "Impegno salvato"
```

### Scenario 2: **Utente Offline**
```
User clicks "Salva impegno"
    ↓
Check navigator.onLine
    ↓ NO
Save to offlineQueue (in IndexedDB)
    ↓
Update local IndexedDB cache
    ↓
⚠️ "Salvato offline. Sincronizzerò quando online"
```

### Scenario 3: **Torna Online**
```
Connection restored
    ↓
Trigger "sync daemon"
    ↓
For each item in offlineQueue:
  - POST to SharePoint
  - If 201: remove from queue
  - If error: show conflict resolution UI
    ↓
Reload impegni da SharePoint
    ↓
Update IndexedDB
    ↓
✅ "Sincronizzazione completata (5 elementi)"
```

---

## 📋 IMPLEMENTAZIONE STEP BY STEP

### **SETTIMANA 1: Preparazione SharePoint**

1. **Creare le 7 liste** in SharePoint Online
   - Configurare colonne esatte
   - Configurare lookups
   - Configurare Person fields

2. **Creare Group di SharePoint**
   - "Calendario Istruttori Admin" (chi può gestire)
   - "Calendario Istruttori Users" (chi può usare)

3. **Impostare permissions**
   - Admin: Full Control
   - Users: Edit
   - Viewer: Read

### **SETTIMANA 2: Teams Tab + SPFx**

1. **Scaffoldare SPFx project**
   ```bash
   yo @microsoft/sharepoint
   ```

2. **Implementare CalendarioWebpart component**
   - React
   - IndexedDB cache
   - Sync logic

3. **Configurare offline-first**
   - Dexie.js per IndexedDB
   - Sync conflict resolution

### **SETTIMANA 3: Teams Bot**

1. **Creare Bot in Azure**
2. **Implementare comandi**
3. **Connettere a SharePoint REST API**

### **SETTIMANA 4: Power Automate + Polish**

1. **Creare 3-4 flow**
2. **Testing completo**
3. **Documentazione Trenord**

---

## 🛡️ SECURITY CONSIDERATIONS

### Authentication
```
SharePoint handles auth via Teams context
- User info via Office.context.user
- Site URL via Office.context.site.url
- Token auto-refresh
```

### Authorization
```
SharePoint list permissions = RBAC
- Admin list: Full Control
- Standard columns: no direct edit
- Formula columns for computed fields
```

### Data Validation
```
- SPFx validation client-side
- SharePoint list validation server-side
- Audit log in AUDIT_LOG list
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### IndexedDB Schema
```javascript
{
  stores: {
    impegni: '&ID, istruttoreID, dataInizio',
    istruttori: '&ID, nome',
    attivita: '&ID, nome',
    offlineQueue: '&ID, timestamp',
  }
}
```

### Sync Strategy
- **Incremental sync**: Only fetch modified > lastSyncTime
- **Batch requests**: POST 10 changes at once
- **Compression**: Delta sync, not full refetch
- **Debounce**: Wait 2 sec before sync (reduce requests)

### Caching Rules
```
- Istruttori: Cache 24h (change rarely)
- Attivita: Cache 24h (change rarely)
- Impegni: Cache 30 min (change frequently)
- Sync immediately on create/update
```

---

## 📊 COMPARISON: OLD vs NEW

| Aspetto | Vecchio (Flask) | Nuovo (SPO/Teams) |
|---------|---------|---------|
| **Database** | SQLite file | SharePoint lists |
| **Server** | Flask Python | N/A (serverless) |
| **UI** | HTML static | Teams SPFx Tab |
| **Notifiche** | None | Teams native |
| **Offline** | localStorage (5MB) | IndexedDB (500MB+) |
| **Sync** | Manual | Auto w/ conflict resolution |
| **Auth** | Custom login | Azure AD (Teams) |
| **Backup** | Manual | Automatic (SPO) |
| **Multi-user** | Not safe | Safe (SharePoint versioning) |
| **Deploy** | Docker/server | Teams app store |
| **Cost** | Server+bandwidth | Included in M365 |

---

## ✅ VANTAGGI ARCHITETTURA NUOVA

1. ✅ **Zero infrastructure** - tutto su Microsoft 365
2. ✅ **Offline-first** - lavora senza internet
3. ✅ **Real-time collaboration** - Teams notifications
4. ✅ **Auto backup** - SharePoint versioning
5. ✅ **Audit trail** - compliance ready
6. ✅ **Mobile first** - Teams app funziona ovunque
7. ✅ **Scalable** - SharePoint handles 1M items
8. ✅ **Secure** - Azure AD + SharePoint RBAC
9. ✅ **No maintenance** - Microsoft lo mantiene
10. ✅ **Fast deploy** - Teams app store

---

## ❌ TRADEOFFS

1. ❌ **Meno customization** - dipendi da SPFx
2. ❌ **Curve learning** - developers devono imparare SPFx
3. ❌ **Complex offline sync** - bisogna gestire conflitti
4. ❌ **SharePoint list limits** - 30k threshold per view
5. ❌ **Throttling** - Microsoft limita API calls

---

## 🎯 NEXT STEPS

**Domande per definire priorità:**

1. **SPFx o HTML iframe?**
   - SPFx = professional, ma 5+ giorni
   - HTML = veloce, ma limitato in offline sync

2. **Bot è critico?**
   - Sì = +2 giorni
   - No = skip per v1

3. **Offline è must-have?**
   - Sì = +3 giorni (sync complesso)
   - No/desireable = semplifichiamo

4. **Quando deploy su Trenord?**
   - Urgente (1-2 sett)? → HTML + basic sync
   - Timeframe (1 mese)? → SPFx completo

Cosa preferisci?

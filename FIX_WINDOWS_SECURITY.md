# FIX: Windows Security Blocca CDN - Calendario Istruttori

## 🛡️ Problema

**Windows Security** (o **Microsoft Defender SmartScreen**) blocca l'accesso a `cdn.jsdelivr.net`, impedendo il caricamento di Bootstrap e causando:

1. **Popup all'avvio**: "Questo contenuto è stato bloccato dall'amministratore IT"
2. **Layout rotto**: Pagine senza stili CSS
3. **Errori SSL**: `SSLV3_ALERT_HANDSHAKE_FAILURE`

## ✅ Soluzione 1: Sbloccare CDN in Windows Security (Consigliato)

### Metodo A: Via Interfaccia Grafica

1. **Apri Windows Security**:
   - Cerca "Windows Security" nel menu Start
   - Oppure: Impostazioni → Privacy e sicurezza → Sicurezza di Windows

2. **Controllo app e browser**:
   - Click su "Protezione basata sulla reputazione"
   - Scorri fino a "Blocco contenuto potenzialmente indesiderato"

3. **Aggiungi eccezione**:
   - Vai a "Blocco contenuto web"
   - Aggiungi `*.jsdelivr.net` alle eccezioni

### Metodo B: Via Registro di Windows (Admin)

1. Apri **Editor del Registro** (WIN+R → `regedit`)

2. Naviga a:
   ```
   HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender\SmartScreen
   ```

3. Crea chiave DWORD (32-bit):
   - Nome: `PreventOverride`
   - Valore: `0`

4. Riavvia il browser

### Metodo C: Group Policy (Admin di Dominio)

Se sei in dominio aziendale Trenord, contatta IT per:

```
Criterio: Configurazione computer → Modelli amministrativi 
          → Componenti di Windows → Microsoft Defender SmartScreen
          → Explorer → Configura Microsoft Defender SmartScreen

Impostazione: Disattivato per *.jsdelivr.net
```

## ✅ Soluzione 2: Eseguire su Render (Cloud)

Il calendario è già deployato su Render e **NON ha problemi di CDN**:

🌐 **URL Produzione**: https://calendario-app-jcpi.onrender.com

1. Accedi direttamente al link sopra
2. Login con le credenziali Trenord
3. Funziona senza blocchi Windows

## ✅ Soluzione 3: Usare Browser Alternativo

Se Edge/Chrome bloccano:

1. **Prova Firefox**: Usa Firefox invece di Edge
2. **Modalità Incognito**: Ctrl+Shift+N (bypassa alcuni filtri)
3. **Disattiva SmartScreen**: Edge → Impostazioni → Privacy → SmartScreen → Off (temporaneo)

## 🧪 Verifica Funzionamento

Dopo aver applicato una soluzione:

1. Riavvia il browser
2. Vai a http://localhost:5000 (se locale) o https://calendario-app-jcpi.onrender.com
3. **Verifica**:
   - ✅ Nessun popup di blocco
   - ✅ Pagina con layout corretto (menu, bottoni, colori)
   - ✅ Console browser (F12) senza errori `net::ERR_BLOCKED_BY_CLIENT`

## 🔧 Contatti Supporto

- **IT Trenord**: gestioneabilitazioni@trenord.it
- **Sviluppatore**: 3102011@trenord.it

## 📝 Note Tecniche

- **CDN usato**: `cdn.jsdelivr.net` (legittimo, usato da milioni di siti)
- **File caricati**: Bootstrap 5.3.0 CSS/JS (framework UI standard)
- **Alternativa**: Hosting locale fallisce per SSL in rete Trenord
- **Sicurezza**: CDN è sicuro, viene usato da Microsoft, Google, GitHub

---

**Ultima modifica**: 30 Gennaio 2026  
**Status**: Deploy commit 06fe589

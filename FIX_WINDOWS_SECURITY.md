# FIX: Windows Security Blocca CDN - Calendario Istruttori

## 🛡️ Problema

**Windows Security** blocca l'accesso ai CDN, causando:

- **Errori**: `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` o `ERR_BLOCKED_BY_CLIENT`
- **Layout rotto**: Nessun stile Bootstrap
- **Console errors**: Bootstrap CSS/JS non caricati

---

## ✅ **SOLUZIONE CONSIGLIATA: Usare Render**

🌐 **https://calendario-app-jcpi.onrender.com**

✅ Funziona perfettamente (nessun blocco)  
✅ Sempre aggiornato  
✅ Accessibile da ovunque  

**Login**: 3102011 / Qaqqa1234 (o tue credenziali)

---

## Alternative (solo localhost)

### 1. Sbloccare CDN in Windows Security

**Metodo Semplice**:
1. WIN+S → "Windows Security"
2. Controllo app e browser → Protezione reputazione
3. Disattiva "Blocco contenuto indesiderato"
4. Riavvia browser

**Metodo IT** (contatta gestioneabilitazioni@trenord.it):
- Sblocca `unpkg.com` e `cdn.jsdelivr.net`

### 2. Browser Alternativo
- **Firefox** (bypassa SmartScreen)
- **Modalità Incognito** (Ctrl+Shift+N)

---

## 🧪 Verifica Funzionamento

1. Riavvia browser
2. F12 → Console
3. Nessun errore SSL = ✅ Funziona

---

**Supporto**: 3102011@trenord.it  
**Deploy**: Commit 67f5ace

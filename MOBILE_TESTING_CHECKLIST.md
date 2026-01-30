# 📱 Mobile Testing Checklist - Calendario Istruttori

## 🎯 Obiettivo
Verificare che l'applicazione Calendario Istruttori sia completamente utilizzabile e visivamente corretta su **smartphone e tablet aziendali** (iOS/Android).

---

## 📋 Pre-Test Checklist

### Ambiente
- [ ] Accesso a Wi-Fi stabile o 4G
- [ ] Dispositivo mobile con iOS 13+ o Android 8+
- [ ] Browser aggiornato (Safari, Chrome, Firefox)
- [ ] Battery > 50% per test completo
- [ ] App già installata/accessibile via URL

### Test Environment
- [ ] Accesso credenziali Trenord (username/password)
- [ ] Account con ruolo idoneo (Istruttore/Admin)
- [ ] Dati test disponibili (corsi, istruttori, impegni)

---

## 📱 Test su Smartphone (360px - 480px)

### 1. Home Page (/)
- [ ] Navbar menu hamburger visibile
- [ ] Logo "📅 Calendario Istruttori" leggibile
- [ ] Pulsante Dark Mode funzionante
- [ ] Logout link funzionante
- [ ] Footer links accessibili

### 2. Vista Corsi (/vista_corsi)
- [ ] Titolo "📚 Gestione Corsi" centrato
- [ ] Filtri stackati verticalmente (non affiancati)
- [ ] Ricerca campo input pieno larghezza
- [ ] Filtro anno dropdown funzionante
- [ ] Data range selezionabili
- [ ] Pulsante "Ricerca/Reset" full-width
- [ ] **Tabella Corsi:**
  - [ ] Colonne: ID, Periodo, Durata, N° Istruttori, N° Impegni, Azioni
  - [ ] Scorri orizzontalmente per azioni
  - [ ] Pulsanti "Vedi Calendario" e "Modifica" stackati
  - [ ] Badge conteggi visibili
- [ ] Info box ("Come funziona?") collassabile

### 3. Calendario Corso (/corso/[ID])
- [ ] Titolo corso leggibile (es. "Corso 01_25")
- [ ] Info riepilogo (Periodo, Durata, Istruttori) stackate
- [ ] **Tabella Calendario:**
  - [ ] Intestazione "← Scorri →" visibile
  - [ ] Giorni header sticky (rimane in vista durante scroll)
  - [ ] Nome istruttore sticky (sinistra)
  - [ ] Celle attività scrollabili orizzontalmente
  - [ ] Font compatto ma leggibile (0.5rem-0.65rem)
  - [ ] Colori contrasto adeguato
  - [ ] Dark mode: colori tabella leggibili
- [ ] Pulsanti "Aggiungi Attività" e "Torna" full-width
- [ ] Modal "Aggiungi Attività" usabile con tastiera mobile

### 4. Gestione Assenze (/impegni)
- [ ] Titolo "📋 Gestione Assenze" leggibile
- [ ] Pulsante "➕ Aggiungi Nuova Assenza" prominente (btn-lg)
- [ ] **Sezione Filtri:**
  - [ ] Campi stackati verticalmente
  - [ ] Label visibili sopra input
  - [ ] Dropdown select hanno dimensione minima 40px height
  - [ ] Date input touch-friendly (large tap target)
  - [ ] Pulsante "Reset" full-width
- [ ] **Tabella Impegni:**
  - [ ] Headers compatti
  - [ ] Scorri orizzontalmente per colonne extra
  - [ ] Pulsanti azioni accessibili (Modifica, Elimina)
- [ ] Modal edit/new usabile da touch

### 5. Form Input Accessibility
- [ ] Tutti gli input minimo 40px height
- [ ] Font input almeno 16px (non zoom su iOS)
- [ ] Placeholder text visibile e leggibile
- [ ] Focus outline visibile (blue ring)
- [ ] Tastiera mobile non copre pulsanti submit
- [ ] Tap target button minimo 44x44px

### 6. Dark Mode Mobile
- [ ] Toggle 🌙 accessibile in navbar
- [ ] Background sufficientemente scuro (#0f1720)
- [ ] Testo sufficientemente chiaro (#e2e8f0)
- [ ] Tabelle leggibili in dark mode
- [ ] Link blu distinguibili
- [ ] Badge visibili
- [ ] Modal readable

### 7. Performance
- [ ] Primo caricamento < 3 secondi (Wi-Fi)
- [ ] Primo caricamento < 8 secondi (4G)
- [ ] Scroll tabella fluidissimo (no lag)
- [ ] Click responsivo (no delay)
- [ ] Modal apertura immediata
- [ ] Nessuna memoria leak (app usabile per 30+ min)

### 8. Browser Compatibility
- [ ] Safari iOS: tutto funziona
- [ ] Chrome Android: tutto funziona
- [ ] Firefox Android: tutto funziona
- [ ] Brave Android: tutto funziona

---

## 📱 Test su Tablet (600px - 1024px)

### 1. Layout Grid
- [ ] Filtri: 2 colonne su tablet piccolo (600px)
- [ ] Filtri: 2-3 colonne su tablet medio (768px)
- [ ] Tabelle complete visibili senza horizontal scroll (se < 1024px)
- [ ] Pulsanti fianco a fianco (non full-width)

### 2. Tabella Calendario
- [ ] Intestazioni sticky funzionanti
- [ ] Font leggibile (0.65rem - 0.75rem)
- [ ] Celle attività ben spaziate
- [ ] Scroll orizzontale smooth
- [ ] Zoom pinch funziona

### 3. Dark Mode
- [ ] Completamente leggibile
- [ ] Contrasto adeguato
- [ ] Non stancante per lettura prolungata

### 4. Input/Form
- [ ] Touch input comodo da usare
- [ ] Tastiera non invadente
- [ ] Dropdown large enough

---

## 🌍 Test Orientamento Landscape

### Su Smartphone (Landscape)
- [ ] Navbar si adatta (più compatta?)
- [ ] Titoli ridimensionati
- [ ] Tabelle hanno più spazio
- [ ] Pulsanti ancora accessibili
- [ ] Input non coperti da tastiera

### Su Tablet (Landscape)  
- [ ] Layout ottimale
- [ ] Tabelle quasi completamente visibili
- [ ] Spacing appropriato

---

## 🖼️ Rendering Visivo

### Colori
- [ ] Testi contrasto WCAG AA (4.5:1 minimo)
- [ ] Colori non dipendono solo da hue (accessible per daltonismo)
- [ ] Icone emoji visualizzate correttamente

### Font
- [ ] Titoli proporzionati
- [ ] Testo corpo leggibile da 30cm di distanza (gesture naturale)
- [ ] Nessun testo troppo compatto (min 12px desktop equivalent)

### Layout
- [ ] Nessun elemento fuori viewport
- [ ] Nessuno squilibrio visivo
- [ ] Padding/margin consistente
- [ ] Elementi non sovrappositi

---

## 🔄 Interattività

### Touch Gestures
- [ ] Tap su pulsante: feedback visivo (`:active` state)
- [ ] Tap su link: navigazione corretta
- [ ] Long press: accesso menu (se implementato)
- [ ] Scroll orizzontale tabelle: smooth
- [ ] Scroll verticale pagina: smooth
- [ ] Pinch zoom: funzionante (max 5x)
- [ ] Double tap: zoom in (se enabled)

### Dropdown/Menu
- [ ] Menu hamburger apre/chiude correttamente
- [ ] Dropdown menu items tap-responsive
- [ ] Close menu: tap fuori, swipe indietro, o pulsante X

### Modal
- [ ] Apertura smooth
- [ ] Chiusura smooth
- [ ] Pulsanti dentro modal facilmente tappabili
- [ ] Close button (X) accessibile

---

## ⌨️ Tastiera Mobile

### Input Text
- [ ] Focus automatico su primo input (buona UX)
- [ ] Placeholder visibile
- [ ] Cursor visibile
- [ ] Virtual keyboard non copre pulsanti importanti
- [ ] "Next" button navigazione tra campi

### Tipo Keyboard
- [ ] Email input: mostra @
- [ ] Number input: mostra numpad
- [ ] Date input: date picker (se browser supporta)
- [ ] Search input: mostra search key

### Submission
- [ ] Enter key submits form
- [ ] Tab navigazione tra campi
- [ ] Pulsante Submit è ultimo elemento (non coperto)

---

## 🚀 Performance Mobile

### Loading
- [ ] HTML/CSS carica immediatamente
- [ ] Logo/branding visibile in <1s
- [ ] Tabelle dati caricate entro 3s
- [ ] JS interattività funzionante dopo 2s
- [ ] Nessun FOUC (Flash of Unstyled Content)

### Runtime
- [ ] Scroll smooth (60fps ideale, min 30fps)
- [ ] Tap response < 100ms
- [ ] Modal apertura < 300ms
- [ ] Nessun jank/stutter durante uso
- [ ] Memory non cresce indefinitamente

### Network
- [ ] Funziona su Wi-Fi 5GHz
- [ ] Funziona su 4G LTE
- [ ] Funziona su 3G (lento ma usabile)
- [ ] Graceful degradation se offline (messaggio warning)

---

## 🔒 Sicurezza Mobile

### Session
- [ ] Login funziona
- [ ] Session mantiene active durante uso
- [ ] Logout completo (nessuno data residuo)
- [ ] Auto-logout dopo inattività (se configurato)
- [ ] CSRF token correttamente inviato

### Data
- [ ] Dati sensibili non visibili in URL
- [ ] Nessun password leaking in console
- [ ] HTTPS usato (lock icon visibile)
- [ ] Cookies secure/httponly

### Input
- [ ] XSS prevention (input sanitized)
- [ ] SQL injection prevention (parameterized queries)
- [ ] CSRF protection active

---

## 📊 Test Data

### Valori Test
```
Username: test_istruttore
Password: [Ask IT Trenord]

Corsi di test:
- ID: 01_25 (Gen 2025)
- ID: 02_25 (Gen 2025)
- ID: TS_001 (Test Short)

Istruttori:
- Mario Rossi
- Luigi Bianchi
- Anna Verdi

Attività:
- Lezione Teorica
- Lezione Pratica
- Verifica Competenze

Assenze:
- Ferie
- Malattia
- Altro
```

### Test Scenarios
1. **Happy Path:** Login → View Course → Edit → Add Activity → Logout
2. **Filter Test:** Filter courses by year → Check results filtered
3. **Mobile Edit:** Open modal from phone → Edit data → Save
4. **Long Data:** Open course with many instructors → horizontal scroll
5. **Dark Mode:** Switch on/off → all readable
6. **Landscape:** Rotate phone → layout adapts

---

## 📝 Bug Report Template

Se riscontri problemi, segnalare con:

```
Dispositivo: [iPhone 14, iPad Air, Galaxy S23, etc.]
OS: [iOS 17.2, Android 14, etc.]
Browser: [Safari, Chrome, Firefox]
Orientamento: [Portrait/Landscape]
URL: [es. https://app.trenord.it/vista_corsi]

PROBLEMA:
[Descrizione esatta del problema]

STEP RIPRODURRE:
1. [Primo passo]
2. [Secondo passo]
3. [Terzo passo]

COMPORTAMENTO ATTESO:
[Cosa dovrebbe accadere]

COMPORTAMENTO EFFETTIVO:
[Cosa accade invece]

SCREENSHOT: [Allegare]

CONSOLE ERRORS: [Eventuale codice errore]
```

---

## ✅ Test Completion

### Sign-off
- Tester: ___________________
- Data: ___________________
- Versione Browser: ___________________
- Dispositivi Testati: ___________________

### Risultato
- [ ] ✅ PASS - Pronto per produzione
- [ ] ⚠️ WARNING - Alcuni difetti minori
- [ ] ❌ FAIL - Problemi critici trovati

### Note Aggiuntive
```
[Spazio per note aggiuntive, edge cases, osservazioni]
```

---

## 📞 Escalation

Se trovi bug critici:
1. Registra video del problema (screen recording)
2. Salva screenshot
3. Nota steps esatti per riprodurre
4. Contatta: pianificazione_monitoraggio_accompagnamenti@trenord.it

Priority:
- 🔴 **Critical**: App unusable
- 🟠 **High**: Core feature broken
- 🟡 **Medium**: Minor UX issue
- 🔵 **Low**: Enhancement/cosmetic

---

**Grazie per il testing! La tua feedback è essenziale per la qualità dell'app.**

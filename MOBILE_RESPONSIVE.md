# 📱 Guida Responsive Design - Accesso da Tablet e Cellulare

## ✅ Supporto Mobile Ottimizzato

L'applicazione **Calendario Istruttori** è stata completamente ottimizzata per funzionare su **tablet e smartphone** aziendali (iOS e Android).

---

## 📲 Dispositivi Supportati

### ✔️ Completamente Supportati
- **Smartphone**: iPhone (SE, 11, 12, 13, 14+), Samsung Galaxy, POCO, Motorola
- **Tablet**: iPad (da 7" a 12"), Galaxy Tab, Lenovo Tab
- **Dispositivi Rettangolari**: Schermi da **320px a 1920px** di larghezza

### Orientamenti Supportati
- **Portrait** (verticale) - ottimale per phone
- **Landscape** (orizzontale) - offre più spazio per tabelle

---

## 🎯 Breakpoints Responsive

L'app si adatta automaticamente a questi schermi:

| Tipo Dispositivo | Larghezza | Ottimizzazioni |
|------------------|-----------|---|
| **Telefono Piccolo** | 320px | Font compatto, singola colonna, scorri tabelle |
| **Telefono Standard** | 360-480px | Touch-friendly, pulsanti grandi, stacking verticale |
| **Tablet Piccolo** | 600-768px | Layout a 2 colonne, tabelle parzialmente visibili |
| **Tablet/iPad** | 769px+ | Layout completo, tabelle visibili |
| **Desktop** | 1024px+ | Layout ottimale 3+ colonne, effetti hover |

---

## 🔧 Miglioramenti Implementati

### 1. **Touch-Friendly Design**
✅ Pulsanti e controlli con minimo **44x44px** (standard WCAG)  
✅ Form input con altezza **44px** minimo  
✅ Input text con font **16px** (previene zoom involontario su iOS)  
✅ Feedback visivo su tap (`:active` state)  

### 2. **Navigazione Mobile**
✅ Navbar responsive con hamburger menu (automatico su schermi piccoli)  
✅ Dropdown menu accessibili da touch  
✅ Navbar compatta in landscape per massimizzare spazio  

### 3. **Tabelle Calendari**
✅ **Scroll orizzontale fluido** con `-webkit-overflow-scrolling: touch`  
✅ Indicatore "← Scorri →" su schermi piccoli  
✅ Font dimensionato automaticamente (da 0.45rem a 0.75rem)  
✅ Sticky headers e row headers (rimangono visibili durante scroll)  

### 4. **Layout Responsive**
✅ Tutti i campi di input **full-width** su schermi < 768px  
✅ Pulsanti si stackano verticalmente su mobile  
✅ Spacing e padding ridotto per compattezza  
✅ Icone emoji supportate su tutti i browser mobili  

### 5. **Dark Mode Mobile**
✅ Perfettamente supportato on mobile/tablet  
✅ Colori optimizzati per schermi AMOLED  
✅ Ridotta affaticamento oculare in ambienti scuri  

### 6. **Performance Mobile**
✅ CSS media queries ottimizzate  
✅ Nessun caricamento aggiuntivo (responsive via CSS)  
✅ Compatibile con connessioni 3G/4G lente  
✅ Ridotto uso di memoria su dispositivi old  

---

## 📖 Come Usare da Mobile

### 🏠 Home Page
1. Apri l'app dal browser (es. Safari, Chrome)
2. Aggiungi alla home screen (iOS: "Condividi" → "Aggiungi alla Home"; Android: menu "Installa app")
3. L'app sarà disponibile come icona fullscreen

### 📚 Vista Corsi (Desktop: 3 colonne → Mobile: 1 colonna)
**Su Telefono:**
- Filtri si stackano verticalmente
- Tabella è scrollabile orizzontalmente
- Pulsanti "Vedi Calendario" e "Modifica" sono full-width

**Su Tablet:**
- 2 filtri per riga
- Tabella parzialmente scrollabile

**Su Desktop:**
- 4 filtri in una riga
- Tabella visibile completamente

### 📅 Calendario del Corso (Tabella Orizzontale Larga)
**Su Tutti i Dispositivi:**
1. I giorni scorrono orizzontalmente
2. L'intestazione "Nome Istruttore" rimane visibile a sinistra
3. Su mobile: vedi l'indicatore "← Scorri →" sotto la tabella

**Touch Interaction:**
- Tap su una cella attività per editarla
- Hold per vedere opzioni aggiuntive (se implementato)

### 📋 Gestione Assenze
**Su Mobile:**
- Filtri organizzati verticalmente
- Tabella con colonne critiche (ID, Istruttore, Attività)
- Pulsanti azioni in fondo (Modifica, Elimina)

**Tip:** Usa landscape per vedere più dettagli senza scrollare

---

## ⚙️ Ottimizzazioni Tecniche Applicate

### CSS Responsive
```css
/* Touch targets: 44x44px minimum */
@media (max-width: 992px) {
    .btn {
        min-height: 44px;
        min-width: 44px;
    }
}

/* Tablets */
@media (max-width: 768px) {
    body { font-size: 15px; }
    .btn { width: 100%; }
}

/* Phones */
@media (max-width: 480px) {
    body { font-size: 14px; }
    .table { font-size: 0.8rem; }
}

/* Very Small Phones */
@media (max-width: 360px) {
    body { font-size: 13px; }
}

/* Landscape Orientation */
@media (max-height: 500px) and (orientation: landscape) {
    .navbar { padding: 0.3rem 0; }
    h1, h2, h3 { margin-bottom: 0.25rem; }
}
```

### HTML Meta Tags
```html
<!-- Viewport configuration for mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, 
    maximum-scale=5.0, user-scalable=yes, viewport-fit=cover">

<!-- iOS webapp support -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Calendario">

<!-- Android Chrome theme -->
<meta name="theme-color" content="#0d6efd">
```

### Touch Scrolling
```css
/* Smooth scrolling on iOS (removes jank) */
.calendario-corso {
    -webkit-overflow-scrolling: touch;
}
```

---

## 🧪 Test su Diversi Schermi

### Da Provare
1. **iPhone SE (375px)**: Testo molto piccolo ma leggibile
2. **iPhone 14 (390px)**: Layout ottimo per phone standard
3. **iPad (768px)**: Due colonne, buon compromesso
4. **iPad Pro (1024px)**: Layout desktop su tablet grande

### Come Testare
**Chrome DevTools (PC):**
1. Apri DevTools (`F12` o `Ctrl+Shift+I`)
2. Clicca "Toggle device toolbar" (`Ctrl+Shift+M`)
3. Seleziona device: iPhone SE, iPhone 14 Pro, iPad, Galaxy Tab S8

**Safari (Mac):**
1. Sviluppa → Mostra la console web
2. Sviluppa → Riporta il User-Agent come...

**Reale (Consigliato):**
1. Apri su iPhone/iPad aziendale
2. Prova swipe orizzontale su tabelle
3. Verifica tap su pulsanti (devono essere precisi)

---

## 🎨 Rendering Visivo

### Dimensioni Font Responsive
| Contesto | Desktop | Tablet | Phone |
|----------|---------|--------|-------|
| Titolo H1 | 2rem | 1.75rem | 1.5rem |
| Titolo H2 | 1.5rem | 1.5rem | 1.3rem |
| Paragrafo | 1rem | 0.95rem | 0.9rem |
| Tabella | 0.85rem | 0.75rem | 0.65rem |
| Badge | 0.85rem | 0.8rem | 0.75rem |

### Spaziatura
| Elemento | Desktop | Tablet | Phone |
|----------|---------|--------|-------|
| Container padding | 15px | 10px | 8px |
| Card margin | 20px | 15px | 10px |
| Button margin | 1rem | 0.75rem | 0.5rem |

---

## ⚠️ Limitazioni Conosciute

### Non Ideale Su
- **Telefoni molto piccoli** (< 320px) - alcuni elementi possono essere cramped
- **Reti molto lente** (3G vecchio) - caricamento tabelle grandi può essere lento
- **Browser vecchi** (IE 11, vecchi Android) - media queries parzialmente supportate

### Workaround
- Usa la funzione di zoom del browser se troppo piccolo
- Passa a landscape per tabelle larghe
- Aspetta il caricamento completo prima di interagire

---

## 🚀 Per gli Istruttori

### Quick Start
1. **Da Smartphone:**
   ```
   Apri Safari/Chrome → vai a https://calendario.trenord.it
   → Bookmark o "Aggiungi alla Home"
   ```

2. **Da Tablet Aziendale:**
   ```
   Stesso processo, ma schermi più grandi rendono tutto più facile!
   ```

3. **Primo Login:**
   ```
   Username: il tuo user Trenord
   Password: la tua password
   → "Ricordami per 30 giorni" (opzionale su trusted device)
   ```

### Consigli d'Uso
✅ **Usa landscape** quando guardi tabelle con molte colonne  
✅ **Pinch to zoom** disponibile in caso di testo piccolo  
✅ **Dark mode** attiva per ridurre affaticamento in treno  
✅ **Scroll lentamente** sulle tabelle per leggere bene  
✅ **Doppio tap** su cella calendario per editare  

---

## 📞 Supporto

Se riscontri problemi:
1. **Schermo nero?** → Prova a ricaricare (pull-to-refresh)
2. **Testo troppo piccolo?** → Usa zoom del browser (pinch)
3. **Tabelle illeggibili?** → Ruota in landscape
4. **Dark mode strano?** → Disattiva/riattiva dal pulsante🌙
5. **Lag su scroll?** → Su vecchi phone, attendi caricamento

Contatti:
- 📧 pianificazione_monitoraggio_accompagnamenti@trenord.it
- 📧 gestioneabilitazioni@trenord.it

---

## ✨ Aggiornamenti Futuro

Potenziali miglioramenti pianificati:
- [ ] Modalità offline (PWA) per accesso senza internet
- [ ] Notifiche push per avvisi istruttori
- [ ] Sync automatico dati dal cloud
- [ ] Gesture personalizzate (swipe per azioni rapide)
- [ ] Biometrics login (face/fingerprint)
- [ ] Export PDF da mobile
- [ ] Print ottimizzato per mobile

---

**Ultima Aggiornamento:** Febbraio 2025  
**Versione:** 1.0 Responsive Mobile  
**Compatibilità:** iOS 13+, Android 8+

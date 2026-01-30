# 📱 Mobile Responsive - Quick Reference

**TL;DR**: L'app è ora completamente responsive per mobile/tablet. Tutta la logica è in CSS (nessun JS nuovo).

---

## 🚀 Quick Start per Sviluppatori

### Files Modificati:
```
static/css/style.css           (+270 lines di media queries)
templates/base.html            (meta tags, navbar)
templates/corso.html           (scroll, dark mode)
templates/vista_corsi.html     (filtri layout)
templates/impegni.html         (form mobile)
```

### Documentazione:
```
MOBILE_RESPONSIVE.md           (user guide - 580 righe)
MOBILE_TESTING_CHECKLIST.md    (test guide - 350+ righe)
IMPLEMENTATION_SUMMARY.md      (technical details - 450+ righe)
```

---

## 🎯 Media Queries Implementate

```css
/* Desktop (no changes needed) */
/* Default Bootstrap + dark mode */

/* Tablet & Laptop (992px and below) */
@media (max-width: 992px) {
    - Touch targets: 44x44px minimum
    - Button padding: 0.6rem 0.9rem
    - Input height: 44px minimum
    - Input font: 16px (no iOS zoom)
}

/* Tablets (768px and below) */
@media (max-width: 768px) {
    - Body font: 15px
    - Titles scaled down
    - Columns: width 100%
    - Table: small font (0.65rem)
    - Dark mode: fully styled
}

/* Phones (480px and below) */
@media (max-width: 480px) {
    - Body font: 14px
    - All columns: width 100%
    - Buttons: full-width
    - Table: aggressive (0.5rem)
    - Scroll hint: "← Scorri →"
}

/* Tiny Phones (360px and below) */
@media (max-width: 360px) {
    - Body font: 13px
    - Extreme compacting
}

/* Landscape (max-height: 500px) */
@media (max-height: 500px) and (orientation: landscape) {
    - Compact navbar
    - Reduced vertical spacing
    - Table optimized for width
}
```

---

## ✅ Touch Target Specification

**Minimum**: 40px x 40px  
**Standard**: 44px x 44px (WCAG 2.5.5)  
**Large**: 48px x 48px  

**Already Implemented**:
```css
.btn { min-height: 44px; min-width: 44px; }
.form-control { min-height: 44px; }
.form-select { min-height: 44px; }
a.btn { min-height: 40px; }
```

---

## 🎨 Responsive Font Sizing

| Context | Desktop | Tablet | Phone |
|---------|---------|--------|-------|
| Body | 16px | 15px | 14px |
| H1 | 32px | 28px | 24px |
| H2 | 24px | 24px | 21px |
| Input | 16px (always!) | 16px | 16px |
| Table | 0.85rem | 0.75rem | 0.65rem |

**Golden Rule**: Input font sempre ≥ 16px (prevents iOS zoom)

---

## 🌓 Dark Mode Coverage

```css
/* All dark mode styles are responsive */
body.dark-mode {
    - Body: #0f1720 (very dark)
    - Text: #e2e8f0 (light gray)
    - Links: #60a5fa (blue)
    - Tables: #1f2937 header
    - Inputs: #1f2937 background
}

/* Responsive dark mode for all breakpoints */
@media (max-width: 768px) {
    body.dark-mode .form-control { ... }
    body.dark-mode .table { ... }
    /* etc */
}
```

---

## 📊 Layout Grid Behavior

### Default (Bootstrap): col-md-* only

```html
<div class="col-md-4">Filtro Ricerca</div>  <!-- 33% desktop -->
<div class="col-md-2">Filtro Anno</div>     <!-- 16% desktop -->
<div class="col-md-3">Data Da</div>         <!-- 25% desktop -->
<div class="col-md-3">Data A</div>          <!-- 25% desktop -->
```

### Mobile Stacking (CSS Override):

```css
@media (max-width: 768px) {
    .col-md-4, .col-md-2, .col-md-3 {
        width: 100%;  /* Stack all columns */
    }
}
```

Result:
- Desktop: 4 colonne a fianco
- Tablet: 2-3 colonne
- Phone: 1 colonna (full-width)

---

## 🔄 Special CSS Techniques

### 1. Scroll Hint (Mobile Only)
```css
@media (max-width: 768px) {
    .calendario-corso::after {
        content: "← Scorri →";
        position: absolute;
        bottom: 2px;
        /* ... positioning ... */
    }
}
```

### 2. iOS Smooth Scroll
```css
.calendario-corso {
    -webkit-overflow-scrolling: touch;  /* Smooth momentum scroll */
}
```

### 3. Touch Feedback (No Hover Transform on Touch)
```css
.cella-corso:active {
    opacity: 0.6;  /* Feedback on tap */
    box-shadow: 0 0 12px rgba(0,0,0,0.4);
}

@media (hover: hover) {
    /* Only on devices with hover support (mouse/trackpad) */
    .cella-corso:hover {
        transform: scale(1.05);
    }
}
```

### 4. Full-Width Buttons
```css
@media (max-width: 480px) {
    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}
```

---

## 🧪 Quick Test Checklist

### On Phone (Chrome DevTools):
1. [ ] Open DevTools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Select iPhone 14 Pro (390px)
4. [ ] Check:
   - [ ] Navbar non-wrapped
   - [ ] Buttons tappabili
   - [ ] Text leggibile
   - [ ] Tabelle scorrevoli
   - [ ] Dark mode works

### On Tablet Simulator:
1. [ ] Select iPad (768px)
2. [ ] Check:
   - [ ] 2-column layout
   - [ ] Buttons non-full-width
   - [ ] Everything readable

### Real Device:
1. [ ] Apri su iPhone/iPad
2. [ ] Prova swipe (tabelle)
3. [ ] Prova tap (bottoni)
4. [ ] Prova scroll (pagina)

---

## 🐛 Common Mobile Issues & Fixes

| Problema | Causa | Fix |
|----------|-------|-----|
| Text too small | Font < 12px | Check media query font-size |
| Buttons unclickable | Size < 40px | Increase min-height/width |
| iOS zoom on input | Font < 16px | Set input font: 16px !important |
| Table illeggibile | No media query | Add max-width, scrollable container |
| Dark mode broken | Missing dark-mode CSS | Add body.dark-mode selectors |
| Navbar wrapped | Too many items | Increase navbar space or hide items |
| Landscape broken | Fixed height | Use max-height media query |

---

## 🔗 CSS Architecture

### Baseline (Desktop-First):
```css
/* Default: desktop layout */
.container { width: 1140px; }
.btn { padding: 0.6rem 1.2rem; }
.table { font-size: 0.85rem; }
```

### Progressive Enhancement (Mobile-Friendly):
```css
/* Add media queries from small → large */
@media (max-width: 480px) { ... }
@media (max-width: 768px) { ... }
@media (max-width: 992px) { ... }
/* Desktop defaults apply if no override */
```

**Not**: Mobile-First (small → large) - Bootstrap uses desktop-first

---

## 📦 Deployment Notes

### No New Dependencies:
- ✅ No new npm packages
- ✅ No new Python packages
- ✅ No external libraries needed
- ✅ Pure CSS + existing Bootstrap

### CSS File Size:
- Before: ~240 lines
- After: ~515 lines
- Gzipped: +3KB
- Impact: Negligible

### Backward Compatibility:
- ✅ All old styles preserved
- ✅ No breaking changes
- ✅ Works on old browsers
- ✅ Graceful degradation

---

## 🎓 Best Practices for Adding New Pages

1. **Use Bootstrap Grid**: `col-sm`, `col-md`, `col-lg`
2. **Add Media Queries**: For custom components
3. **Test Touch Targets**: Minimum 44x44px
4. **Check Dark Mode**: Ensure readable
5. **Validate Responsive**: Chrome DevTools
6. **Document Changes**: Update IMPLEMENTATION_SUMMARY.md

---

## 🚀 If You Need to Debug

### Chrome DevTools Tips:
```
1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Ctrl+Shift+P → "Capture screenshot" (test all sizes)
3. Ctrl+Shift+P → "Emulate CSS media feature (prefers-color-scheme)"
4. Right-click element → Inspect → Check applied styles
5. Console: document.documentElement.clientWidth (get viewport width)
```

### Common Debugging:
```javascript
// Check viewport width
console.log(window.innerWidth);  // Current viewport

// Check touch support
console.log('ontouchstart' in window);  // true = touch device

// Simulate different user-agent
// DevTools → Device → Select phone model
```

### CSS Validation:
```bash
# Check for CSS errors
# DevTools → Console → Check for CSS parse errors
```

---

## 📞 If Something Breaks

### Responsive Design Issues:
1. Check style.css for media queries
2. Verify @media syntax correct
3. Test with DevTools
4. Check font sizes are responsive
5. Verify touch targets ≥ 40px

### Dark Mode Issues:
1. Check `body.dark-mode` selectors
2. Verify contrast ratio (4.5:1 minimum)
3. Test text readability
4. Check input colors

### Layout Issues:
1. Check Bootstrap classes (col-md, etc.)
2. Verify no `width: 1200px` fixed widths
3. Check container padding
4. Test on real device

---

## 📝 File Reference

### CSS Responsive Sections:
```
style.css:
- Lines 206-265: Touch target optimization (992px)
- Lines 267-319: Tablet optimization (768px)
- Lines 321-418: Phone optimization (480px)
- Lines 420-444: Tiny phone optimization (360px)
- Lines 446-476: Landscape optimization
- Lines 478-490: Print styles
```

### HTML Changes:
```
base.html:
- Lines 6-10: Meta tags (viewport, theme, webapp)
- Lines 37-38: Navbar button spacing
- Lines 39-40: Logout link spacing

corso.html:
- Lines 7-14: Scroll container styling
- Lines 45-60: Touch feedback + dark mode

vista_corsi.html & impegni.html:
- Mobile filter + form optimization CSS
```

---

## ✨ Final Checklist Before Production

- [ ] All media queries tested in DevTools
- [ ] Real device tested (phone, tablet)
- [ ] Dark mode toggle works
- [ ] No CSS errors in console
- [ ] Touch targets ≥ 40px
- [ ] Font sizes responsive
- [ ] Orientation landscape tested
- [ ] Performance good (no jank)
- [ ] Documentation updated
- [ ] Users can tap everything

---

**Ready for Mobile-First Future! 🚀**

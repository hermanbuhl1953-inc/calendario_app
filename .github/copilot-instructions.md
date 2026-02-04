# Calendario Istruttori - AI Coding Guide

## Architecture Overview

**Flask-based calendar management system for railway instructors** (40-50 users) with role-based access control and area-based data segregation.

### Core Components
- **app.py**: Monolithic Flask application (~2000+ lines) handling all routes, authentication, and business logic
- **database.py**: SQLite database initialization, schema management, and utility functions for date calculations (festività italiane, giorni lavorativi)
- **calendario.db**: SQLite database file (git-ignored, auto-created on first run)
- **templates/**: Jinja2 HTML templates (base.html extends to index, impegni, calendario, corso, utenti, admin)
- **static/**: CSS (style.css with extensive responsive media queries), JS (app.js with jQuery), local lib copies (Bootstrap 5.3, FontAwesome 6.4)

## Critical Developer Workflows

### First-Time Setup
1. Install dependencies: `pip install -r requirements.txt --break-system-packages`
2. Initialize database: `python database.py`
3. Run app: `python app.py` (http://localhost:5000)
4. First login auto-creates admin user: username=`3102011`, password=`Qaqqa1234.`
5. Access `/setup-admin` endpoint to force database recreation if schema issues occur

### Database Migrations
- **Manual migration scripts**: `migration_add_areas.py`, `migration_add_corso_fields.py`, `migration_add_giorni_extra.py`
- No ORM: Raw SQL via `sqlite3.connect()` with `row_factory = sqlite3.Row`
- Run migration scripts directly: `python migration_add_areas.py` (they check for existing columns before altering)

### Testing Access Control
- Use `test_admin_route.py` and `test_utenti.py` to verify role/area filtering
- Test with different users: Admin (sees all), Supervisor (sees all areas, no user management), Editor/Viewer (filtered by assigned area)

## Authentication & Authorization System

### Role-Based Access Control (RBAC)
Three decorators enforce permissions in app.py:
- `@require_login`: All protected routes (redirects to /login if session empty)
- `@require_role('Admin')`: Admin-only routes (user management, audit logs)
- `@require_editor`: Editor or Admin can modify data
- `@require_supervisor`: Supervisor, Editor, or Admin (no Viewer)

### Area-Based Data Segregation
4 areas: **Scorta** (red), **Condotta** (blue), **Verifica** (green), **Manovra** (yellow)
- `get_user_area_filter()` returns user's assigned area or None (Admin/Supervisor see all)
- `filter_by_area(query, area_column='area')` injects SQL WHERE clause for area filtering
- Applied to: impegni list, calendario view, export Excel

### Password Handling
- **bcrypt** for hashing: `hash_password()` and `verify_password()` in database.py
- Stored in `utenti.password_hash` column
- Default admin password is **plain text in code** (`Qaqqa1234.`) - hash on first save via `crea_utente()`

## Project-Specific Conventions

### Date Calculations (Italian Context)
- **Giorni lavorativi**: Monday-Friday only, excluding Italian national holidays + custom company holidays
- `calcola_data_fine(data_inizio, giorni_lavorativi)` in database.py: Adds N working days, skipping weekends and festività
- `get_festivi_completi(anno)`: Merges `get_festivi_italiani()` (hardcoded: 1/1, 6/1, 25/4, 1/5, 2/6, 15/8, 1/11, 8/12, 25/12, 26/12, Easter+1) with `festivi_custom` table
- Easter calculated via Meeus algorithm in `calcola_pasqua(anno)`
- Dates stored as `YYYY-MM-DD` strings, displayed as `DD/MM/YYYY` via `itdate` Jinja filter

### Calendario Visualization
- **1 row per instructor, 365+ columns per day** (generated in `calendario.html`)
- Color-coded cells: Green (CORSO PDT-CT), Blue (CORSO ADT), Violet (CORSO AMC), Orange (COMM.LE), Yellow (FERIE), Red (MALATTIA), Gray (Riunioni)
- Click on cell → modal with impegno details → "Vai al Corso" button if `id_corso` exists
- Corso detail page (`/corso/<id_corso>`) shows timeline of all activities for that course ID

### Database Schema Key Points
- `impegni` table: `id_corso` groups related activities (nullable), `area` column for access control
- `istruttori` table: `area` column assigns instructor to one of 4 areas
- `utenti` table: `username` (login), `password_hash` (bcrypt), `ruolo_id` (FK to ruoli), `area` (nullable, restricts data view)
- `audit_log` table: Tracks LOGIN, LOGOUT, IMPEGNO_CREATO, IMPEGNO_MODIFICATO, etc. via `registra_audit()`

### Static Assets Strategy
- **Offline-first**: Local copies in `static/lib/` (Bootstrap, FontAwesome) to avoid corporate firewall SSL errors
- `ensure_static_libs()` in app.py is **disabled** (commented) due to SSL issues on Trenord network
- Fallback to CDN links in base.html if local files missing

## Mobile Responsiveness

Extensive CSS media queries in style.css:
- **Breakpoints**: 1024px (desktop), 992px (tablet), 768px (small tablet), 480px (phone), 360px (tiny phone)
- **Touch targets**: Minimum 44x44px (WCAG 2.5.5 compliant)
- **Input font-size: 16px** to prevent iOS auto-zoom on focus
- Landscape mode optimization: `@media (max-height: 500px) and (orientation: landscape)`
- Dark mode fully responsive with AMOLED-optimized colors

## Deployment (Render/Heroku)

- `Procfile`: `web: python app.py` (for Heroku-compatible platforms)
- `runtime.txt`: Specifies Python version
- `requirements-prod.txt`: Minimal dependencies for production (no dev tools)
- Environment variables:
  - `DB_PATH`: Override database file location (default: `calendario.db`)
  - `SECRET_KEY`: Flask session secret (auto-generated if missing)
  - `RESET_AUTH_TABLES=1`: Force auth tables recreation on next startup

## Common Gotchas

1. **Port 5000 conflict**: Change `app.run(port=5001)` in app.py
2. **Empty calendario**: Verify impegni exist AND correct year selected in dropdown
3. **Area filter not working**: Check user's `area` column in DB (NULL = sees nothing if not Admin/Supervisor)
4. **Date format errors**: Always use `YYYY-MM-DD` in SQL, convert to `DD/MM/YYYY` only for display
5. **FontAwesome icons missing**: Check `static/lib/fontawesome/webfonts/` folder exists (not `static/lib/fontawesome/` directly)
6. **Migration failures**: Manually inspect `calendario.db` schema with `sqlite3 calendario.db ".schema"` before running migrations

## Key Files to Understand

- [app.py](app.py): Start here - all routes, decorators, business logic
- [database.py](database.py): Schema, migrations, date utility functions
- [templates/base.html](templates/base.html): Common layout, navbar, dark mode toggle, Bootstrap/FontAwesome imports
- [static/css/style.css](static/css/style.css): Lines 400+ contain all responsive media queries
- [AREA_ACCESS_CONTROL.md](AREA_ACCESS_CONTROL.md): Detailed role/area permission matrix
- [DEPLOYMENT_TRENORD.md](DEPLOYMENT_TRENORD.md): Render deployment steps, environment config

# GUIDA DEPLOYMENT ON-PREMISE - CALENDARIO ISTRUTTORI
## Richiesta Spazio Microsoft Azure per Trenord

**Versione:** 2.0 - Azure Edition  
**Data:** 30 Gennaio 2026  
**Applicazione:** Calendario Istruttori Ferroviari  
**Repository:** https://github.com/hermanbuhl1953-inc/calendario_app  
**Richiedente:** Angelo Grifasi (3102011@trenord.it)

---

## 📋 RIASSUNTO ESECUTIVO PER IT TRENORD

### Cos'è questa applicazione?
Un'**applicazione web per la gestione del calendario degli istruttori ferroviari** - consente di:
- Pianificare corsi, esami, tirocini, addestramento
- Assegnare istruttori alle attività
- Visualizzare conflitti di sovrapposizione
- Gestire sostituzioni e assenze
- Generare report Excel

### Dove gira attualmente?
Su **Render.com** (piattaforma cloud pubblica - **NON SICURA** per Trenord)
- URL demo: https://calendario-app-jcpi.onrender.com
- **Problema:** I dati sono su server USA, fuori dal controllo Trenord

### Cosa chiediamo a Azure?
**Una VM Windows o Linux** per ospitare l'applicazione **in-house**, con:
- Database locale (PostgreSQL o SQL Server)
- Accesso solo da rete Trenord
- Backup automatico giornaliero
- Certificato HTTPS con CA Trenord

### Specifiche Tecniche Minime
- **CPU:** 2 core (scalabile se >50 utenti)
- **RAM:** 4GB
- **Storage:** 100GB (DB + backup)
- **Rete:** Collegamento alla rete Trenord (VPN o ExpressRoute)
- **SO:** Windows Server 2019+ o Ubuntu Linux 20.04 LTS

### Timeline Implementazione
- **Setup iniziale:** 1-2 giorni lavorativi
- **Testing & formazione:** 2-3 giorni lavorativi
- **Go-live:** 1 settimana

---

## 1. PREREQUISITI SISTEMA

### Hardware Minimo (Consigliato per Trenord)

| Utenti Simultanei | CPU | RAM | Disco | Esempio Azure |
|---|---|---|---|---|
| Fino a 20 | 2 core | 2GB | 30GB | B2s Standard (sconto reserved) |
| 20-50 | 4 core | 4GB | 50GB | B4ms Standard |
| 50-100 | 4 core | 8GB | 100GB | D4s v3 Standard |
| >100 | 8 core | 16GB | 200GB | D8s v3 Standard |

**Trenord attualmente ha ~30 istruttori → consiglio B2s o B4ms**

### Sistema Operativo
**Opzione A (CONSIGLIATO): Windows Server 2019 per Trenord**
- Integrazione nativa con Active Directory Trenord
- Backup integrato con Azure Backup
- Supporto SQL Server se preferito
- Interface GUI familiare al team IT Trenord

**Opzione B: Ubuntu Linux 20.04 LTS**
- Più leggero (consuma meno risorse)
- PostgreSQL nativo (gratuito, open-source)
- Richiede admin Linux (non sempre disponibile)

### Software Richiesto

```
✅ Python 3.11+ (gratuito, open-source)
✅ pip (gestore pacchetti Python, gratuito)
✅ Git (versione control, gratuito)

DATABASE (Scegliere UNO):
  - PostgreSQL 12+ (gratuito, open-source) ← CONSIGLIATO
  - SQL Server Express 2019+ (free fino a 10GB) ← Alternativa MS
  - SQLite3 (gratuito, incluso in Python) ← Solo sviluppo

REVERSE PROXY (Scegliere UNO):
  - Nginx (gratuito, multipiattaforma) ← CONSIGLIATO
  - IIS (incluso in Windows Server)
  - Apache (gratuito)

AUTO-START:
  - Systemd (Linux)
  - Windows Services (Windows)
```

---

## 2. COST ESTIMATE AZURE (ANNUALE)

### Scenario Trenord - Windows Server + PostgreSQL

| Componente | Tipo | Costo/Mese | Costo/Anno |
|---|---|---|---|
| **VM Windows Server B2s** | 1 core, 1GB RAM | €32 | €384 |
| **VM upgrade B4ms** | 4 core, 16GB RAM | €96 | €1,152 |
| **Managed Database PostgreSQL** | 2 vCore, 50GB | €60 | €720 |
| **Storage (Backup)** | 1TB/mese | €20 | €240 |
| **Network (VPN/ExpressRoute)** | Connessione sicura | €30-80 | €360-960 |
| | | | |
| **TOTALE STIMATO** | | **€238** | **€2,856** |

**Con Reserved Instances (3 anni): sconto 35-40% = ~€1,714/anno**

---

## 3. RICHIESTA AZURE PER IT TRENORD

### Checklist per richiedere spazio Azure:

```
☐ 1 Virtual Machine (Windows Server 2019+ O Linux Ubuntu 20.04 LTS)
   └─ Configurazione minima: 2 core, 4GB RAM (scalabile)
   └─ Storage OS: 30GB SSD
   └─ Data disk: 100GB SSD (database + backup)
   └─ Ubicazione: EUROPA (compliance GDPR Trenord)

☐ Database PostgreSQL o SQL Server Express
   └─ Collocato stessa region della VM
   └─ Backup automatico giornaliero
   └─ Retention 30 giorni

☐ Network Security
   └─ Network Security Group (firewall): bloccare tutto tranne:
      - Porte 443 (HTTPS) - accesso utenti
      - Porte 5432 (PostgreSQL) - solo da subnet amministratori
   └─ VPN o ExpressRoute: connessione sicura a rete Trenord

☐ SSL/TLS Certificate
   └─ Certificato HTTPS con CA Trenord
   └─ Non self-signed (per sicurezza)

☐ Backup Policy
   └─ Backup automatico giornaliero del database
   └─ Retention minimo 30 giorni
   └─ Test restore mensile

☐ Monitoraggio
   └─ Azure Monitor: alert se applicazione offline
   └─ Email notifica IT Trenord se down
```

---

## 4. INSTALLAZIONE SU WINDOWS SERVER 2019 (TRENORD)

### Step 1: Preparazione Sistema

```bash
# Update sistema
sudo apt update && sudo apt upgrade -y

# Installa dipendenze base
sudo apt install -y \
    python3.11 \
    python3-pip \
    python3-venv \
    git \
    postgresql postgresql-contrib \
    postgresql-client \
    nginx \
    curl \
    wget

# Verifica versioni
python3 --version
pip3 --version
psql --version
```

### Step 2: Clone Repository

```bash
# Crea directory progetto
sudo mkdir -p /opt/calendario-app
cd /opt/calendario-app

# Clone repo (usa token GitHub se privato)
sudo git clone https://github.com/hermanbuhl1953-inc/calendario_app.git .
cd /opt/calendario-app

# Assegna permessi utente non-root
sudo chown -R $USER:$USER /opt/calendario-app
```

### Step 3: Setup Virtual Environment Python

```bash
# Crea venv
python3 -m venv venv

# Attiva venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Installa dipendenze
pip install -r requirements.txt
```

### Step 4: Configurazione Database

#### Opzione A: SQLite (Singolo server, max ~20 utenti)
```bash
# DB è creato automaticamente al primo run
# File: instance/calendario.db (creato da app.py)
# Backup: cp instance/calendario.db instance/calendario.db.backup
```

#### Opzione B: PostgreSQL (Multi-server, consigliato per produzione)

```bash
# Accedi a PostgreSQL
sudo -u postgres psql

# Nel prompt PostgreSQL:
CREATE USER calendario_user WITH PASSWORD 'PASSWORD_SICURA';
CREATE DATABASE calendario_db OWNER calendario_user;
GRANT ALL PRIVILEGES ON DATABASE calendario_db TO calendario_user;
\q
```

**Modifica `database.py` in app:**
```python
# Prima (SQLite):
conn = sqlite3.connect('instance/calendario.db')

# Dopo (PostgreSQL):
import psycopg2
conn = psycopg2.connect(
    host="localhost",
    database="calendario_db",
    user="calendario_user",
    password="PASSWORD_SICURA"
)
```

### Step 5: Configurazione Applicazione

```bash
# Crea file .env per variabili ambiente
cat > .env << EOF
FLASK_ENV=production
FLASK_APP=app.py
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calendario_db
DB_USER=calendario_user
DB_PASSWORD=PASSWORD_SICURA
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
EOF

# Assegna permessi
chmod 600 .env
```

### Step 6: Test Applicazione Locale

```bash
# Attiva venv
source venv/bin/activate

# Test locale su :5000
python app.py

# Visita: http://localhost:5000
# Ctrl+C per fermare
```

### Step 7: Setup Nginx Reverse Proxy

```bash
# Crea config Nginx
sudo cat > /etc/nginx/sites-available/calendario << 'EOF'
server {
    listen 80;
    server_name calendario.trenord.internal;  # Sostituisci con hostname Trenord
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Limita upload file (optional)
    client_max_body_size 50M;
    
    # Timeout per upload Excel
    proxy_read_timeout 60s;
    proxy_connect_timeout 60s;
}
EOF

# Abilita config
sudo ln -s /etc/nginx/sites-available/calendario /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Setup Systemd Service (Auto-start)

```bash
# Crea service file
sudo cat > /etc/systemd/system/calendario.service << EOF
[Unit]
Description=Calendario Istruttori Flask App
After=network.target

[Service]
Type=notify
User=$USER
WorkingDirectory=/opt/calendario-app
Environment="PATH=/opt/calendario-app/venv/bin"
EnvironmentFile=/opt/calendario-app/.env
ExecStart=/opt/calendario-app/venv/bin/gunicorn \
    --workers 4 \
    --worker-class sync \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /var/log/calendario-app/access.log \
    --error-logfile /var/log/calendario-app/error.log \
    app:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Crea directory log
sudo mkdir -p /var/log/calendario-app
sudo chown $USER:$USER /var/log/calendario-app

# Abilita e avvia service
sudo systemctl daemon-reload
sudo systemctl enable calendario
sudo systemctl start calendario
sudo systemctl status calendario
```

### Step 9: Setup HTTPS (Certificato Trenord)

```bash
# Opzione 1: Self-signed (sviluppo/test interno)
sudo openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/ssl/private/calendario.key \
    -out /etc/ssl/certs/calendario.crt

# Opzione 2: Certificato Trenord (produzione)
# Contatta IT Trenord per certificato .crt e .key
# Copia in /etc/ssl/certs/ e /etc/ssl/private/

# Aggiorna Nginx per HTTPS
sudo cat > /etc/nginx/sites-available/calendario << 'EOF'
server {
    listen 443 ssl http2;
    server_name calendario.trenord.internal;
    
    ssl_certificate /etc/ssl/certs/calendario.crt;
    ssl_certificate_key /etc/ssl/private/calendario.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

# Redirect HTTP → HTTPS
server {
    listen 80;
    server_name calendario.trenord.internal;
    return 301 https://$server_name$request_uri;
}
EOF

sudo nginx -t
sudo systemctl restart nginx
```

### Step 10: Verifica Funzionamento

```bash
# Controlla service
sudo systemctl status calendario

# Visualizza log
sudo tail -f /var/log/calendario-app/error.log

# Test HTTP
curl -k https://calendario.trenord.internal

# Visita dal browser: https://calendario.trenord.internal
```

---

## 4. INSTALLAZIONE SU WINDOWS SERVER 2019 (TRENORD)

### Step 1: Installa Software Prerequisiti

**COSA INSTALLARE:**

1. **Python 3.11+ dal sito ufficiale**
   - Scarica: https://www.python.org/downloads/release/python-3110/
   - ⚠️ **IMPORTANTE:** Durante installazione, CHECK la casella "Add Python to PATH"
   - Verifica in PowerShell:
   ```powershell
   python --version
   pip --version
   ```

2. **Git per Windows**
   - Scarica: https://git-scm.com/download/win
   - Usa opzioni di default
   - Verifica:
   ```powershell
   git --version
   ```

3. **PostgreSQL 12+ (se vuoi database centralizzato)**
   - Scarica: https://www.postgresql.org/download/windows/
   - **Nota:** Per testing puoi usare SQLite (incluso in Python)
   - Setup iniziale:
   ```powershell
   # Verifica PostgreSQL è avviato
   Get-Service PostgreSQL*
   ```

4. **Nginx per Windows (consigliato) o IIS**
   - Scarica Nginx: http://nginx.org/en/download.html
   - Estrai in `C:\nginx`

### Step 2: Crea Directory Progetto

```powershell
# Crea cartella
mkdir C:\calendario-app
cd C:\calendario-app

# Verifica permessi (devi avere diritti amministratore)
icacls C:\calendario-app
```

### Step 3: Clone Repository GitHub

```powershell
# Clone il progetto
cd C:\calendario-app
git clone https://github.com/hermanbuhl1953-inc/calendario_app.git .

# Verifica clone è completo
dir /s
```

### Step 4: Setup Virtual Environment Python

```powershell
# Crea virtual environment (isolamento delle dipendenze)
python -m venv venv

# Attiva venv (IMPORTANTE per ogni session PowerShell)
.\venv\Scripts\Activate.ps1

# Se error di policy execution, esegui:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verifica (dovrebbe dire "venv" nel prompt)
python --version
pip --version
```

### Step 5: Installa Dipendenze Applicazione

```powershell
# Assicurati venv sia attivo
.\venv\Scripts\Activate.ps1

# Installa packages Python richiesti
pip install --upgrade pip
pip install -r requirements.txt

# Installa Gunicorn (application server) e Pywin32 (per Windows services)
pip install gunicorn pywin32

# Setup Pywin32 (obbligatorio)
python Scripts/pywin32_postinstall.py -install
```

### Step 6: Configura Database PostgreSQL

**Se usi PostgreSQL:**

```powershell
# Scarica e avvia pgAdmin (web interface per PostgreSQL)
# http://localhost:5050

# Oppure, da command line:
# Accedi a PostgreSQL command prompt

psql -U postgres

# Copia e incolla questi comandi in PostgreSQL:
CREATE USER calendario_user WITH PASSWORD 'PASSWORD_SICURA_TRENORD';
CREATE DATABASE calendario_db OWNER calendario_user;
GRANT ALL PRIVILEGES ON DATABASE calendario_db TO calendario_user;
\q
```

**Se usi SQLite (più semplice per testing):**
```powershell
# Database si crea automaticamente al primo run
# File: instance/calendario.db
# Nessuna configurazione necessaria
```

### Step 7: Crea File di Configurazione .env

```powershell
# Crea file .env (variabili di ambiente)
$content = @"
FLASK_ENV=production
FLASK_APP=app.py
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calendario_db
DB_USER=calendario_user
DB_PASSWORD=PASSWORD_SICURA_TRENORD
"@

$content | Out-File -FilePath ".env" -Encoding UTF8

# Verifica file creato
cat .env
```

### Step 8: Test Applicazione Locale

```powershell
# Attiva venv
.\venv\Scripts\Activate.ps1

# Avvia app
python app.py

# Dovresti vedere:
# * Running on http://127.0.0.1:5000

# Apri browser: http://localhost:5000
# Dovrebbe vedere login page

# Premi Ctrl+C per fermare
```

### Step 9: Configura Nginx come Reverse Proxy

**COSA FA NGINX:** Riceve richieste HTTP/HTTPS dagli utenti e le gira a Flask (porta interna 8000)

```powershell
# Crea file di configurazione Nginx
$config = @"
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    upstream calendario_app {
        server 127.0.0.1:8000;
    }

    # Redirect HTTP -> HTTPS
    server {
        listen 80;
        server_name calendario.trenord.internal;
        return 301 https://`$server_name`$request_uri;
    }

    # HTTPS (usa certificato Trenord)
    server {
        listen 443 ssl http2;
        server_name calendario.trenord.internal;

        # Certificati (chiedere a IT Trenord)
        ssl_certificate C:/ssl/calendario.crt;
        ssl_certificate_key C:/ssl/calendario.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://calendario_app;
            proxy_set_header Host `$host;
            proxy_set_header X-Real-IP `$remote_addr;
            proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto `$scheme;
            proxy_read_timeout 120;
        }
    }
}
"@

$config | Out-File -FilePath "C:\nginx\conf\nginx.conf" -Encoding UTF8
```

### Step 10: Crea Windows Service (Auto-start all'accensione)

**Metodo A: Usa NSSM (Non-Sucking Service Manager) - CONSIGLIATO**

```powershell
# Download NSSM da http://nssm.cc/download
# Estrai in C:\nssm

# Installa il service (run as Administrator)
C:\nssm\nssm.exe install Calendario `
    "C:\calendario-app\venv\Scripts\gunicorn.exe" `
    "--workers 4 --worker-class sync --bind 127.0.0.1:8000 app:app"

# Configura working directory
C:\nssm\nssm.exe set Calendario AppDirectory "C:\calendario-app"

# Configura environment
C:\nssm\nssm.exe set Calendario AppEnvironmentExtra "PATH=C:\calendario-app\venv\Scripts"

# Avvia il service
C:\nssm\nssm.exe start Calendario

# Verifica status
C:\nssm\nssm.exe status Calendario

# Log
C:\nssm\nssm.exe get Calendario AppStdout  # Vedi output
```

**Metodo B: Usa Task Scheduler (alternativa)**

```powershell
# Crea batch file di startup
$bat = @"
@echo off
cd /d C:\calendario-app
call venv\Scripts\activate.bat
gunicorn --workers 4 --bind 127.0.0.1:8000 app:app
"@

$bat | Out-File -FilePath "C:\calendario-app\startup.bat" -Encoding ASCII

# Poi in Task Scheduler:
# - Crea task "Calendario App"
# - Azione: Esegui "C:\calendario-app\startup.bat"
# - Trigger: All'avvio del sistema
# - Esegui con privilegi massimi
```

### Step 11: Avvia Nginx

```powershell
# Avvia Nginx
C:\nginx\nginx.exe

# O meglio, aggiungi a Windows Service
C:\nssm\nssm.exe install Nginx "C:\nginx\nginx.exe" "-c C:\nginx\conf\nginx.conf"
C:\nssm\nssm.exe start Nginx
```

### Step 12: Configura Firewall Windows

```powershell
# Apri porte su Windows Firewall
# Esegui PowerShell come Administrator

# Porta 80 (HTTP)
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 80

# Porta 443 (HTTPS)
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 443

# Porta 5432 (PostgreSQL - solo da admin)
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5432
```

### Step 13: Testa il Deployment

```powershell
# Verifica services sono running
Get-Service | Where-Object {$_.Name -like "Calendario*" -or $_.Name -like "Nginx*"}

# Test dalla macchina locale
curl -k https://localhost/api/statistiche

# Test da altra macchina sulla rete Trenord
curl -k https://calendario.trenord.internal/api/statistiche

# Apri browser: https://calendario.trenord.internal
# Dovrebbe caricare login page
```

---

## 5. INSTALLAZIONE SU LINUX (UBUNTU 20.04 LTS)

---

## 5. INSTALLAZIONE SU LINUX (UBUNTU 20.04 LTS)

### Prerequisiti
Se Trenord sceglie Linux (opzione economica):

### Step 1: Preparazione Sistema

```bash
# Update sistema
sudo apt update && sudo apt upgrade -y

# Installa dipendenze
sudo apt install -y \
    python3.11 \
    python3-pip \
    python3-venv \
    git \
    postgresql postgresql-contrib \
    nginx \
    curl

# Verifica
python3 --version
pip3 --version
```

### Step 2-7: Uguale a sezione "2. INSTALLAZIONE SU LINUX" originale
(Vedi linee 500-750 del documento)

---

## 6. BACKUP E DISASTER RECOVERY (TRENORD)

### Backup Automatico Database

**Script Linux** (`/opt/calendario-app/backup.sh`):
```bash
#!/bin/bash
BACKUP_DIR="/opt/calendario-app/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
if [ "$DB_TYPE" = "postgresql" ]; then
    pg_dump -U calendario_user calendario_db > $BACKUP_DIR/db_$DATE.sql
    gzip $BACKUP_DIR/db_$DATE.sql
else
    cp instance/calendario.db $BACKUP_DIR/calendario_$DATE.db
fi

# Mantieni ultimi 30 giorni
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "calendario_*.db" -mtime +30 -delete

echo "Backup completato: $BACKUP_DIR/db_$DATE"
```

**Schedule con Cron** (ogni notte alle 2:00):
```bash
0 2 * * * /opt/calendario-app/backup.sh
```

### Restore da Backup

```bash
# PostgreSQL
gunzip < backups/db_20260127_020000.sql.gz | psql -U calendario_user calendario_db

# SQLite
cp backups/calendario_20260127_020000.db instance/calendario.db
```

## 6. BACKUP E DISASTER RECOVERY (TRENORD)

### Backup Automatico - Windows Server

**Script PowerShell** (`C:\calendario-app\backup.ps1`):
```powershell
# Backup giornaliero database PostgreSQL
$BackupDir = "C:\calendario-app\backups"
$Date = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\calendario_db_$Date.sql"

# Crea directory backup se non esiste
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

# Backup database
& 'C:\Program Files\PostgreSQL\14\bin\pg_dump.exe' `
    -U calendario_user `
    -h localhost `
    -d calendario_db `
    -F plain `
    -f $BackupFile

# Comprimi file
$BackupZip = "$BackupFile.zip"
Compress-Archive -Path $BackupFile -DestinationPath $BackupZip
Remove-Item $BackupFile

# Mantieni ultimi 30 giorni
Get-ChildItem $BackupDir -Filter "*.zip" -mtime +30 | Remove-Item

Write-Host "Backup completato: $BackupZip"
```

**Pianifica backup con Task Scheduler:**
```powershell
# PowerShell (as Administrator)

$Action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\calendario-app\backup.ps1"

$Trigger = New-ScheduledTaskTrigger -Daily -At 02:00 # 2:00 AM ogni giorno

Register-ScheduledTask -TaskName "Calendario-Backup-Daily" `
    -Action $Action -Trigger $Trigger -RunLevel Highest
```

### Backup Automatico - Linux

```bash
# Script Linux (`/opt/calendario-app/backup.sh`)
#!/bin/bash
BACKUP_DIR="/opt/calendario-app/backups"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -U calendario_user calendario_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Mantieni 30 giorni
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completato: $BACKUP_DIR/db_$DATE.sql.gz"
```

### Restore da Backup

**Windows:**
```powershell
# Decomprimi backup
Expand-Archive -Path "backups\calendario_db_20260130_020000.zip" `
    -DestinationPath "backups\"

# Restore in PostgreSQL
& 'C:\Program Files\PostgreSQL\14\bin\psql.exe' `
    -U calendario_user `
    -d calendario_db `
    -f "backups\calendario_db_20260130_020000.sql"
```

**Linux:**
```bash
gunzip < backups/db_20260130_020000.sql.gz | \
    psql -U calendario_user calendario_db
```

### Integrazione Azure Backup

Se Trenord usa Azure:
```powershell
# Backup automatico VM e database con Azure Backup
# Configurabile da Azure Portal:

# 1. Resource Group → VM → Backup
# 2. Scegli retention policy (30, 60, 90 giorni)
# 3. Backup automatico ogni giorno

# Test restore (mensile):
# Recovery Services Vault → Backup items → Test
```

---

## 7. MONITORAGGIO E MANUTENZIONE (TRENORD)

### Log Files

```bash
# Error log
tail -f /var/log/calendario-app/error.log

# Access log
tail -f /var/log/calendario-app/access.log

# Systemd log
journalctl -u calendario -f
```

### Health Check

```bash
# Script di controllo
curl -s https://calendario.trenord.internal/api/statistiche | jq .

# Se non risponde in 5 secondi, alert
```

### Update Applicazione

```bash
cd /opt/calendario-app
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart calendario
```

## 7. MONITORAGGIO E MANUTENZIONE (TRENORD)

### Health Check - Windows PowerShell

```powershell
# Verifica applicazione è online
$Response = Invoke-WebRequest -Uri "https://calendario.trenord.internal/api/statistiche" -SkipCertificateCheck

if ($Response.StatusCode -eq 200) {
    Write-Host "✅ Applicazione Online"
} else {
    Write-Host "❌ Errore: Applicazione non risponde"
    # Invia email alert a IT Trenord
}

# Verifica services
Get-Service -Name "Calendario" -ErrorAction SilentlyContinue | Select-Object Status
Get-Service -Name "PostgreSQL*" | Select-Object Status

# Verifica spazio disco
Get-Volume -DriveLetter C | Select-Object SizeRemaining
```

### Health Check - Linux Bash

```bash
# Verifica applicazione
curl -s https://calendario.trenord.internal/api/statistiche | jq .

# Se non risponde, riavvia
sudo systemctl restart calendario

# Verifiche di sistema
df -h  # Spazio disco
free -h  # Memoria RAM
ps aux | grep gunicorn  # Processo attivo
```

### Log Files (Windows)

```powershell
# Log applicazione (if using NSSM)
C:\nssm\nssm.exe get Calendario AppStdout
C:\nssm\nssm.exe get Calendario AppStderr

# Log Nginx
C:\nginx\logs\error.log
C:\nginx\logs\access.log

# Event Viewer (Windows events)
Get-EventLog -LogName Application -Source "Calendario"
```

### Monitoraggio Azure (se usato)

```powershell
# Alert automatico se VM offline o disco pieno
# Configurare in Azure Portal:

# 1. VM → Monitoring → Alerts
# 2. Aggiungi rule:
#    - IF CPU > 80% → Email alert
#    - IF Disk space < 10% → Email alert
#    - IF Application not responding → Restart VM

# 3. Send email to: itsupport@trenord.it
```

### Update Applicazione

```powershell
# Backup prima di update (IMPORTANTE)
C:\calendario-app\backup.ps1

# Update codice
cd C:\calendario-app
git pull origin main

# Riattiva venv e installa dipendenze nuove
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Riavvia service
Restart-Service Calendario
```

---

## 8. INTEGRAZIONE ACTIVE DIRECTORY TRENORD (OPTIONAL)

Se Trenord vuole **Single Sign-On con AD**, aggiungere:

```python
# install: pip install python-ldap flask-ldap3-login

from flask_ldap3_login import LDAP3LoginManager

ldap_manager = LDAP3LoginManager(app)

@ldap_manager.configure_direcory_server
def _configure_direcory_server():
    return LDAPServerConfig(
        url='ldap://trenord-ad-server.internal',
        base_dn='dc=trenord,dc=it',
        bind_dn='cn=admin,dc=trenord,dc=it',
        bind_password='SECRET'
    )
```

Tempo stimato integrazione: **2-4 ore**

## 8. INTEGRAZIONE ACTIVE DIRECTORY TRENORD (OPTIONAL)

Se Trenord vuole **Single Sign-On con Active Directory** (gli utenti accedono con credenziali AD):

### Cosa serve:
- Nome server AD di Trenord
- DN (Distinguished Name) di Trenord
- Credenziali bind account AD

### Implementazione

```python
# Installa LDAP support
pip install python-ldap flask-ldap3-login

# Modifica app.py per supportare AD
from flask_ldap3_login import LDAP3LoginManager

ldap_manager = LDAP3LoginManager(app)

@ldap_manager.configure_direcory_server
def _configure_direcory_server():
    return LDAPServerConfig(
        url='ldap://trenord-ad.trenord.it',  # Chiedere a IT Trenord
        base_dn='dc=trenord,dc=it',
        bind_dn='cn=admin,dc=trenord,dc=it',
        bind_password='SECRET_PASSWORD'
    )

# Login automatico con Active Directory
@app.route('/login-ad', methods=['POST'])
def login_ad():
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Valida con AD
    user = ldap_manager.authenticate(username, password)
    if user:
        session['utente_id'] = user.id
        session['username'] = user.username
        return redirect('/'), 200
    else:
        return "Credenziali non valide", 403
```

### Contatti Trenord IT:
- Chiedere nome FQDN server Active Directory
- Chiedere DN della struttura organizativa
- Chiedere credenziali account "bind" (tipo "svc_calendario@trenord.it")

**Tempo implementazione:** 2-4 ore

---

## 9. TROUBLESHOOTING (TRENORD)

### Errore: "Connection refused"
```bash
# Verifica service è avviato
sudo systemctl status calendario

# Verifica porta 8000 è in ascolto
sudo netstat -tlnp | grep 8000

# Riavvia
sudo systemctl restart calendario
```

### Errore: "Database is locked"
```bash
# Se SQLite, ferma tutte le istanze
sudo systemctl stop calendario

# Verifica non ci sono processi Python
ps aux | grep gunicorn

# Kill se necessario
sudo kill -9 PID

# Riavvia
sudo systemctl start calendario
```

### Errore: "No module named 'flask'"
```bash
# Verifica venv è attivato e requirements instalati
source venv/bin/activate
pip install -r requirements.txt
```

### Performance lenta con molti utenti
```bash
# Aumenta workers gunicorn in .service
ExecStart=/opt/calendario-app/venv/bin/gunicorn \
    --workers 8 \        # Aumenta da 4 a 8 o CPU_COUNT
    --worker-class sync \
    --threads 2 \        # Aggiungi threads
    ...
```

## 9. TROUBLESHOOTING (TRENORD)

### Problema: Applicazione non raggiungibile

**Windows:**
```powershell
# 1. Verifica services sono running
Get-Service -Name "Calendario"  # Should be "Running"
Get-Service -Name "Nginx"       # Should be "Running"

# 2. Verifica porte aperte
netstat -ano | findstr :8000   # Gunicorn deve ascoltare qui
netstat -ano | findstr :443    # Nginx deve ascoltare qui

# 3. Riavvia services
Restart-Service Calendario
Restart-Service Nginx

# 4. Controlla log
type C:\nginx\logs\error.log
```

**Linux:**
```bash
sudo systemctl status calendario
sudo systemctl status nginx

# Se offline, riavvia
sudo systemctl restart calendario
sudo systemctl restart nginx

# Controlla log
tail -f /var/log/calendario-app/error.log
```

### Problema: "Database is locked" o errore DB

```powershell
# Windows - PostgreSQL
# 1. Verifica servizio PostgreSQL è avviato
Get-Service -Name "PostgreSQL*"

# 2. Se problema, riavvia
Restart-Service PostgreSQL

# 3. Test connessione
psql -h localhost -U calendario_user -d calendario_db -c "SELECT 1"
```

### Problema: Utenti non riescono a loggarsi

```powershell
# 1. Verifica database ha utente admin
# Accedi a database e verifica:
# SELECT * FROM utenti;

# 2. Se nessun utente, crea admin:
# INSERT INTO utenti (username, password_hash, nome, cognome, ruolo_nome)
# VALUES ('admin', 'hash_password', 'Admin', 'Trenord', 'Admin');
```

### Problema: Performance lenta, applicazione lenta

```powershell
# 1. Aumenta worker count in NSSM
C:\nssm\nssm.exe set Calendario AppParameters `
    "--workers 8 --worker-class sync --bind 127.0.0.1:8000 app:app"

# 2. Aumenta RAM se disponibile

# 3. Controlla database (query lente)
# SELECT COUNT(*) FROM impegni;  # Quanti record?
# Se >100.000, considera partizionamento database
```

---

## 10. CHECKLIST PRE-PRODUZIONE (TRENORD)

## 10. CHECKLIST PRE-PRODUZIONE (TRENORD)

Prima di attivare applicazione per utenti Trenord, verificare:

**Infrastruttura Azure:**
- [ ] VM allocata e configurata (Windows Server 2019+ o Ubuntu LTS)
- [ ] Storage per database (100GB minimo)
- [ ] Network Security Group configurato (porte 80, 443 aperte)
- [ ] VPN/ExpressRoute connesso a rete Trenord
- [ ] Backup policy abilitato (retention 30+ giorni)

**Database:**
- [ ] PostgreSQL o SQL Server installato e testato
- [ ] Database "calendario_db" creato
- [ ] User "calendario_user" creato con password sicura
- [ ] Test backup e restore funzionano
- [ ] Primi utenti admin creati

**Applicazione:**
- [ ] Python 3.11+ e dipendenze instalte
- [ ] Virtual environment attivo
- [ ] Applicazione avviata in localhost (test)
- [ ] Gunicorn configurato su porta 8000

**Nginx/Proxy:**
- [ ] Nginx installato e configurato
- [ ] Certificato HTTPS con CA Trenord (non self-signed)
- [ ] Redirect HTTP → HTTPS funzionante
- [ ] Reverse proxy → Gunicorn funzionante

**Windows Services (se Windows Server):**
- [ ] Service "Calendario" configurato e running
- [ ] Service "Nginx" configurato e running
- [ ] Auto-start abilitato per entrambi
- [ ] Log files accessibili

**Monitoraggio:**
- [ ] Health check script creato e testato
- [ ] Task Scheduler backup giornaliero abilitato
- [ ] Azure Monitor alert configurato (if Azure)
- [ ] Email notifica IT Trenord se down

**Security:**
- [ ] Firewall Windows configurato
- [ ] Porte non necessarie chiuse
- [ ] .env file con credenziali SICURO (non in git)
- [ ] HTTPS certificato valido

**Testing:**
- [ ] Login funziona (utente admin)
- [ ] Aggiunta istruttori funziona
- [ ] Creazione impegni funziona
- [ ] Creazione corsi funziona
- [ ] Modifica corsi funziona
- [ ] Export Excel funziona
- [ ] 10+ utenti simultanei testati
- [ ] Report di carico positivo

**Documentazione:**
- [ ] Password database salvate in location sicura (password manager Trenord)
- [ ] Procedura reset password admin documentata
- [ ] Procedura backup/restore testata
- [ ] Contatti support documentati

**Formazione IT Trenord:**
- [ ] IT Trenord formato su backup/restore
- [ ] IT Trenord formato su creazione utenti
- [ ] IT Trenord formato su troubleshooting base
- [ ] Manual operativo consegnato

---

## 11. SUPPORT E CONTATTI TRENORD

### Chi contattare per problemi?

| Problema | Contatto | Canale |
|---|---|---|
| **Setup Azure** | IT Infrastructure Trenord | Ticket interno |
| **Setup applicazione** | Angelo Grifasi | 3102011@trenord.it |
| **Bug nell'app** | GitHub Issues | https://github.com/hermanbuhl1953-inc/calendario_app/issues |
| **Performance** | DBA Trenord + Angelo | Email + call |
| **Certificato HTTPS** | IT Security Trenord | Ticket interno |
| **Utenti non riescono accedere** | IT Directory + Angelo | Email + call |
| **Database corrotto** | Restore from backup | Vedi sezione 6 |

### Informazioni Progetto

**Repository GitHub:**
```
https://github.com/hermanbuhl1953-inc/calendario_app
Branch: main
Lingua codice: Python 3.11
Framework: Flask
Database: PostgreSQL 12+ (consigliato per Trenord)
Licenza: Proprietaria Trenord
```

**Stack Tecnologico:**
```
Backend: Python Flask + Gunicorn
Frontend: Bootstrap 5 + jQuery
Database: PostgreSQL + SQLite
Reverse Proxy: Nginx
OS: Windows Server 2019+ (consigliato) o Ubuntu LTS
Container: Docker (opzionale)
```

**Performance Aspettative:**
- Response time < 2 secondi per azione
- 50+ utenti simultanei senza problemi
- Database size < 500MB (5 anni di dati)
- Backup giornaliero < 1 minuto

---

## 12. NOTE IMPORTANTI PER TRENORD

✅ **NESSUN LOCK-IN CLOUD**
- Codice Python standard (non proprietario)
- Database PostgreSQL standard (non proprietario)
- Niente API esterne, servizi cloud obbligatori
- **PUOI SPOSTARE APPLICAZIONE OVUNQUE in qualsiasi momento**

✅ **SICUREZZA**
- Credenziali in file `.env` (non nel codice)
- HTTPS obbligatorio in produzione
- Supporto Active Directory per SSO
- Backup crittografato possibile

✅ **COMPLIANCE**
- GDPR ready (dati in EU se VM in EU)
- Audit log traccia tutte le azioni
- Permessi granulari (Admin/Editor/Viewer)
- No dati sensibili - solo calendari istruttori

✅ **COSTO TOTALE PROPRIETÀ (TCO)**
```
Infrastruttura Azure:  €2,856/anno (stimato)
Manutenzione IT:       €3,000-5,000/anno (1 admin)
Setup iniziale:        €2,000-3,000 (one-time)
———————————————————————
Totale anno 1:         €7,856-10,856
Totale anno 2+:        €5,856-7,856
```

✅ **ALTERNATIVE CONSIDERATE**
- ✗ Render.com (cloud pubblico - dati USA)
- ✗ Software commerciale (>€10k/anno)
- ✓ **Azure VM on-premise (questa opzione)** ← CONSIGLIATA
- ✓ Kubernetes con container Docker (scalabilità)

---

## 13. ROADMAP FUTURO TRENORD

Se Trenord vuole evolvere l'app:

| Feature | Sforzo | Priorità |
|---|---|---|
| **Integrazione AD Trenord** | 2-4h | MEDIA |
| **Multi-language (IT/EN)** | 3-5h | BASSA |
| **API REST per terze parti** | 1-2 giorni | MEDIA |
| **Mobile app (iOS/Android)** | 2-3 settimane | BASSA |
| **Dashboard analitico** | 2-3 giorni | MEDIA |
| **Booking automatico aule** | 1-2 giorni | BASSA |

---

**DOCUMENTO VERSIONE 2.0 - 30 Gennaio 2026**

**Per: IT Trenord**  
**Scritto da: Angelo Grifasi (3102011@trenord.it)**  
**Stato: PRONTO PER RICHIESTA AZURE**

# GUIDA DEPLOYMENT ON-PREMISE - CALENDARIO ISTRUTTORI

**Versione:** 1.0  
**Data:** 27 Gennaio 2026  
**Applicazione:** Calendario Istruttori Ferroviari  
**Repository:** https://github.com/hermanbuhl1953-inc/calendario_app

---

## 1. PREREQUISITI SISTEMA

### Hardware Minimo (Consigliato)
- **CPU:** 2 core (4 core per 50+ utenti contemporanei)
- **RAM:** 2GB (4GB per produzione)
- **Disco:** 20GB (storage dati + backup)
- **Rete:** Connessione stabile, accesso internet per git clone iniziale

### Sistema Operativo
- **Linux** (CONSIGLIATO): Ubuntu 20.04 LTS, CentOS 8+, Debian 11+
- **Windows Server:** Windows Server 2019+
- **Docker:** Opzionale ma consigliato per isolamento

### Software Richiesto
```
Python 3.11+
pip (gestore pacchetti Python)
PostgreSQL 12+ (se DB centralizzato)
SQLite3 (se DB locale, incluso in Python)
Git
Nginx o Apache (reverse proxy)
Systemd o Windows Services (auto-start)
```

---

## 2. INSTALLAZIONE SU LINUX (UBUNTU 20.04 LTS)

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

## 3. INSTALLAZIONE SU WINDOWS SERVER 2019+

### Step 1: Installa Software

**Download e installa:**
- Python 3.11+ (da python.org, **check "Add Python to PATH"**)
- PostgreSQL 12+ (optional, se vuoi DB centralizzato)
- Git (da git-scm.com)
- Nginx per Windows oppure IIS

**Verifica nel Command Prompt:**
```cmd
python --version
pip --version
git --version
```

### Step 2: Clone Repository

```cmd
cd C:\opt
git clone https://github.com/hermanbuhl1953-inc/calendario_app.git
cd calendario_app
```

### Step 3: Setup Virtual Environment

```cmd
# Crea venv
python -m venv venv

# Attiva venv
venv\Scripts\activate

# Installa dipendenze
pip install -r requirements.txt
pip install pywin32  # Per Windows services
python Scripts/pywin32_postinstall.py -install
```

### Step 4: Crea Windows Service

**Metodo 1: NSSM (Non-Sucking Service Manager)**

```cmd
# Download NSSM da nssm.cc, estrai in C:\opt\nssm

C:\opt\nssm\nssm install Calendario C:\opt\calendario_app\venv\Scripts\gunicorn.exe --workers 4 --bind 127.0.0.1:8000 app:app

# Avvia service
C:\opt\nssm\nssm start Calendario

# Verifica
C:\opt\nssm\nssm status Calendario
```

**Metodo 2: Task Scheduler (auto-start)**

```cmd
# Crea batch file C:\opt\calendario_app\start.bat
@echo off
cd C:\opt\calendario_app
venv\Scripts\activate
gunicorn --workers 4 --bind 127.0.0.1:8000 app:app
pause
```

Poi configura Task Scheduler per eseguire `start.bat` all'avvio.

### Step 5: Configure IIS Reverse Proxy

In IIS Manager:
1. Install **Application Request Routing** extension
2. Create new site pointing to `http://127.0.0.1:8000`
3. Configure URL Rewrite rules

**O meglio: usa Nginx per Windows** (più semplice, vedi config Linux sezione 7)

---

## 4. BACKUP E DISASTER RECOVERY

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

---

## 5. MONITORAGGIO E MANUTENZIONE

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

---

## 6. INTEGRAZIONE ACTIVE DIRECTORY (OPTIONAL)

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

---

## 7. TROUBLESHOOTING

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

---

## 8. CHECKLIST PRE-PRODUZIONE

- [ ] Database PostgreSQL configurato e testato
- [ ] Certificato HTTPS installato (non self-signed)
- [ ] Backup automatico funzionante
- [ ] Nginx/IIS configurato e testato
- [ ] Systemd service auto-start abilitato
- [ ] Log files configurati e monitorati
- [ ] Firewall: porte 80 e 443 aperte
- [ ] DNS: calendario.trenord.internal risolve correttamente
- [ ] Test carico con 20+ utenti simultanei
- [ ] Documentazione AD SSO integrata (se applicabile)
- [ ] Disaster recovery plan testato
- [ ] Team IT Trenord formato su backup/restore

---

## 9. CONTATTI SUPPORTO

**Per problemi tecnici:**
- GitHub: https://github.com/hermanbuhl1953-inc/calendario_app/issues
- Email: 3102011@trenord.it
- Logs: `/var/log/calendario-app/`

---

## 10. NOTE IMPORTANTI

✅ **Questo progetto NON ha lock-in cloud**
- Codice Python puro, portabile ovunque
- Database standard (SQLite o PostgreSQL)
- Niente API esterne, servizi proprietari

✅ **Nessuna modifica codice necessaria** per deployment Trenord
- Funzionerà identico a Render

✅ **Sicurezza**
- `.env` file con credenziali separate dal codice
- HTTPS obbligatorio in produzione
- Active Directory integration disponibile

✅ **Scalabilità**
- SQLite: fino a 20-30 utenti
- PostgreSQL: illimitato
- Load balancing possibile con Nginx upstream

---

**Documento Versione 1.0 - 27 Gennaio 2026**

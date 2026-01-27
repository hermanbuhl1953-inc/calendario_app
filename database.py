#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Database setup e gestione per Calendario Istruttori
"""

import sqlite3
from datetime import datetime, timedelta
import os


def log_action(action, description, user_agent=""):
    """Registra un'azione nel database di audit"""
    try:
        db_path = os.environ.get("DB_PATH", "calendario.db")
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        c = conn.cursor()

        c.execute(
            '''
            INSERT INTO audit_log (action, description, timestamp, user_agent)
            VALUES (?, ?, ?, ?)
            ''',
            (action, description, datetime.now().isoformat(), user_agent),
        )

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"⚠️ Error logging action: {e}")

def get_festivi_italiani(anno):
    """Restituisce lista date festive italiane per un anno"""
    festivi = [
        f"{anno}-01-01",  # Capodanno
        f"{anno}-01-06",  # Epifania
        f"{anno}-04-25",  # Liberazione
        f"{anno}-05-01",  # Festa del Lavoro
        f"{anno}-06-02",  # Festa della Repubblica
        f"{anno}-08-15",  # Ferragosto
        f"{anno}-11-01",  # Tutti i Santi
        f"{anno}-12-08",  # Immacolata
        f"{anno}-12-25",  # Natale
        f"{anno}-12-26",  # Santo Stefano
    ]
    
    # Calcola Pasqua e Lunedì dell'Angelo
    pasqua = calcola_pasqua(anno)
    lunedi_angelo = pasqua + timedelta(days=1)
    festivi.append(pasqua.strftime("%Y-%m-%d"))
    festivi.append(lunedi_angelo.strftime("%Y-%m-%d"))
    
    return festivi

def get_festivi_completi(anno):
    """Restituisce festivi italiani + festivi aziendali custom"""
    festivi = get_festivi_italiani(anno)
    
    # Aggiungi festivi custom
    try:
        conn = get_db()
        custom = conn.execute(
            'SELECT data FROM festivi_custom WHERE strftime("%Y", data) = ?',
            (str(anno),)
        ).fetchall()
        conn.close()
        
        for row in custom:
            festivi.append(row['data'])
    except Exception as e:
        print(f"⚠️ Errore caricamento festivi custom: {e}")
    
    return festivi

def verifica_sovrapposizione(istruttore_id, data_inizio, data_fine, impegno_id_escluso=None):
    """Verifica se ci sono sovrapposizioni per un istruttore"""
    conn = get_db()
    
    query = '''
        SELECT i.*, ta.nome as attivita_nome
        FROM impegni i
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE i.istruttore_id = ?
        AND i.data_inizio <= ?
        AND i.data_fine >= ?
    '''
    
    params = [istruttore_id, data_fine, data_inizio]
    
    if impegno_id_escluso:
        query += ' AND i.id != ?'
        params.append(impegno_id_escluso)
    
    sovrapposizioni = conn.execute(query, params).fetchall()
    conn.close()
    
    return [dict(row) for row in sovrapposizioni]

def calcola_pasqua(anno):
    """Calcola la data di Pasqua usando l'algoritmo di Meeus"""
    a = anno % 19
    b = anno // 100
    c = anno % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    mese = (h + l - 7 * m + 114) // 31
    giorno = ((h + l - 7 * m + 114) % 31) + 1
    return datetime(anno, mese, giorno)

def init_db():
    """Inizializza il database con tabelle e dati iniziali"""
    conn = sqlite3.connect('calendario.db')
    c = conn.cursor()
    
    # Tabella Audit Log
    c.execute('''
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            description TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_agent TEXT
        )
    ''')

    # Tabella Istruttori
    c.execute('''
        CREATE TABLE IF NOT EXISTS istruttori (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            email TEXT,
            attivo INTEGER DEFAULT 1
        )
    ''')
    
    # Tabella Attività (tipi)
    c.execute('''
        CREATE TABLE IF NOT EXISTS tipi_attivita (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            colore TEXT NOT NULL,
            categoria TEXT
        )
    ''')
    
    # Tabella Impegni
    c.execute('''
        CREATE TABLE IF NOT EXISTS impegni (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_corso TEXT,
            istruttore_id INTEGER NOT NULL,
            attivita_id INTEGER NOT NULL,
            data_inizio DATE NOT NULL,
            giorni_lavorativi INTEGER NOT NULL,
            giorno_extra_1 DATE,
            giorno_extra_2 DATE,
            giorno_extra_3 DATE,
            data_fine DATE,
            note TEXT,
            creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modificato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (istruttore_id) REFERENCES istruttori(id),
            FOREIGN KEY (attivita_id) REFERENCES tipi_attivita(id)
        )
    ''')
    
    # Tabella Sostituzioni
    c.execute('''
        CREATE TABLE IF NOT EXISTS sostituzioni (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            impegno_id INTEGER NOT NULL,
            data_sostituzione DATE NOT NULL,
            istruttore_originale_id INTEGER NOT NULL,
            istruttore_sostituto_id INTEGER NOT NULL,
            note TEXT,
            creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (impegno_id) REFERENCES impegni(id),
            FOREIGN KEY (istruttore_originale_id) REFERENCES istruttori(id),
            FOREIGN KEY (istruttore_sostituto_id) REFERENCES istruttori(id)
        )
    ''')
    
    # Tabella Festività Personalizzate
    c.execute('''
        CREATE TABLE IF NOT EXISTS festivi_custom (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL UNIQUE,
            descrizione TEXT NOT NULL,
            tipo TEXT DEFAULT 'AZIENDALE',
            creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Indici per performance
    c.execute('CREATE INDEX IF NOT EXISTS idx_impegni_istruttore ON impegni(istruttore_id)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_impegni_data_inizio ON impegni(data_inizio)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_impegni_data_fine ON impegni(data_fine)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_impegni_id_corso ON impegni(id_corso)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_sostituzioni_data ON sostituzioni(data_sostituzione)')
    
    # Inserisci istruttori di default
    istruttori_default = [
        "ANTONELLI S.", "CAPEZZUTO P.", "CERIANI", "DE LORENZO R.", "DI BLASI V.",
        "DI NUNZIO M.", "DONNARUMMA A.", "LA MARCHINA K.", "LEPORE S.", "MILLAURO S.",
        "PASQUALI S.", "PASTURENZI A.", "PASUT R.", "PEDUTO G.", "PORCARO M.",
        "RUBERTÁ G.", "RUINA A.", "SERRA D.", "VILLA A.", "ZANARDI V.",
    ]
    
    for nome in istruttori_default:
        c.execute('INSERT OR IGNORE INTO istruttori (nome) VALUES (?)', (nome,))
    
    # Inserisci tipi attività
    attivita_default = [
        ("CORSO PDT-CT", "52BE80", "CORSO"),
        ("CORSO ADT", "5DADE2", "CORSO"),
        ("CORSO AMC", "BB8FCE", "CORSO"),
        ("CORSO COMM.LE", "F39C12", "CORSO"),
        ("ESAME PDT-CT", "3498DB", "ESAME"),
        ("ESAME ADT", "2874A6", "ESAME"),
        ("ESAME AMC", "5499C7", "ESAME"),
        ("ESAME COMM.LE", "1F618D", "ESAME"),
        ("TIROCINIO", "BB8FCE", "TIROCINIO"),
        ("ADDESTRAMENTO", "229954", "ADDESTRAMENTO"),
        ("Pratiche burocratiche", "F39C12", "PRATICHE"),
        ("FERIE", "F1C40F", "ASSENZA"),
        ("MALATTIA", "E74C3C", "ASSENZA"),
        ("PERMESSO", "F4D03F", "ASSENZA"),
        ("RIUNIONE", "7F8C8D", "ALTRO"),
        ("VARIE", "95A5A6", "ALTRO"),
    ]
    
    for nome, colore, categoria in attivita_default:
        c.execute('INSERT OR IGNORE INTO tipi_attivita (nome, colore, categoria) VALUES (?, ?, ?)', 
                  (nome, colore, categoria))
    
    conn.commit()
    conn.close()
    print("✅ Database inizializzato con successo!")

def get_db():
    """Ottieni connessione al database"""
    conn = sqlite3.connect('calendario.db')
    conn.row_factory = sqlite3.Row  # Per accedere alle colonne per nome
    return conn

def calcola_data_fine(data_inizio, giorni_lavorativi, giorni_extra=None):
    """Calcola la data fine considerando giorni lavorativi, weekend e festivi
    
    Args:
        data_inizio: Data di inizio (string o datetime)
        giorni_lavorativi: Numero di giorni lavorativi (Lun-Ven)
        giorni_extra: Lista di date extra (weekend/festivi) da includere
    """
    if isinstance(data_inizio, str):
        data_corrente = datetime.strptime(data_inizio, "%Y-%m-%d")
    else:
        data_corrente = data_inizio
    
    anno = data_corrente.year
    festivi = get_festivi_italiani(anno)
    
    # Conta giorni lavorativi aggiunti
    giorni_aggiunti = 0
    
    # Converti giorni_extra in set per ricerca veloce
    extra_set = set()
    if giorni_extra:
        for giorno_extra in giorni_extra:
            if giorno_extra:
                if isinstance(giorno_extra, str):
                    extra_set.add(giorno_extra)
                else:
                    extra_set.add(giorno_extra.strftime("%Y-%m-%d"))
    
    while giorni_aggiunti < giorni_lavorativi:
        data_str = data_corrente.strftime("%Y-%m-%d")
        
        # Se è giorno lavorativo (Lun-Ven) E non festivo E non in giorni_extra, conta
        is_weekend = data_corrente.weekday() >= 5
        is_festivo = data_str in festivi
        is_extra = data_str in extra_set
        
        if not is_weekend and not is_festivo and not is_extra:
            giorni_aggiunti += 1
        
        # Se non abbiamo ancora raggiunto il target, avanza di un giorno
        if giorni_aggiunti < giorni_lavorativi:
            data_corrente += timedelta(days=1)
            
            # Se passiamo all'anno successivo, aggiorna festivi
            if data_corrente.year != anno:
                anno = data_corrente.year
                festivi = get_festivi_italiani(anno)
    
    return data_corrente.strftime("%Y-%m-%d")

def inserisci_dati_esempio():
    """Inserisce alcuni impegni di esempio"""
    conn = get_db()
    c = conn.cursor()
    
    # Trova ID istruttore ROSSI (o simile)
    c.execute("SELECT id FROM istruttori WHERE nome LIKE '%ROSSI%' OR nome LIKE '%ANTONELLI%' LIMIT 1")
    istr = c.fetchone()
    if not istr:
        c.execute("SELECT id FROM istruttori LIMIT 1")
        istr = c.fetchone()
    
    istruttore_id = istr['id']
    
    # Trova ID attività CORSO PDT-CT
    c.execute("SELECT id FROM tipi_attivita WHERE nome = 'CORSO PDT-CT'")
    attivita_corso = c.fetchone()['id']
    
    c.execute("SELECT id FROM tipi_attivita WHERE nome = 'ESAME PDT-CT'")
    attivita_esame = c.fetchone()['id']
    
    c.execute("SELECT id FROM tipi_attivita WHERE nome = 'Pratiche burocratiche'")
    attivita_pratiche = c.fetchone()['id']
    
    # Inserisci impegni esempio
    impegni_esempio = [
        ('01_25', istruttore_id, attivita_corso, '2025-01-13', 45, 'Corso standard'),
        ('01_25', istruttore_id, attivita_esame, '2025-03-17', 2, 'Esame finale'),
        ('01_25', istruttore_id, attivita_pratiche, '2025-03-20', 3, 'Documenti'),
    ]
    
    for id_corso, istr_id, att_id, data_inizio, giorni, note in impegni_esempio:
        data_fine = calcola_data_fine(data_inizio, giorni)
        c.execute('''
            INSERT OR IGNORE INTO impegni 
            (id_corso, istruttore_id, attivita_id, data_inizio, giorni_lavorativi, data_fine, note)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (id_corso, istr_id, att_id, data_inizio, giorni, data_fine, note))
    
    conn.commit()
    conn.close()
    print("✅ Dati di esempio inseriti!")

if __name__ == '__main__':
    init_db()
    inserisci_dati_esempio()

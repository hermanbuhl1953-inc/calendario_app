#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migration: Aggiunge sistema di aree (Scorta, Condotta, Verifica, Manovra)
e ruolo Capo Istruttori
"""

import sqlite3
import os

def run_migration():
    """Esegue la migration per aggiungere aree e ruolo supervisor"""
    db_path = os.environ.get('DB_PATH', 'calendario.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    print("🔧 Inizio migration: aggiunta aree e ruolo Capo Istruttori...")
    
    try:
        # 1. Aggiungi colonna 'area' alla tabella istruttori
        try:
            c.execute('ALTER TABLE istruttori ADD COLUMN area TEXT DEFAULT NULL')
            print("✅ Aggiunta colonna 'area' a tabella istruttori")
        except sqlite3.OperationalError as e:
            if 'duplicate column name' in str(e).lower():
                print("ℹ️ Colonna 'area' già presente in istruttori")
            else:
                raise
        
        # 2. Aggiungi colonna 'area' alla tabella utenti
        try:
            c.execute('ALTER TABLE utenti ADD COLUMN area TEXT DEFAULT NULL')
            print("✅ Aggiunta colonna 'area' a tabella utenti")
        except sqlite3.OperationalError as e:
            if 'duplicate column name' in str(e).lower():
                print("ℹ️ Colonna 'area' già presente in utenti")
            else:
                raise
        
        # 3. Crea tabella aree di competenza
        c.execute('''
            CREATE TABLE IF NOT EXISTS aree (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE,
                descrizione TEXT,
                colore TEXT DEFAULT '#6c757d',
                attiva INTEGER DEFAULT 1,
                creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("✅ Creata tabella 'aree'")
        
        # 4. Inserisci le 4 aree predefinite
        aree_default = [
            ('Scorta', 'Istruttori area Scorta', '#dc3545'),
            ('Condotta', 'Istruttori area Condotta', '#0d6efd'),
            ('Verifica', 'Istruttori area Verifica', '#198754'),
            ('Manovra', 'Istruttori area Manovra', '#ffc107')
        ]
        
        for nome, desc, colore in aree_default:
            try:
                c.execute('''
                    INSERT INTO aree (nome, descrizione, colore)
                    VALUES (?, ?, ?)
                ''', (nome, desc, colore))
                print(f"✅ Inserita area: {nome}")
            except sqlite3.IntegrityError:
                print(f"ℹ️ Area '{nome}' già esistente")
        
        # 5. Verifica esistenza ruolo 'supervisor' (Capo Istruttori)
        supervisor = c.execute(
            "SELECT id FROM ruoli WHERE nome = 'supervisor'"
        ).fetchone()
        
        if not supervisor:
            c.execute('''
                INSERT INTO ruoli (nome, descrizione)
                VALUES ('supervisor', 'Capo Istruttori - Vede tutte le aree, edita calendari, no gestione utenti')
            ''')
            print("✅ Creato ruolo 'supervisor' (Capo Istruttori)")
        else:
            print("ℹ️ Ruolo 'supervisor' già esistente")
        
        # 6. Aggiungi indici per performance
        try:
            c.execute('CREATE INDEX IF NOT EXISTS idx_istruttori_area ON istruttori(area)')
            c.execute('CREATE INDEX IF NOT EXISTS idx_utenti_area ON utenti(area)')
            c.execute('CREATE INDEX IF NOT EXISTS idx_utenti_ruolo ON utenti(ruolo_id)')
            print("✅ Creati indici per area e ruolo")
        except Exception as e:
            print(f"⚠️ Warning creazione indici: {e}")
        
        conn.commit()
        print("\n✅ Migration completata con successo!")
        print("\nProssimi passi:")
        print("1. Accedi come admin e assegna le aree agli istruttori")
        print("2. Crea utenze per i Capi Istruttori con ruolo 'supervisor'")
        print("3. Assegna area agli utenti istruttori per filtrare i calendari")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Errore durante migration: {e}")
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    run_migration()

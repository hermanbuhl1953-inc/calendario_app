#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migrazione: Aggiungi campi luogo, aula, posti, istruttore_riferimento a tabella impegni
"""

import sqlite3
import os

def migrate():
    db_path = os.environ.get('DB_PATH', 'calendario.db')
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Controlla se le colonne esistono già
    columns = [col[1] for col in c.execute("PRAGMA table_info(impegni)").fetchall()]
    
    if 'luogo' not in columns:
        print("✓ Aggiunta colonna 'luogo'")
        c.execute("ALTER TABLE impegni ADD COLUMN luogo TEXT")
    
    if 'aula' not in columns:
        print("✓ Aggiunta colonna 'aula'")
        c.execute("ALTER TABLE impegni ADD COLUMN aula TEXT")
    
    if 'posti' not in columns:
        print("✓ Aggiunta colonna 'posti'")
        c.execute("ALTER TABLE impegni ADD COLUMN posti TEXT")
    
    if 'istruttore_riferimento' not in columns:
        print("✓ Aggiunta colonna 'istruttore_riferimento'")
        c.execute("ALTER TABLE impegni ADD COLUMN istruttore_riferimento INTEGER")
    
    conn.commit()
    conn.close()
    print("✅ Migrazione completata!")

if __name__ == '__main__':
    migrate()

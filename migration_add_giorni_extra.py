"""
Migration: Aggiunge colonne giorni extra alla tabella impegni
Esegui questo script UNA SOLA VOLTA prima di usare la nuova versione
"""

import sqlite3
import os

def main():
    db_path = 'calendario.db'
    
    if not os.path.exists(db_path):
        print("❌ ERRORE: File calendario.db non trovato!")
        print("   Assicurati di eseguire questo script nella cartella calendario_app/")
        return
    
    print("🔧 Inizio migrazione database...")
    print(f"   Database: {db_path}")
    
    # Backup automatico
    import shutil
    backup_path = 'calendario.db.backup_pre_migration'
    shutil.copy2(db_path, backup_path)
    print(f"✅ Backup creato: {backup_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Controlla se le colonne esistono già
    cursor.execute("PRAGMA table_info(impegni)")
    colonne_esistenti = [row[1] for row in cursor.fetchall()]
    
    colonne_da_aggiungere = ['giorno_extra_1', 'giorno_extra_2', 'giorno_extra_3']
    colonne_mancanti = [col for col in colonne_da_aggiungere if col not in colonne_esistenti]
    
    if not colonne_mancanti:
        print("✅ Le colonne giorni extra esistono già!")
        print("   Nessuna modifica necessaria.")
        conn.close()
        return
    
    print(f"📝 Colonne da aggiungere: {', '.join(colonne_mancanti)}")
    
    # Aggiungi le colonne mancanti
    try:
        for colonna in colonne_mancanti:
            print(f"   Aggiungo colonna: {colonna}")
            cursor.execute(f"ALTER TABLE impegni ADD COLUMN {colonna} TEXT")
        
        conn.commit()
        print("✅ Colonne aggiunte con successo!")
        
        # Verifica
        cursor.execute("PRAGMA table_info(impegni)")
        colonne_finali = [row[1] for row in cursor.fetchall()]
        print(f"\n📊 Colonne nella tabella impegni:")
        for col in colonne_finali:
            print(f"   • {col}")
        
    except Exception as e:
        print(f"❌ ERRORE durante la migrazione: {e}")
        conn.rollback()
        print("   Il database non è stato modificato.")
    finally:
        conn.close()
    
    print("\n🎉 Migrazione completata!")
    print("   Ora puoi usare la nuova versione dell'applicazione.")
    print(f"   Se qualcosa va storto, ripristina il backup: {backup_path}")

if __name__ == '__main__':
    main()

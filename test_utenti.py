import sqlite3
import os

db_path = os.environ.get('DB_PATH', 'calendario.db')
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row

try:
    print("=== Testing lista_utenti query ===")
    utenti = conn.execute('''
        SELECT u.id, u.username, u.email, u.nome, u.cognome, r.nome as ruolo, 
               u.area, u.attivo, u.creato_il, u.ultimo_accesso
        FROM utenti u
        LEFT JOIN ruoli r ON u.ruolo_id = r.id
        ORDER BY u.creato_il DESC
    ''').fetchall()
    
    print(f"✅ Query OK - Trovati {len(utenti)} utenti")
    for u in utenti:
        print(f"  - {u['username']} ({u['ruolo']}) - Area: {u['area']}")
        
except Exception as e:
    print(f"❌ ERRORE: {e}")
    import traceback
    traceback.print_exc()

finally:
    conn.close()

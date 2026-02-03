"""Test route admin/utenti"""
import sys
sys.path.insert(0, '.')

from database import get_db, lista_utenti

print("=== Testing admin/utenti route ===\n")

try:
    print("1. Testing lista_utenti()...")
    utenti = lista_utenti()
    print(f"   ✅ OK - Trovati {len(utenti)} utenti")
    for u in utenti:
        print(f"      - {u}")
    
    print("\n2. Testing ruoli query...")
    conn = get_db()
    ruoli = conn.execute('SELECT * FROM ruoli').fetchall()
    print(f"   ✅ OK - Trovati {len(ruoli)} ruoli")
    for r in ruoli:
        print(f"      - {dict(r)}")
    conn.close()
    
    print("\n✅ Tutti i test passati! La route dovrebbe funzionare.")
    
except Exception as e:
    print(f"\n❌ ERRORE: {e}")
    import traceback
    traceback.print_exc()

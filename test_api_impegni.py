#!/usr/bin/env python3
"""Test della API di creazione impegni"""

import json
import sqlite3
from database import get_db

conn = get_db()
c = conn.cursor()

# Primo, vediamo quanti istruttori e attività ci sono
istruttori = c.execute("SELECT id, nome FROM istruttori LIMIT 3").fetchall()
attivita = c.execute("SELECT id, nome FROM tipi_attivita LIMIT 3").fetchall()

print("📋 Istruttori disponibili:")
for row in istruttori:
    print(f"  ID {row['id']}: {row['nome']}")

print("\n📋 Attività disponibili:")
for row in attivita:
    print(f"  ID {row['id']}: {row['nome']}")

if istruttori and attivita:
    print(f"\n✅ Ci sono abbastanza dati per testare")
    print(f"Prova a fare una POST a /api/impegni con:")
    print(json.dumps({
        "istruttore_id": istruttori[0]['id'],
        "attivita_id": attivita[0]['id'],
        "data_inizio": "2026-02-10",
        "giorni_lavorativi": 1
    }, indent=2))
else:
    print("❌ Non ci sono abbastanza istruttori o attività")

conn.close()

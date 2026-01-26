#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Calendario Istruttori - Flask App
"""

from flask import Flask, render_template, request, jsonify, send_file
from datetime import datetime, timedelta
import calendar as cal_module
from database import get_db, calcola_data_fine, get_festivi_italiani, log_action, init_db
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import io

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# Initialize DB on startup (ensures tables exist on Render)
try:
    init_db()
except Exception as e:
    print(f"⚠️ init_db() error: {e}")

# Nomi mesi in italiano
MESI_ITALIANI = [
    '', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
]

# ============================================================================
# ROUTES PAGINE
# ============================================================================

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/impegni')
def impegni():
    """Pagina gestione impegni"""
    conn = get_db()
    
    # Lista istruttori
    istruttori = conn.execute('SELECT * FROM istruttori WHERE attivo = 1 ORDER BY nome').fetchall()
    
    # Lista attività
    attivita = conn.execute('SELECT * FROM tipi_attivita ORDER BY categoria, nome').fetchall()
    
    # Lista impegni con join
    impegni_list = conn.execute('''
        SELECT i.*, ist.nome as istruttore_nome, ta.nome as attivita_nome, ta.colore
        FROM impegni i
        JOIN istruttori ist ON i.istruttore_id = ist.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        ORDER BY i.data_inizio DESC
    ''').fetchall()
    
    conn.close()
    
    return render_template('impegni.html', 
                         istruttori=istruttori, 
                         attivita=attivita,
                         impegni=impegni_list)

@app.route('/calendario/<int:anno>')
def calendario(anno):
    """Pagina calendario per anno specifico"""
    conn = get_db()
    
    # Lista istruttori
    istruttori = conn.execute('SELECT * FROM istruttori WHERE attivo = 1 ORDER BY nome').fetchall()
    
    # Impegni dell'anno
    impegni_anno_raw = conn.execute('''
        SELECT i.*, ist.nome as istruttore_nome, ta.nome as attivita_nome, ta.colore
        FROM impegni i
        JOIN istruttori ist ON i.istruttore_id = ist.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE 
            (strftime('%Y', i.data_inizio) = ? OR strftime('%Y', i.data_fine) = ?)
            OR (i.data_inizio <= ? AND i.data_fine >= ?)
    ''', (str(anno), str(anno), f"{anno}-12-31", f"{anno}-01-01")).fetchall()
    
    # Converti Row in dict per JSON serialization
    impegni_anno = [dict(row) for row in impegni_anno_raw]
    
    # Sostituzioni dell'anno
    sostituzioni_raw = conn.execute('''
        SELECT s.*, 
               io.nome as istruttore_originale, 
               isost.nome as istruttore_sostituto,
               i.attivita_id, ta.colore
        FROM sostituzioni s
        JOIN istruttori io ON s.istruttore_originale_id = io.id
        JOIN istruttori isost ON s.istruttore_sostituto_id = isost.id
        JOIN impegni i ON s.impegno_id = i.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE strftime('%Y', s.data_sostituzione) = ?
    ''', (str(anno),)).fetchall()
    
    sostituzioni_anno = [dict(row) for row in sostituzioni_raw]
    
    conn.close()
    
    # Calcola giorni dell'anno
    num_giorni = 366 if cal_module.isleap(anno) else 365
    
    # Festivi italiani
    festivi = get_festivi_italiani(anno)
    
    # Crea struttura mesi con nomi italiani
    mesi = []
    for mese in range(1, 13):
        giorni_mese = cal_module.monthrange(anno, mese)[1]
        mesi.append({
            'numero': mese,
            'nome': MESI_ITALIANI[mese],
            'giorni': giorni_mese
        })
    
    return render_template('calendario.html',
                         anno=anno,
                         num_giorni=num_giorni,
                         mesi=mesi,
                         istruttori=istruttori,
                         impegni=impegni_anno,
                         sostituzioni=sostituzioni_anno,
                         festivi=festivi)

@app.route('/corso/<id_corso>')
def corso(id_corso):
    """Pagina dettaglio corso con calendario"""
    conn = get_db()
    
    # Impegni del corso
    impegni_corso_raw = conn.execute('''
        SELECT i.*, ist.nome as istruttore_nome, ta.nome as attivita_nome, ta.colore
        FROM impegni i
        JOIN istruttori ist ON i.istruttore_id = ist.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE i.id_corso = ?
        ORDER BY i.data_inizio
    ''', (id_corso,)).fetchall()
    
    # Converti Row in dict per template
    impegni_corso = [dict(row) for row in impegni_corso_raw]
    
    if not impegni_corso:
        conn.close()
        return "Corso non trovato", 404
    
    # Trova periodo totale del corso (min data_inizio, max data_fine)
    data_inizio_corso = min(imp['data_inizio'] for imp in impegni_corso)
    data_fine_corso = max(imp['data_fine'] for imp in impegni_corso)
    
    # Calcola numero di giorni
    from datetime import datetime, timedelta
    inizio = datetime.strptime(data_inizio_corso, '%Y-%m-%d')
    fine = datetime.strptime(data_fine_corso, '%Y-%m-%d')
    num_giorni = (fine - inizio).days + 1
    
    # Crea lista di tutti i giorni
    giorni = []
    for i in range(num_giorni):
        giorno = inizio + timedelta(days=i)
        giorni.append({
            'data': giorno.strftime('%Y-%m-%d'),
            'giorno': giorno.day,
            'mese': MESI_ITALIANI[giorno.month],
            'giorno_settimana': ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'][giorno.weekday()],
            'indice': i + 1
        })
    
    # Sostituzioni del corso
    sostituzioni_corso_raw = conn.execute('''
        SELECT s.*, 
               io.nome as istruttore_originale, 
               isost.nome as istruttore_sostituto,
               i.attivita_id, ta.colore, ta.nome as attivita_nome
        FROM sostituzioni s
        JOIN istruttori io ON s.istruttore_originale_id = io.id
        JOIN istruttori isost ON s.istruttore_sostituto_id = isost.id
        JOIN impegni i ON s.impegno_id = i.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE i.id_corso = ?
    ''', (id_corso,)).fetchall()
    
    sostituzioni_corso = [dict(row) for row in sostituzioni_corso_raw]
    
    conn.close()
    
    return render_template('corso.html', 
                         id_corso=id_corso,
                         impegni=impegni_corso,
                         giorni=giorni,
                         num_giorni=num_giorni,
                         data_inizio=data_inizio_corso,
                         data_fine=data_fine_corso,
                         sostituzioni=sostituzioni_corso)

@app.route('/vista_istruttori')
def vista_istruttori():
    """Pagina per selezionare un istruttore e vedere statistiche"""
    conn = get_db()
    
    # Lista istruttori attivi con statistiche anno corrente
    anno_corrente = 2025
    
    istruttori_raw = conn.execute('''
        SELECT i.id, i.nome, i.attivo,
               COUNT(DISTINCT imp.id) as num_impegni,
               COALESCE(SUM(imp.giorni_lavorativi), 0) as giorni_lavorativi,
               MIN(imp.data_inizio) as prima_attivita,
               MAX(imp.data_fine) as ultima_attivita
        FROM istruttori i
        LEFT JOIN impegni imp ON i.id = imp.istruttore_id 
            AND (strftime('%Y', imp.data_inizio) = ? OR strftime('%Y', imp.data_fine) = ?)
        WHERE i.attivo = 1
        GROUP BY i.id, i.nome, i.attivo
        ORDER BY i.nome
    ''', (str(anno_corrente), str(anno_corrente))).fetchall()
    
    istruttori = [dict(row) for row in istruttori_raw]
    
    conn.close()
    
    return render_template('vista_istruttori.html', 
                         istruttori=istruttori,
                         anno_corrente=anno_corrente)

@app.route('/istruttore/<int:istruttore_id>')
@app.route('/istruttore/<int:istruttore_id>/<int:anno>')
def dettaglio_istruttore(istruttore_id, anno=2025):
    """Pagina dettaglio istruttore con statistiche e calendario"""
    conn = get_db()
    
    # Info istruttore
    istruttore = conn.execute('SELECT * FROM istruttori WHERE id = ?', (istruttore_id,)).fetchone()
    
    if not istruttore:
        conn.close()
        return "Istruttore non trovato", 404
    
    istruttore = dict(istruttore)
    
    # Impegni dell'anno
    impegni_raw = conn.execute('''
        SELECT i.*, ta.nome as attivita_nome, ta.colore, ta.categoria
        FROM impegni i
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE i.istruttore_id = ?
            AND (strftime('%Y', i.data_inizio) = ? OR strftime('%Y', i.data_fine) = ?)
        ORDER BY i.data_inizio
    ''', (istruttore_id, str(anno), str(anno))).fetchall()
    
    impegni = [dict(row) for row in impegni_raw]
    
    # Statistiche per categoria
    stats_categoria = {}
    for imp in impegni:
        cat = imp['categoria']
        if cat not in stats_categoria:
            stats_categoria[cat] = {'count': 0, 'giorni': 0}
        stats_categoria[cat]['count'] += 1
        stats_categoria[cat]['giorni'] += imp['giorni_lavorativi']
    
    # Sostituzioni OUT (quando questo istruttore è stato sostituito)
    sost_out_raw = conn.execute('''
        SELECT s.*, isost.nome as sostituto_nome, i.id_corso,
               ta.nome as attivita_nome, ta.colore
        FROM sostituzioni s
        JOIN istruttori isost ON s.istruttore_sostituto_id = isost.id
        JOIN impegni i ON s.impegno_id = i.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE s.istruttore_originale_id = ?
            AND strftime('%Y', s.data_sostituzione) = ?
        ORDER BY s.data_sostituzione
    ''', (istruttore_id, str(anno))).fetchall()
    
    sost_out = [dict(row) for row in sost_out_raw]
    
    # Sostituzioni IN (quando questo istruttore ha sostituito altri)
    sost_in_raw = conn.execute('''
        SELECT s.*, io.nome as originale_nome, i.id_corso,
               ta.nome as attivita_nome, ta.colore
        FROM sostituzioni s
        JOIN istruttori io ON s.istruttore_originale_id = io.id
        JOIN impegni i ON s.impegno_id = i.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE s.istruttore_sostituto_id = ?
            AND strftime('%Y', s.data_sostituzione) = ?
        ORDER BY s.data_sostituzione
    ''', (istruttore_id, str(anno))).fetchall()
    
    sost_in = [dict(row) for row in sost_in_raw]
    
    # Statistiche mensili (giorni per mese)
    from datetime import datetime
    stats_mensili = {i: 0 for i in range(1, 13)}  # 1-12 mesi
    
    for imp in impegni:
        data_inizio = datetime.strptime(imp['data_inizio'], '%Y-%m-%d')
        data_fine = datetime.strptime(imp['data_fine'], '%Y-%m-%d')
        
        # Per ogni giorno dell'impegno
        from datetime import timedelta
        current = data_inizio
        while current <= data_fine:
            if current.year == anno:
                # Solo giorni lavorativi (Lun-Ven)
                if current.weekday() < 5:
                    stats_mensili[current.month] += 1
            current += timedelta(days=1)
    
    # Totali
    totale_impegni = len(impegni)
    totale_giorni = sum(imp['giorni_lavorativi'] for imp in impegni)
    totale_giorni_netti = totale_giorni - len(sost_out) + len(sost_in)
    
    # Calcola giorni dell'anno per calendario
    num_giorni = 366 if cal_module.isleap(anno) else 365
    
    # Festivi italiani
    festivi = get_festivi_italiani(anno)
    
    # Crea struttura mesi
    mesi = []
    for mese in range(1, 13):
        giorni_mese = cal_module.monthrange(anno, mese)[1]
        mesi.append({
            'numero': mese,
            'nome': MESI_ITALIANI[mese],
            'giorni': giorni_mese
        })
    
    conn.close()
    
    return render_template('dettaglio_istruttore.html',
                         istruttore=istruttore,
                         anno=anno,
                         impegni=impegni,
                         stats_categoria=stats_categoria,
                         sost_out=sost_out,
                         sost_in=sost_in,
                         stats_mensili=stats_mensili,
                         totale_impegni=totale_impegni,
                         totale_giorni=totale_giorni,
                         totale_giorni_netti=totale_giorni_netti,
                         num_giorni=num_giorni,
                         mesi=mesi,
                         festivi=festivi)

@app.route('/vista_corsi')
def vista_corsi():
    """Pagina per selezionare un corso e vedere il suo calendario"""
    conn = get_db()
    
    # Lista di tutti i corsi (id_corso univoci) con info
    corsi_raw = conn.execute('''
        SELECT DISTINCT i.id_corso,
               MIN(i.data_inizio) as data_inizio,
               MAX(i.data_fine) as data_fine,
               COUNT(DISTINCT i.istruttore_id) as num_istruttori,
               COUNT(i.id) as num_impegni
        FROM impegni i
        WHERE i.id_corso IS NOT NULL AND i.id_corso != ''
        GROUP BY i.id_corso
        ORDER BY data_inizio DESC
    ''').fetchall()
    
    corsi = [dict(row) for row in corsi_raw]
    
    conn.close()
    
    return render_template('vista_corsi.html', corsi=corsi)

@app.route('/istruttori')
def gestione_istruttori():
    """Pagina gestione istruttori"""
    conn = get_db()
    
    # Lista tutti gli istruttori (anche disattivati)
    istruttori = conn.execute('SELECT * FROM istruttori ORDER BY nome').fetchall()
    
    conn.close()
    
    return render_template('istruttori.html', istruttori=istruttori)

@app.route('/tipi-attivita')
def gestione_attivita():
    """Pagina gestione tipi attività"""
    conn = get_db()
    
    # Lista tutti i tipi attività
    attivita = conn.execute('SELECT * FROM tipi_attivita ORDER BY categoria, nome').fetchall()
    
    conn.close()
    
    return render_template('attivita.html', attivita=attivita)

@app.route('/report-giorni')
def report_giorni():
    """Pagina report giorni lavoro per istruttore"""
    conn = get_db()
    
    # Lista istruttori
    istruttori = conn.execute('SELECT * FROM istruttori WHERE attivo = 1 ORDER BY nome').fetchall()
    
    # Anni disponibili (dal primo impegno all'ultimo)
    anni_query = conn.execute('''
        SELECT DISTINCT strftime('%Y', data_inizio) as anno
        FROM impegni
        ORDER BY anno
    ''').fetchall()
    
    anni = [int(row['anno']) for row in anni_query] if anni_query else [2025]
    if not anni:
        anni = [2025, 2026, 2027, 2028, 2029, 2030]
    
    conn.close()
    
    return render_template('report_giorni.html', istruttori=istruttori, anni=anni)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/impegni', methods=['GET'])
def api_get_impegni():
    """Ottieni lista impegni"""
    conn = get_db()
    impegni = conn.execute('''
        SELECT i.*, ist.nome as istruttore_nome, ta.nome as attivita_nome, ta.colore
        FROM impegni i
        JOIN istruttori ist ON i.istruttore_id = ist.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        ORDER BY i.data_inizio DESC
    ''').fetchall()
    conn.close()
    
    return jsonify([dict(imp) for imp in impegni])

@app.route('/api/impegni', methods=['POST'])
def api_create_impegno():
    """Crea nuovo impegno"""
    try:
        data = request.json
        
        # Validazione campi obbligatori
        if not data.get('istruttore_id'):
            return jsonify({'error': 'Manca istruttore_id'}), 400
        if not data.get('attivita_id'):
            return jsonify({'error': 'Manca attivita_id'}), 400
        if not data.get('data_inizio'):
            return jsonify({'error': 'Manca data_inizio'}), 400
        
        data_fine_input = data.get('data_fine') or None
        giorni_input = data.get('giorni_lavorativi')

        if (giorni_input is None or giorni_input == '') and not data_fine_input:
            return jsonify({'error': 'Inserire giorni_lavorativi oppure data_fine'}), 400
        
        # Prepara giorni extra (solo se non vuoti)
        giorni_extra = []
        for i in range(1, 4):
            extra = data.get(f'giorno_extra_{i}')
            if extra and extra.strip():  # Controlla che non sia stringa vuota
                giorni_extra.append(extra)
        
        # Determina giorni_lavorativi e data_fine
        if data_fine_input:
            giorni_lavorativi = giorni_lavorativi_tra(data['data_inizio'], data_fine_input)
            data_fine = data_fine_input
        else:
            giorni_lavorativi = int(giorni_input)
            data_fine = calcola_data_fine(
                data['data_inizio'], 
                giorni_lavorativi,
                giorni_extra if giorni_extra else None
            )
        
        conn = get_db()
        c = conn.cursor()
        c.execute('''
            INSERT INTO impegni 
            (id_corso, istruttore_id, attivita_id, data_inizio, giorni_lavorativi, 
             giorno_extra_1, giorno_extra_2, giorno_extra_3, data_fine, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('id_corso', ''),
            data['istruttore_id'],
            data['attivita_id'],
            data['data_inizio'],
            giorni_lavorativi,
            giorni_extra[0] if len(giorni_extra) > 0 else None,
            giorni_extra[1] if len(giorni_extra) > 1 else None,
            giorni_extra[2] if len(giorni_extra) > 2 else None,
            data_fine,
            data.get('note', '')
        ))
        
        impegno_id = c.lastrowid
        conn.commit()
        conn.close()

        # Traccia creazione impegno
        log_action(
            "CREATE",
            f"Impegno {impegno_id} creato per istruttore {data['istruttore_id']} (attivita {data['attivita_id']}) dal {data['data_inizio']} per {giorni_lavorativi} giorni",
            request.headers.get('User-Agent', ''),
        )
        
        return jsonify({'success': True, 'id': impegno_id})
    except KeyError as e:
        return jsonify({'error': f'Campo mancante: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Errore interno: {str(e)}'}), 500

@app.route('/api/impegni/<int:impegno_id>', methods=['PUT'])
def api_update_impegno(impegno_id):
    """Aggiorna impegno esistente"""
    try:
        data = request.json
        
        # Validazione campi obbligatori
        if not data.get('istruttore_id'):
            return jsonify({'error': 'Manca istruttore_id'}), 400
        if not data.get('attivita_id'):
            return jsonify({'error': 'Manca attivita_id'}), 400
        if not data.get('data_inizio'):
            return jsonify({'error': 'Manca data_inizio'}), 400
        
        data_fine_input = data.get('data_fine') or None
        giorni_input = data.get('giorni_lavorativi')

        if (giorni_input is None or giorni_input == '') and not data_fine_input:
            return jsonify({'error': 'Inserire giorni_lavorativi oppure data_fine'}), 400
        
        # Prepara giorni extra (solo se non vuoti)
        giorni_extra = []
        for i in range(1, 4):
            extra = data.get(f'giorno_extra_{i}')
            if extra and extra.strip():  # Controlla che non sia stringa vuota
                giorni_extra.append(extra)
        
        # Determina giorni_lavorativi e data_fine
        if data_fine_input:
            giorni_lavorativi = giorni_lavorativi_tra(data['data_inizio'], data_fine_input)
            data_fine = data_fine_input
        else:
            giorni_lavorativi = int(giorni_input)
            data_fine = calcola_data_fine(
                data['data_inizio'], 
                giorni_lavorativi,
                giorni_extra if giorni_extra else None
            )
        
        conn = get_db()
        conn.execute('''
            UPDATE impegni 
            SET id_corso = ?, istruttore_id = ?, attivita_id = ?, 
                data_inizio = ?, giorni_lavorativi = ?, 
                giorno_extra_1 = ?, giorno_extra_2 = ?, giorno_extra_3 = ?,
                data_fine = ?, note = ?,
                modificato_il = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data.get('id_corso', ''),
            data['istruttore_id'],
            data['attivita_id'],
            data['data_inizio'],
            giorni_lavorativi,
            giorni_extra[0] if len(giorni_extra) > 0 else None,
            giorni_extra[1] if len(giorni_extra) > 1 else None,
            giorni_extra[2] if len(giorni_extra) > 2 else None,
            data_fine,
            data.get('note', ''),
            impegno_id
        ))
        conn.commit()
        conn.close()

        # Traccia modifica impegno
        log_action(
            "UPDATE",
            f"Impegno {impegno_id} aggiornato (istruttore {data['istruttore_id']}, attivita {data['attivita_id']}, inizio {data['data_inizio']}, giorni {data['giorni_lavorativi']})",
            request.headers.get('User-Agent', ''),
        )
        
        return jsonify({'success': True})
    except KeyError as e:
        return jsonify({'error': f'Campo mancante: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Errore interno: {str(e)}'}), 500

@app.route('/api/impegni/<int:impegno_id>', methods=['DELETE'])
def api_delete_impegno(impegno_id):
    """Elimina impegno"""
    conn = get_db()
    conn.execute('DELETE FROM impegni WHERE id = ?', (impegno_id,))
    conn.commit()
    conn.close()

    # Traccia eliminazione impegno
    log_action(
        "DELETE",
        f"Impegno {impegno_id} eliminato",
        request.headers.get('User-Agent', ''),
    )
    
    return jsonify({'success': True})

@app.route('/api/calendario/<int:anno>')
def api_calendario(anno):
    """API per ottenere dati calendario"""
    conn = get_db()
    
    # Impegni dell'anno con dettagli
    impegni = conn.execute('''
        SELECT i.*, ist.nome as istruttore_nome, ta.nome as attivita_nome, ta.colore
        FROM impegni i
        JOIN istruttori ist ON i.istruttore_id = ist.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE 
            (strftime('%Y', i.data_inizio) = ? OR strftime('%Y', i.data_fine) = ?)
            OR (i.data_inizio <= ? AND i.data_fine >= ?)
    ''', (str(anno), str(anno), f"{anno}-12-31", f"{anno}-01-01")).fetchall()
    
    conn.close()
    
    return jsonify([dict(imp) for imp in impegni])

@app.route('/api/sovrapposizioni')
def api_sovrapposizioni():
    """Trova sovrapposizioni tra esami dello stesso istruttore"""
    conn = get_db()
    
    # Query per trovare sovrapposizioni
    sovrapposizioni = conn.execute('''
        SELECT 
            i1.id as id1, i2.id as id2,
            ist.nome as istruttore,
            ta1.nome as attivita1, i1.data_inizio as inizio1, i1.data_fine as fine1,
            ta2.nome as attivita2, i2.data_inizio as inizio2, i2.data_fine as fine2
        FROM impegni i1
        JOIN impegni i2 ON i1.istruttore_id = i2.istruttore_id AND i1.id < i2.id
        JOIN istruttori ist ON i1.istruttore_id = ist.id
        JOIN tipi_attivita ta1 ON i1.attivita_id = ta1.id
        JOIN tipi_attivita ta2 ON i2.attivita_id = ta2.id
        WHERE 
            (ta1.categoria = 'ESAME' OR ta2.categoria = 'ESAME')
            AND i1.data_inizio <= i2.data_fine 
            AND i1.data_fine >= i2.data_inizio
    ''').fetchall()
    
    conn.close()
    
    return jsonify([dict(sov) for sov in sovrapposizioni])

@app.route('/api/statistiche')
def api_statistiche():
    """Statistiche generali"""
    conn = get_db()
    
    stats = {
        'totale_impegni': conn.execute('SELECT COUNT(*) as cnt FROM impegni').fetchone()['cnt'],
        'totale_corsi': conn.execute('SELECT COUNT(DISTINCT id_corso) as cnt FROM impegni WHERE id_corso != ""').fetchone()['cnt'],
        'totale_istruttori': conn.execute('SELECT COUNT(*) as cnt FROM istruttori WHERE attivo = 1').fetchone()['cnt'],
        
        # Impegni per istruttore
        'per_istruttore': [dict(row) for row in conn.execute('''
            SELECT ist.nome, COUNT(*) as totale
            FROM impegni i
            JOIN istruttori ist ON i.istruttore_id = ist.id
            GROUP BY ist.nome
            ORDER BY totale DESC
        ''').fetchall()],
        
        # Impegni per tipo
        'per_tipo': [dict(row) for row in conn.execute('''
            SELECT ta.nome, ta.categoria, COUNT(*) as totale
            FROM impegni i
            JOIN tipi_attivita ta ON i.attivita_id = ta.id
            GROUP BY ta.nome
            ORDER BY totale DESC
        ''').fetchall()],
    }
    
    conn.close()
    
    return jsonify(stats)

# ============================================================================
# API GESTIONE ISTRUTTORI
# ============================================================================

@app.route('/api/istruttori', methods=['GET'])
def api_get_istruttori():
    """Ottieni lista istruttori"""
    conn = get_db()
    istruttori = conn.execute('SELECT * FROM istruttori ORDER BY nome').fetchall()
    conn.close()
    return jsonify([dict(i) for i in istruttori])

@app.route('/api/istruttori', methods=['POST'])
def api_create_istruttore():
    """Crea nuovo istruttore"""
    data = request.json
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        c.execute('''
            INSERT INTO istruttori (nome, email, attivo)
            VALUES (?, ?, 1)
        ''', (data['nome'], data.get('email', '')))
        
        istruttore_id = c.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'id': istruttore_id})
    except Exception as e:
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/istruttori/<int:istruttore_id>', methods=['PUT'])
def api_update_istruttore(istruttore_id):
    """Aggiorna istruttore"""
    data = request.json
    
    conn = get_db()
    conn.execute('''
        UPDATE istruttori 
        SET nome = ?, email = ?, attivo = ?
        WHERE id = ?
    ''', (data['nome'], data.get('email', ''), data.get('attivo', 1), istruttore_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/istruttori/<int:istruttore_id>/disattiva', methods=['POST'])
def api_disattiva_istruttore(istruttore_id):
    """Disattiva istruttore (pensione)"""
    conn = get_db()
    conn.execute('UPDATE istruttori SET attivo = 0 WHERE id = ?', (istruttore_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/istruttori/<int:istruttore_id>/attiva', methods=['POST'])
def api_attiva_istruttore(istruttore_id):
    """Riattiva istruttore"""
    conn = get_db()
    conn.execute('UPDATE istruttori SET attivo = 1 WHERE id = ?', (istruttore_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

# ============================================================================
# API GESTIONE TIPI ATTIVITÀ
# ============================================================================

@app.route('/api/tipi-attivita', methods=['GET'])
def api_get_tipi_attivita():
    """Ottieni lista tipi attività"""
    conn = get_db()
    attivita = conn.execute('SELECT * FROM tipi_attivita ORDER BY categoria, nome').fetchall()
    conn.close()
    return jsonify([dict(a) for a in attivita])

@app.route('/api/tipi-attivita', methods=['POST'])
def api_create_tipo_attivita():
    """Crea nuovo tipo attività"""
    data = request.json
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        c.execute('''
            INSERT INTO tipi_attivita (nome, colore, categoria)
            VALUES (?, ?, ?)
        ''', (data['nome'], data['colore'], data.get('categoria', 'ALTRO')))
        
        attivita_id = c.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'id': attivita_id})
    except Exception as e:
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/tipi-attivita/<int:attivita_id>', methods=['PUT'])
def api_update_tipo_attivita(attivita_id):
    """Aggiorna tipo attività"""
    data = request.json
    
    conn = get_db()
    conn.execute('''
        UPDATE tipi_attivita 
        SET nome = ?, colore = ?, categoria = ?
        WHERE id = ?
    ''', (data['nome'], data['colore'], data.get('categoria', 'ALTRO'), attivita_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/api/tipi-attivita/<int:attivita_id>', methods=['DELETE'])
def api_delete_tipo_attivita(attivita_id):
    """Elimina tipo attività (solo se non usato)"""
    conn = get_db()
    
    # Verifica se è usato
    count = conn.execute('SELECT COUNT(*) as cnt FROM impegni WHERE attivita_id = ?', (attivita_id,)).fetchone()['cnt']
    
    if count > 0:
        conn.close()
        return jsonify({'success': False, 'error': f'Tipo attività usato in {count} impegni'}), 400
    
    conn.execute('DELETE FROM tipi_attivita WHERE id = ?', (attivita_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

# ============================================================================
# API SOSTITUZIONI
# ============================================================================

@app.route('/api/sostituzioni', methods=['GET'])
def api_get_sostituzioni():
    """Ottieni lista sostituzioni"""
    impegno_id = request.args.get('impegno_id')
    
    conn = get_db()
    
    if impegno_id:
        sostituzioni = conn.execute('''
            SELECT s.*, 
                   io.nome as istruttore_originale, 
                   isost.nome as istruttore_sostituto
            FROM sostituzioni s
            JOIN istruttori io ON s.istruttore_originale_id = io.id
            JOIN istruttori isost ON s.istruttore_sostituto_id = isost.id
            WHERE s.impegno_id = ?
            ORDER BY s.data_sostituzione
        ''', (impegno_id,)).fetchall()
    else:
        sostituzioni = conn.execute('''
            SELECT s.*, 
                   io.nome as istruttore_originale, 
                   isost.nome as istruttore_sostituto,
                   i.id_corso, ta.nome as attivita_nome
            FROM sostituzioni s
            JOIN istruttori io ON s.istruttore_originale_id = io.id
            JOIN istruttori isost ON s.istruttore_sostituto_id = isost.id
            JOIN impegni i ON s.impegno_id = i.id
            JOIN tipi_attivita ta ON i.attivita_id = ta.id
            ORDER BY s.data_sostituzione DESC
        ''').fetchall()
    
    conn.close()
    return jsonify([dict(s) for s in sostituzioni])

@app.route('/api/sostituzioni', methods=['POST'])
def api_create_sostituzione():
    """Crea nuova sostituzione"""
    data = request.json
    
    conn = get_db()
    c = conn.cursor()
    
    try:
        # Verifica che la data sia nell'intervallo dell'impegno
        impegno = conn.execute('''
            SELECT data_inizio, data_fine, istruttore_id
            FROM impegni WHERE id = ?
        ''', (data['impegno_id'],)).fetchone()
        
        if not impegno:
            return jsonify({'success': False, 'error': 'Impegno non trovato'}), 404
        
        data_sost = data['data_sostituzione']
        if not (impegno['data_inizio'] <= data_sost <= impegno['data_fine']):
            return jsonify({'success': False, 'error': 'Data non nell\'intervallo dell\'impegno'}), 400
        
        c.execute('''
            INSERT INTO sostituzioni 
            (impegno_id, data_sostituzione, istruttore_originale_id, istruttore_sostituto_id, note)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['impegno_id'],
            data['data_sostituzione'],
            impegno['istruttore_id'],
            data['istruttore_sostituto_id'],
            data.get('note', '')
        ))
        
        sostituzione_id = c.lastrowid
        conn.commit()
        conn.close()

        # Traccia creazione sostituzione
        log_action(
            "CREATE",
            f"Sostituzione {sostituzione_id} su impegno {data['impegno_id']} (orig {impegno['istruttore_id']} -> sost {data['istruttore_sostituto_id']}) in data {data['data_sostituzione']}",
            request.headers.get('User-Agent', ''),
        )
        
        return jsonify({'success': True, 'id': sostituzione_id})
    except Exception as e:
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/sostituzioni/<int:sostituzione_id>', methods=['DELETE'])
def api_delete_sostituzione(sostituzione_id):
    """Elimina sostituzione"""
    conn = get_db()
    conn.execute('DELETE FROM sostituzioni WHERE id = ?', (sostituzione_id,))
    conn.commit()
    conn.close()

    # Traccia eliminazione sostituzione
    log_action(
        "DELETE",
        f"Sostituzione {sostituzione_id} eliminata",
        request.headers.get('User-Agent', ''),
    )
    
    return jsonify({'success': True})

# ============================================================================
# API REPORT GIORNI LAVORO
# ============================================================================

@app.route('/api/report-giorni')
def api_report_giorni():
    """Calcola giorni lavoro per istruttore e anno"""
    istruttore_id = request.args.get('istruttore_id')
    anno = request.args.get('anno')
    
    conn = get_db()
    
    # Query per ottenere impegni dell'istruttore nell'anno
    impegni = conn.execute('''
        SELECT i.*, ta.nome as attivita_nome, ta.categoria
        FROM impegni i
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        WHERE i.istruttore_id = ?
        AND (
            strftime('%Y', i.data_inizio) = ?
            OR strftime('%Y', i.data_fine) = ?
            OR (i.data_inizio <= ? AND i.data_fine >= ?)
        )
    ''', (istruttore_id, anno, anno, f"{anno}-12-31", f"{anno}-01-01")).fetchall()
    
    # Sostituzioni dove questo istruttore è stato SOSTITUITO (da sottrarre)
    sostituzioni_out = conn.execute('''
        SELECT COUNT(*) as cnt
        FROM sostituzioni
        WHERE istruttore_originale_id = ?
        AND strftime('%Y', data_sostituzione) = ?
    ''', (istruttore_id, anno)).fetchone()['cnt']
    
    # Sostituzioni dove questo istruttore è SOSTITUTO (da aggiungere)
    sostituzioni_in = conn.execute('''
        SELECT COUNT(*) as cnt
        FROM sostituzioni
        WHERE istruttore_sostituto_id = ?
        AND strftime('%Y', data_sostituzione) = ?
    ''', (istruttore_id, anno)).fetchone()['cnt']
    
    conn.close()
    
    # Calcola totali per categoria
    totali = {
        'CORSO': 0,
        'ESAME': 0,
        'TIROCINIO': 0,
        'ADDESTRAMENTO': 0,
        'PRATICHE': 0,
        'ALTRO': 0,
        'ASSENZA': 0
    }
    
    for imp in impegni:
        categoria = imp['categoria'] if imp['categoria'] in totali else 'ALTRO'
        
        # Conta solo giorni nell'anno specificato
        data_inizio = datetime.strptime(imp['data_inizio'], '%Y-%m-%d')
        data_fine = datetime.strptime(imp['data_fine'], '%Y-%m-%d')
        
        inizio_anno = datetime(int(anno), 1, 1)
        fine_anno = datetime(int(anno), 12, 31)
        
        # Limita alle date dell'anno
        inizio_eff = max(data_inizio, inizio_anno)
        fine_eff = min(data_fine, fine_anno)
        
        # Calcola giorni lavorativi effettivi nell'intervallo
        giorni = imp['giorni_lavorativi']
        
        # Approssimazione: distribuzione proporzionale
        if data_fine > data_inizio:
            giorni_totali = (data_fine - data_inizio).days + 1
            giorni_anno = (fine_eff - inizio_eff).days + 1
            giorni_effettivi = int(giorni * giorni_anno / giorni_totali)
        else:
            giorni_effettivi = giorni
        
        totali[categoria] += giorni_effettivi
    
    # Applica sostituzioni
    totale_giorni = sum(totali.values())
    totale_giorni = totale_giorni - sostituzioni_out + sostituzioni_in
    
    return jsonify({
        'totali_categoria': totali,
        'totale_giorni': totale_giorni,
        'sostituzioni_out': sostituzioni_out,
        'sostituzioni_in': sostituzioni_in,
        'dettagli_impegni': len(impegni)
    })

# ============================================================================
# EXPORT EXCEL
# ============================================================================

@app.route('/export/excel')
def export_excel():
    """Genera ed esporta file Excel completo"""
    conn = get_db()
    
    # Ottieni tutti i dati
    istruttori = conn.execute('SELECT * FROM istruttori WHERE attivo = 1 ORDER BY nome').fetchall()
    attivita_list = conn.execute('SELECT * FROM tipi_attivita').fetchall()
    impegni_list = conn.execute('''
        SELECT i.*, ist.nome as istruttore_nome, ta.nome as attivita_nome, ta.colore
        FROM impegni i
        JOIN istruttori ist ON i.istruttore_id = ist.id
        JOIN tipi_attivita ta ON i.attivita_id = ta.id
        ORDER BY i.data_inizio
    ''').fetchall()
    
    conn.close()
    
    # Crea workbook
    wb = Workbook()
    wb.remove(wb.active)
    
    # DATABASE
    ws_db = wb.create_sheet("📊 DATABASE", 0)
    ws_db['A1'] = "📊 DATABASE IMPEGNI"
    ws_db['A1'].font = Font(bold=True, size=16, color="FFFFFF")
    ws_db['A1'].fill = PatternFill(start_color="27AE60", end_color="27AE60", fill_type="solid")
    ws_db['A1'].alignment = Alignment(horizontal="center", vertical="center")
    ws_db.merge_cells('A1:H1')
    ws_db.row_dimensions[1].height = 30
    
    # Intestazioni
    headers = ["ID", "ID CORSO", "ISTRUTTORE", "ATTIVITÀ", "DATA INIZIO", "GIORNI LAV.", "DATA FINE", "NOTE"]
    for col_idx, header in enumerate(headers, 1):
        cell = ws_db.cell(2, col_idx, header)
        cell.font = Font(bold=True, size=10, color="FFFFFF")
        cell.fill = PatternFill(start_color="34495E", end_color="34495E", fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")
    
    # Dati
    for row_idx, imp in enumerate(impegni_list, 3):
        ws_db.cell(row_idx, 1, imp['id'])
        ws_db.cell(row_idx, 2, imp['id_corso'] or '')
        ws_db.cell(row_idx, 3, imp['istruttore_nome'])
        ws_db.cell(row_idx, 4, imp['attivita_nome'])
        ws_db.cell(row_idx, 5, imp['data_inizio'])
        ws_db.cell(row_idx, 6, imp['giorni_lavorativi'])
        ws_db.cell(row_idx, 7, imp['data_fine'])
        ws_db.cell(row_idx, 8, imp['note'] or '')
    
    # Salva in memoria
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name=f'Calendario_Istruttori_{datetime.now().strftime("%Y%m%d")}.xlsx'
    )

# ============================================================================
# AUDIT LOG
# ============================================================================

@app.route('/audit-log')
def audit_log():
    """Visualizza il log di audit di tutte le azioni"""
    try:
        conn = get_db()
        logs = conn.execute('''
            SELECT * FROM audit_log
            ORDER BY timestamp DESC
            LIMIT 500
        ''').fetchall()
        conn.close()
        return render_template('audit_log.html', logs=logs)
    except Exception as e:
        # Mostra errore utile in pagina per debug
        try:
            return render_template('audit_log.html', logs=[], error=str(e))
        except Exception:
            return jsonify({
                'error': 'Errore caricamento audit log',
                'detail': str(e)
            }), 500

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("🚀 Avvio Calendario Istruttori...")
    print("📍 Accedi a: http://localhost:5000")
    print("⚠️  Premi CTRL+C per fermare il server")
    print("")
    app.run(debug=True, host='0.0.0.0', port=5000)


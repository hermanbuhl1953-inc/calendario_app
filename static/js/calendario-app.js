/**
 * Calendario App - Main Logic
 * Applicazione calendario completamente client-side
 */

// Variabili globali
let currentMese = new Date().getMonth() + 1;
let currentAnno = new Date().getFullYear();
let modalIstruttore, modalImpegno, modalAttivita;

// ==================== INIZIALIZZAZIONE ====================

document.addEventListener('DOMContentLoaded', function() {
    // Inizializza modali Bootstrap
    modalIstruttore = new bootstrap.Modal(document.getElementById('modalIstruttore'));
    modalImpegno = new bootstrap.Modal(document.getElementById('modalImpegno'));
    modalAttivita = new bootstrap.Modal(document.getElementById('modalAttivita'));
    
    // Controlla login
    checkLogin();
    
    // Setup form login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Inizializza selettore anno
    initYearSelector();
    
    // Imposta mese corrente
    document.getElementById('selectMese').value = currentMese;
    document.getElementById('selectAnno').value = currentAnno;
});

function checkLogin() {
    if (db.isLoggedIn()) {
        showMainApp();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp() {
    const user = db.getCurrentUser();
    if (!user) {
        showLoginScreen();
        return;
    }
    
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Aggiorna info utente
    document.getElementById('currentUserName').textContent = `${user.nome} ${user.cognome}`;
    document.getElementById('currentUserRole').textContent = user.ruolo;
    document.getElementById('userAvatar').textContent = user.nome.charAt(0) + user.cognome.charAt(0);
    
    // Mostra tab Utenti solo per Admin
    if (db.isAdmin()) {
        document.getElementById('tabUtentiNav').style.display = 'block';
    }
    
    // Carica dati
    loadCalendario();
    loadIstruttori();
    loadImpegni();
    loadAttivita();
    updateFiltroIstruttore();
    loadUtenti();
}

// ==================== AUTENTICAZIONE ====================

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = db.login(username, password);
    
    if (user) {
        showMainApp();
    } else {
        alert('Credenziali non valide!');
    }
}

function logout() {
    if (confirm('Vuoi davvero uscire?')) {
        db.logout();
        showLoginScreen();
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    }
}

// ==================== CALENDARIO ====================

function initYearSelector() {
    const select = document.getElementById('selectAnno');
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear - 2; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        select.appendChild(option);
    }
}

function loadCalendario() {
    currentMese = parseInt(document.getElementById('selectMese').value);
    currentAnno = parseInt(document.getElementById('selectAnno').value);
    
    const filtroIstruttoreId = document.getElementById('filtroIstruttore').value;
    
    const container = document.getElementById('calendarioContainer');
    container.innerHTML = '';
    
    // Crea header giorni settimana
    const giorni = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const gridHtml = `
        <div class="calendario-grid">
            ${giorni.map(g => `<div class="calendario-header">${g}</div>`).join('')}
            ${getCalendarioGrid(currentAnno, currentMese, filtroIstruttoreId)}
        </div>
    `;
    
    container.innerHTML = gridHtml;
}

function getCalendarioGrid(anno, mese, filtroIstruttoreId) {
    const primoGiorno = new Date(anno, mese - 1, 1);
    const ultimoGiorno = new Date(anno, mese, 0);
    const giorniMese = ultimoGiorno.getDate();
    
    // Calcola offset per lunedì come primo giorno
    let offset = primoGiorno.getDay() - 1;
    if (offset < 0) offset = 6;
    
    let html = '';
    
    // Celle vuote iniziali
    for (let i = 0; i < offset; i++) {
        html += '<div class="calendario-day disabled"></div>';
    }
    
    // Giorni del mese
    const festivi = db.getFestivi(anno);
    const festiviSet = new Set(festivi.map(f => f.data));
    
    for (let giorno = 1; giorno <= giorniMese; giorno++) {
        const data = `${anno}-${String(mese).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
        const isFestivo = festiviSet.has(data) || isWeekend(anno, mese, giorno);
        
        // Trova impegni per questo giorno
        const impegni = getImpegniForDate(data, filtroIstruttoreId);
        
        const festivoClass = isFestivo ? 'festivo' : '';
        
        html += `
            <div class="calendario-day ${festivoClass}" onclick="dayClicked('${data}')">
                <div class="day-number">${giorno}</div>
                ${impegni.map(imp => {
                    const attivita = db.getAttivitaById(imp.attivita_id);
                    const istruttore = db.getIstruttore(imp.istruttore_id);
                    return `<div class="impegno-badge" style="background-color: ${attivita.colore}" title="${istruttore.nome} - ${attivita.nome}">
                        ${istruttore.nome.split(' ')[0]}
                    </div>`;
                }).join('')}
            </div>
        `;
    }
    
    return html;
}

function isWeekend(anno, mese, giorno) {
    const data = new Date(anno, mese - 1, giorno);
    const dayOfWeek = data.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}

function getImpegniForDate(data, filtroIstruttoreId = null) {
    let impegni = db.getImpegni();
    
    if (filtroIstruttoreId) {
        impegni = impegni.filter(i => i.istruttore_id === parseInt(filtroIstruttoreId));
    }
    
    return impegni.filter(imp => {
        const dataObj = new Date(data);
        const dataInizio = new Date(imp.data_inizio);
        const dataFine = new Date(imp.data_fine);
        
        return dataObj >= dataInizio && dataObj <= dataFine;
    });
}

function dayClicked(data) {
    const impegni = getImpegniForDate(data);
    
    if (impegni.length > 0) {
        let html = `<h5>Impegni per ${formatDate(data)}</h5><ul class="list-group">`;
        
        impegni.forEach(imp => {
            const istruttore = db.getIstruttore(imp.istruttore_id);
            const attivita = db.getAttivitaById(imp.attivita_id);
            
            html += `
                <li class="list-group-item">
                    <strong>${istruttore.nome}</strong> - ${attivita.nome}
                    ${imp.note ? `<br><small>${imp.note}</small>` : ''}
                </li>
            `;
        });
        
        html += '</ul>';
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info mt-3';
        alertDiv.innerHTML = html;
        
        // Mostra nella sezione impegni
        const impegniTab = document.querySelector('[data-bs-toggle="tab"][href="#tabImpegni"]');
        impegniTab.click();
    }
}

function previousMonth() {
    currentMese--;
    if (currentMese < 1) {
        currentMese = 12;
        currentAnno--;
    }
    document.getElementById('selectMese').value = currentMese;
    document.getElementById('selectAnno').value = currentAnno;
    loadCalendario();
}

function nextMonth() {
    currentMese++;
    if (currentMese > 12) {
        currentMese = 1;
        currentAnno++;
    }
    document.getElementById('selectMese').value = currentMese;
    document.getElementById('selectAnno').value = currentAnno;
    loadCalendario();
}

function goToToday() {
    const today = new Date();
    currentMese = today.getMonth() + 1;
    currentAnno = today.getFullYear();
    document.getElementById('selectMese').value = currentMese;
    document.getElementById('selectAnno').value = currentAnno;
    loadCalendario();
}

// ==================== ISTRUTTORI ====================

function loadIstruttori() {
    const istruttori = db.getIstruttori();
    const container = document.getElementById('istruttoriList');
    
    if (istruttori.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Nessun istruttore presente</div>';
        return;
    }
    
    let html = '<table class="table table-hover"><thead><tr><th>Nome</th><th>Email</th><th>Area</th><th>Stato</th><th>Azioni</th></tr></thead><tbody>';
    
    const aree = db.getAree();
    istruttori.forEach(ist => {
        const stato = ist.attivo ? '<span class="badge bg-success">Attivo</span>' : '<span class="badge bg-secondary">Disattivo</span>';
        const area = ist.area_id ? aree.find(a => a.id === ist.area_id) : null;
        const areaNome = area ? `<span class="badge" style="background-color: ${area.colore}">${area.nome}</span>` : '-';
        
        html += `
            <tr>
                <td><strong>${ist.nome}</strong></td>
                <td>${ist.email || '-'}</td>
                <td>${areaNome}</td>
                <td>${stato}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editIstruttore(${ist.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteIstruttore(${ist.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function updateFiltroIstruttore() {
    const istruttori = db.getIstruttori();
    const select = document.getElementById('filtroIstruttore');
    const selectImpegno = document.getElementById('impegnoIstruttore');
    
    // Aggiorna filtro calendario
    select.innerHTML = '<option value="">Tutti gli istruttori</option>';
    istruttori.forEach(ist => {
        select.innerHTML += `<option value="${ist.id}">${ist.nome}</option>`;
    });
    
    // Aggiorna select nel modal impegni
    if (selectImpegno) {
        selectImpegno.innerHTML = '<option value="">Seleziona...</option>';
        istruttori.forEach(ist => {
            selectImpegno.innerHTML += `<option value="${ist.id}">${ist.nome}</option>`;
        });
    }
}

function showAddIstruttoreModal() {
    document.getElementById('formIstruttore').reset();
    
    // Popola select aree
    const aree = db.getAree();
    const selectArea = document.getElementById('istruttoreArea');
    selectArea.innerHTML = '<option value="">Nessuna</option>';
    aree.forEach(area => {
        selectArea.innerHTML += `<option value="${area.id}">${area.nome}</option>`;
    });
    
    modalIstruttore.show();
}

function saveIstruttore() {
    const nome = document.getElementById('istruttoreNome').value;
    const email = document.getElementById('istruttoreEmail').value;
    const areaId = document.getElementById('istruttoreArea').value || null;
    
    if (!nome) {
        alert('Il nome è obbligatorio');
        return;
    }
    
    db.addIstruttore(nome, email, areaId);
    modalIstruttore.hide();
    loadIstruttori();
    updateFiltroIstruttore();
}

function deleteIstruttore(id) {
    if (confirm('Vuoi eliminare questo istruttore?')) {
        db.deleteIstruttore(id);
        loadIstruttori();
        updateFiltroIstruttore();
    }
}

// ==================== IMPEGNI ====================

function loadImpegni() {
    const impegni = db.getImpegni();
    const container = document.getElementById('impegniList');
    
    if (impegni.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Nessun impegno presente</div>';
        return;
    }
    
    // Ordina per data
    impegni.sort((a, b) => new Date(b.data_inizio) - new Date(a.data_inizio));
    
    let html = '<table class="table table-hover"><thead><tr><th>Istruttore</th><th>Attività</th><th>Periodo</th><th>Giorni</th><th>Note</th><th>Azioni</th></tr></thead><tbody>';
    
    impegni.forEach(imp => {
        const istruttore = db.getIstruttore(imp.istruttore_id);
        const attivita = db.getAttivitaById(imp.attivita_id);
        
        html += `
            <tr>
                <td><strong>${istruttore.nome}</strong></td>
                <td><span class="badge" style="background-color: ${attivita.colore}">${attivita.nome}</span></td>
                <td>${formatDate(imp.data_inizio)} → ${formatDate(imp.data_fine)}</td>
                <td>${imp.giorni_lavorativi}</td>
                <td>${imp.note || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteImpegno(${imp.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showAddImpegnoModal() {
    document.getElementById('formImpegno').reset();
    
    // Popola select istruttori
    updateFiltroIstruttore();
    
    // Popola select attività
    const attivita = db.getAttivita();
    const select = document.getElementById('impegnoAttivita');
    select.innerHTML = '<option value="">Seleziona...</option>';
    attivita.forEach(att => {
        select.innerHTML += `<option value="${att.id}">${att.nome}</option>`;
    });
    
    modalImpegno.show();
}

function saveImpegno() {
    const istruttoreId = parseInt(document.getElementById('impegnoIstruttore').value);
    const attivitaId = parseInt(document.getElementById('impegnoAttivita').value);
    const dataInizio = document.getElementById('impegnoDataInizio').value;
    const giorniLavorativi = parseInt(document.getElementById('impegnoGiorni').value);
    const note = document.getElementById('impegnoNote').value;
    const luogo = document.getElementById('impegnoLuogo').value;
    const aula = document.getElementById('impegnoAula').value;
    const posti = document.getElementById('impegnoPosti').value;
    
    if (!istruttoreId || !attivitaId || !dataInizio || !giorniLavorativi) {
        alert('Compila tutti i campi obbligatori');
        return;
    }
    
    // Calcola data fine
    const dataFine = calcolaDataFine(dataInizio, giorniLavorativi);
    
    const result = db.addImpegno({
        istruttore_id: istruttoreId,
        attivita_id: attivitaId,
        data_inizio: dataInizio,
        giorni_lavorativi: giorniLavorativi,
        data_fine: dataFine,
        note: note,
        luogo: luogo,
        aula: aula,
        posti: posti
    });
    
    // Gestisci conflitti
    if (result.error) {
        showConflittiModal(result.conflitti);
        return;
    }
    
    modalImpegno.hide();
    loadImpegni();
    loadCalendario();
}

function calcolaDataFine(dataInizio, giorniLavorativi) {
    const data = new Date(dataInizio);
    let giorniAggiunti = 0;
    
    while (giorniAggiunti < giorniLavorativi) {
        data.setDate(data.getDate() + 1);
        
        // Salta weekend
        const dayOfWeek = data.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            giorniAggiunti++;
        }
    }
    
    return data.toISOString().split('T')[0];
}

function deleteImpegno(id) {
    if (confirm('Vuoi eliminare questo impegno?')) {
        db.deleteImpegno(id);
        loadImpegni();
        loadCalendario();
    }
}

// ==================== ATTIVITÀ ====================

function loadAttivita() {
    const attivita = db.getAttivita();
    const container = document.getElementById('attivitaList');
    
    if (attivita.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Nessuna attività presente</div>';
        return;
    }
    
    let html = '<table class="table table-hover"><thead><tr><th>Nome</th><th>Colore</th><th>Categoria</th><th>Azioni</th></tr></thead><tbody>';
    
    attivita.forEach(att => {
        html += `
            <tr>
                <td><strong>${att.nome}</strong></td>
                <td><span class="badge" style="background-color: ${att.colore}">${att.colore}</span></td>
                <td>${att.categoria || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteAttivita(${att.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showAddAttivitaModal() {
    document.getElementById('formAttivita').reset();
    modalAttivita.show();
}

function saveAttivita() {
    const nome = document.getElementById('attivitaNome').value;
    const colore = document.getElementById('attivitaColore').value;
    const categoria = document.getElementById('attivitaCategoria').value;
    
    if (!nome || !colore) {
        alert('Nome e colore sono obbligatori');
        return;
    }
    
    db.addAttivita(nome, colore, categoria);
    modalAttivita.hide();
    loadAttivita();
}

function deleteAttivita(id) {
    if (confirm('Vuoi eliminare questa attività?')) {
        db.deleteAttivita(id);
        loadAttivita();
    }
}

// ==================== EXPORT/IMPORT ====================

function exportData() {
    const data = db.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendario_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Seleziona un file da importare');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (db.importData(data)) {
                alert('Dati importati con successo!');
                location.reload();
            }
        } catch (error) {
            alert('Errore durante l\'importazione: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function resetDatabase() {
    if (db.resetAll()) {
        alert('Database resettato!');
        location.reload();
    }
}

// ==================== UTILITY ====================

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
}

// ==================== GESTIONE UTENTI (Solo Admin) ====================

let modalUtente, modalConflitti;
let conflittiPendenti = [];

document.addEventListener('DOMContentLoaded', function() {
    // Altri modali già inizializzati sopra
    if (document.getElementById('modalUtente')) {
        modalUtente = new bootstrap.Modal(document.getElementById('modalUtente'));
    }
    if (document.getElementById('modalConflitti')) {
        modalConflitti = new bootstrap.Modal(document.getElementById('modalConflitti'));
    }
});

function loadUtenti() {
    if (!db.isAdmin()) return;
    
    const utenti = db.getUtenti();
    const container = document.getElementById('utentiList');
    
    if (!container) return;
    
    if (utenti.length === 0) {
        container.innerHTML = '<div class="alert alert-info">Nessun utente presente</div>';
        return;
    }
    
    const aree = db.getAree();
    let html = '<table class="table table-hover"><thead><tr><th>Nome</th><th>Username</th><th>Ruolo</th><th>Area</th><th>Stato</th><th>Azioni</th></tr></thead><tbody>';
    
    utenti.forEach(ut => {
        const stato = ut.attivo ? '<span class="badge bg-success">Attivo</span>' : '<span class="badge bg-secondary">Disattivo</span>';
        const area = ut.area ? aree.find(a => a.id === ut.area) : null;
        const areaNome = area ? `<span class="badge" style="background-color: ${area.colore}">${area.nome}</span>` : '-';
        
        html += `
            <tr>
                <td><strong>${ut.nome} ${ut.cognome}</strong></td>
                <td>${ut.username}</td>
                <td><span class="badge bg-primary">${ut.ruolo}</span></td>
                <td>${areaNome}</td>
                <td>${stato}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteUtente(${ut.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function showAddUtenteModal() {
    document.getElementById('formUtente').reset();
    
    // Popola select aree
    const aree = db.getAree();
    const selectArea = document.getElementById('utenteArea');
    selectArea.innerHTML = '<option value="">Nessuna (tutte le aree)</option>';
    aree.forEach(area => {
        selectArea.innerHTML += `<option value="${area.id}">${area.nome}</option>`;
    });
    
    modalUtente.show();
}

function toggleAreaSelect() {
    const ruolo = document.getElementById('utenteRuolo').value;
    const areaContainer = document.getElementById('utenteAreaContainer');
    
    // Admin e Supervisor non hanno area specifica
    if (ruolo === 'Admin' || ruolo === 'Supervisor') {
        areaContainer.style.display = 'none';
    } else {
        areaContainer.style.display = 'block';
    }
}

function saveUtente() {
    const nome = document.getElementById('utenteNome').value;
    const cognome = document.getElementById('utenteCognome').value;
    const username = document.getElementById('utenteUsername').value;
    const password = document.getElementById('utentePassword').value;
    const ruolo = document.getElementById('utenteRuolo').value;
    const area = document.getElementById('utenteArea').value || null;
    
    if (!nome || !cognome || !username || !password || !ruolo) {
        alert('Compila tutti i campi obbligatori');
        return;
    }
    
    const result = db.addUtente(username, password, nome, cognome, ruolo, area);
    
    if (result.error) {
        alert('Errore: ' + result.message);
        return;
    }
    
    modalUtente.hide();
    loadUtenti();
}

function deleteUtente(id) {
    if (confirm('Vuoi eliminare questo utente?')) {
        const result = db.deleteUtente(id);
        if (!result.error) {
            loadUtenti();
        } else {
            alert('Errore: ' + result.message);
        }
    }
}

// ==================== GESTIONE CONFLITTI ====================

function showConflittiModal(conflitti) {
    conflittiPendenti = conflitti;
    
    const dettaglio = document.getElementById('conflittiDettaglio');
    let html = '<ul class="list-group">';
    
    conflitti.forEach(conf => {
        html += `
            <li class="list-group-item">
                <strong>${conf.istruttore_nome}</strong> - ${conf.attivita_nome}<br>
                <small>Periodo: ${formatDate(conf.data_inizio)} → ${formatDate(conf.data_fine)}</small>
                ${conf.note ? `<br><small class="text-muted">${conf.note}</small>` : ''}
            </li>
        `;
    });
    
    html += '</ul>';
    dettaglio.innerHTML = html;
    
    modalConflitti.show();
}

let forceCreate = false;

function forceAddImpegno() {
    if (confirm('Sei sicuro di voler creare l\'impegno nonostante le sovrapposizioni?')) {
        forceCreate = true;
        modalConflitti.hide();
        
        // Riprendi i dati dal form e crea comunque
        const istruttoreId = parseInt(document.getElementById('impegnoIstruttore').value);
        const attivitaId = parseInt(document.getElementById('impegnoAttivita').value);
        const dataInizio = document.getElementById('impegnoDataInizio').value;
        const giorniLavorativi = parseInt(document.getElementById('impegnoGiorni').value);
        const note = document.getElementById('impegnoNote').value;
        const luogo = document.getElementById('impegnoLuogo').value;
        const aula = document.getElementById('impegnoAula').value;
        const posti = document.getElementById('impegnoPosti').value;
        
        const dataFine = calcolaDataFine(dataInizio, giorniLavorativi);
        
        // Salva direttamente senza controlli
        const impegni = db.getImpegni();
        const nuovoImpegno = {
            id: db.generateId(impegni),
            istruttore_id: istruttoreId,
            attivita_id: attivitaId,
            data_inizio: dataInizio,
            giorni_lavorativi: giorniLavorativi,
            data_fine: dataFine,
            note: note + ' [FORZATO]',
            luogo: luogo,
            aula: aula,
            posti: posti,
            creato_il: new Date().toISOString(),
            modificato_il: new Date().toISOString()
        };
        
        impegni.push(nuovoImpegno);
        db.saveData(db.KEYS.IMPEGNI, impegni);
        db.logAction('add_impegno_forced', `Impegno forzato ID: ${nuovoImpegno.id} (con sovrapposizioni)`);
        
        modalImpegno.hide();
        loadImpegni();
        loadCalendario();
        forceCreate = false;
    }
}

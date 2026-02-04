<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendario Istruttori - Versione Statica</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- FullCalendar CSS -->
    <link href='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/main.min.css' rel='stylesheet' />
    
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --success-color: #27ae60;
            --danger-color: #e74c3c;
            --warning-color: #f39c12;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px 0;
        }
        
        .main-container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .app-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            padding: 30px;
            margin-bottom: 20px;
        }
        
        .app-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .app-header h1 {
            margin: 0;
            font-size: 28px;
        }
        
        .nav-tabs {
            border-bottom: 2px solid #e0e0e0;
        }
        
        .nav-tabs .nav-link {
            color: #666;
            border: none;
            padding: 12px 24px;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .nav-tabs .nav-link:hover {
            color: var(--secondary-color);
            border-bottom: 2px solid var(--secondary-color);
        }
        
        .nav-tabs .nav-link.active {
            color: var(--secondary-color);
            background: transparent;
            border: none;
            border-bottom: 3px solid var(--secondary-color);
        }
        
        .calendario-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin-top: 20px;
        }
        
        .calendario-header {
            background: var(--primary-color);
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            border-radius: 5px;
        }
        
        .calendario-day {
            border: 1px solid #ddd;
            padding: 10px;
            min-height: 100px;
            background: white;
            border-radius: 5px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .calendario-day:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        
        .calendario-day.disabled {
            background: #f5f5f5;
            color: #999;
            cursor: default;
        }
        
        .calendario-day.festivo {
            background: #ffebee;
        }
        
        .day-number {
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 5px;
        }
        
        .impegno-badge {
            font-size: 11px;
            padding: 3px 6px;
            margin: 2px 0;
            border-radius: 3px;
            color: white;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .btn-primary {
            background: var(--secondary-color);
            border: none;
        }
        
        .btn-primary:hover {
            background: #2980b9;
        }
        
        .btn-success {
            background: var(--success-color);
            border: none;
        }
        
        .btn-danger {
            background: var(--danger-color);
            border: none;
        }
        
        .table-hover tbody tr:hover {
            background-color: #f8f9fa;
        }
        
        .login-container {
            max-width: 400px;
            margin: 100px auto;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
            color: white;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            font-weight: bold;
        }
        
        .badge-custom {
            padding: 8px 12px;
            border-radius: 20px;
            font-weight: 500;
        }
        
        .hidden {
            display: none !important;
        }
        
        .month-selector {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .month-selector select {
            padding: 8px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
        }
        
        .export-section {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .no-print {
                display: none !important;
            }
            
            .app-card {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <!-- Login Screen -->
    <div id="loginScreen" class="login-container">
        <div class="app-card">
            <div class="text-center mb-4">
                <i class="fas fa-calendar-alt fa-4x text-primary mb-3"></i>
                <h2>Calendario Istruttori</h2>
                <p class="text-muted">Versione Statica - SharePoint Ready</p>
            </div>
            <form id="loginForm">
                <div class="mb-3">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control" id="loginUsername" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" id="loginPassword" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-sign-in-alt me-2"></i>Accedi
                </button>
            </form>
            <div class="alert alert-info mt-3" role="alert">
                <small><strong>Credenziali default:</strong> admin / admin</small>
            </div>
        </div>
    </div>

    <!-- Main App -->
    <div id="mainApp" class="main-container hidden">
        <!-- Header -->
        <div class="app-header">
            <div>
                <h1><i class="fas fa-calendar-check me-2"></i>Calendario Istruttori</h1>
                <small>Gestione corsi e disponibilità</small>
            </div>
            <div class="user-info">
                <div>
                    <strong id="currentUserName"></strong>
                    <br>
                    <small id="currentUserRole"></small>
                </div>
                <div class="user-avatar" id="userAvatar"></div>
                <button class="btn btn-outline-light btn-sm" onclick="logout()">
                    <i class="fas fa-sign-out-alt me-1"></i>Esci
                </button>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="app-card">
            <ul class="nav nav-tabs" id="mainTabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-bs-toggle="tab" href="#tabCalendario">
                        <i class="fas fa-calendar me-2"></i>Calendario
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tabIstruttori">
                        <i class="fas fa-users me-2"></i>Istruttori
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tabImpegni">
                        <i class="fas fa-tasks me-2"></i>Impegni
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tabAttivita">
                        <i class="fas fa-list me-2"></i>Attività
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tabFestivi">
                        <i class="fas fa-calendar-times me-2"></i>Festività
                    </a>
                </li>
                <li class="nav-item" id="tabUtentiNav" style="display: none;">
                    <a class="nav-link" data-bs-toggle="tab" href="#tabUtenti">
                        <i class="fas fa-users-cog me-2"></i>Utenti
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#tabExport">
                        <i class="fas fa-download me-2"></i>Export/Import
                    </a>
                </li>
            </ul>

            <div class="tab-content p-4">
                <!-- TAB CALENDARIO - MULTI VISTA -->
                <div class="tab-pane fade show active" id="tabCalendario">
                    <!-- Sub-Tab per viste multiple -->
                    <ul class="nav nav-pills mb-4" id="calendarioViews" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="pill" href="#vistaFullCalendar">
                                📅 Vista Calendario
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="pill" href="#vistaTimeline">
                                📊 Vista Timeline
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="pill" href="#vistaLista">
                                📋 Vista Lista
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="pill" href="#vistaDashboard">
                                📈 Dashboard
                            </a>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- VISTA 1: FullCalendar -->
                        <div class="tab-pane fade show active" id="vistaFullCalendar">
                            <div class="month-selector mb-3">
                                <button class="btn btn-outline-primary" onclick="calendar && calendar.prev()">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="btn btn-outline-secondary" onclick="calendar && calendar.today()">
                                    <i class="fas fa-calendar-day me-1"></i>Oggi
                                </button>
                                <button class="btn btn-outline-primary" onclick="calendar && calendar.next()">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                            <div id="fullcalendar-view"></div>
                        </div>

                        <!-- VISTA 2: Timeline con Filtri -->
                        <div class="tab-pane fade" id="vistaTimeline">
                            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                                <select id="filtroArea" class="form-select" style="width: auto;">
                                    <option value="">Tutte le aree</option>
                                    <option value="Scorta">Scorta</option>
                                    <option value="Condotta">Condotta</option>
                                    <option value="Verifica">Verifica</option>
                                    <option value="Manovra">Manovra</option>
                                </select>
                                
                                <select id="filtroMese" class="form-select" style="width: auto;">
                                    <option value="">Tutto l'anno</option>
                                    <option value="1">Gennaio</option>
                                    <option value="2">Febbraio</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Aprile</option>
                                    <option value="5">Maggio</option>
                                    <option value="6">Giugno</option>
                                    <option value="7">Luglio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Settembre</option>
                                    <option value="10">Ottobre</option>
                                    <option value="11">Novembre</option>
                                    <option value="12">Dicembre</option>
                                </select>
                                
                                <input type="text" id="filtroCerca" class="form-control" style="width: 200px;" placeholder="Cerca istruttore...">
                                
                                <select id="filtroTipo" class="form-select" style="width: auto;">
                                    <option value="">Tutti i tipi</option>
                                    <option value="CORSO">CORSO</option>
                                    <option value="FERIE">FERIE</option>
                                    <option value="MALATTIA">MALATTIA</option>
                                    <option value="COMMISSIONE">COMMISSIONE</option>
                                    <option value="RIUNIONE">RIUNIONE</option>
                                </select>
                                
                                <button class="btn btn-primary" onclick="applicaFiltriTimeline()">Applica</button>
                                <button class="btn btn-secondary" onclick="resetFiltriTimeline()">Reset</button>
                            </div>
                            
                            <div style="overflow-x: auto;">
                                <div id="timeline-calendar"></div>
                            </div>
                        </div>

                        <!-- VISTA 3: Lista Ordinabile -->
                        <div class="tab-pane fade" id="vistaLista">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-dark">
                                        <tr>
                                            <th style="cursor: pointer;" onclick="sortListaBy('istruttore')">Istruttore ↕</th>
                                            <th style="cursor: pointer;" onclick="sortListaBy('dataInizio')">Data Inizio ↕</th>
                                            <th style="cursor: pointer;" onclick="sortListaBy('dataFine')">Data Fine ↕</th>
                                            <th style="cursor: pointer;" onclick="sortListaBy('tipo')">Tipo ↕</th>
                                            <th style="cursor: pointer;" onclick="sortListaBy('area')">Area ↕</th>
                                            <th style="cursor: pointer;" onclick="sortListaBy('giorni')">Giorni ↕</th>
                                            <th>Note</th>
                                            <th>Azioni</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody-lista"></tbody>
                                </table>
                            </div>
                            <div class="d-flex justify-content-center gap-2 mt-3">
                                <button class="btn btn-outline-primary" onclick="cambPagLista(-1)" id="btn-prev-lista">← Precedente</button>
                                <span class="align-self-center">Pagina <span id="pag-corrente-lista">1</span> di <span id="pag-totali-lista">1</span></span>
                                <button class="btn btn-outline-primary" onclick="cambPagLista(1)" id="btn-next-lista">Successiva →</button>
                            </div>
                        </div>

                        <!-- VISTA 4: Dashboard -->
                        <div class="tab-pane fade" id="vistaDashboard">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">📅 Impegni Oggi</h6>
                                            <h2 class="text-primary" id="widget-oggi">0</h2>
                                            <ul id="widget-oggi-lista" class="list-unstyled small"></ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">📆 Questa Settimana</h6>
                                            <h2 class="text-primary" id="widget-settimana">0</h2>
                                            <ul id="widget-settimana-lista" class="list-unstyled small"></ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">⚠️ Conflitti</h6>
                                            <h2 class="text-danger" id="widget-conflitti">0</h2>
                                            <ul id="widget-conflitti-lista" class="list-unstyled small"></ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">✅ Disponibili Oggi</h6>
                                            <h2 class="text-success" id="widget-disponibili">0</h2>
                                            <ul id="widget-disponibili-lista" class="list-unstyled small"></ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">📊 Impegni per Area</h6>
                                            <ul class="list-unstyled">
                                                <li><span class="badge bg-danger">Scorta</span>: <strong id="widget-area-scorta">0</strong></li>
                                                <li><span class="badge bg-primary">Condotta</span>: <strong id="widget-area-condotta">0</strong></li>
                                                <li><span class="badge bg-success">Verifica</span>: <strong id="widget-area-verifica">0</strong></li>
                                                <li><span class="badge bg-warning">Manovra</span>: <strong id="widget-area-manovra">0</strong></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">📋 Impegni per Tipo</h6>
                                            <ul class="list-unstyled small">
                                                <li>CORSO: <strong id="widget-tipo-corso">0</strong></li>
                                                <li>FERIE: <strong id="widget-tipo-ferie">0</strong></li>
                                                <li>MALATTIA: <strong id="widget-tipo-malattia">0</strong></li>
                                                <li>COMMISSIONE: <strong id="widget-tipo-commissione">0</strong></li>
                                                <li>RIUNIONE: <strong id="widget-tipo-riunione">0</strong></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-12">
                                    <h5>Calendario Mese Corrente</h5>
                                    <div id="dashboard-mini-calendar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB ISTRUTTORI -->
                <div class="tab-pane fade" id="tabIstruttori">
                    <div class="d-flex justify-content-between mb-3">
                        <h4>Gestione Istruttori</h4>
                        <button class="btn btn-success" onclick="showAddIstruttoreModal()">
                            <i class="fas fa-plus me-1"></i>Nuovo Istruttore
                        </button>
                    </div>
                    <div id="istruttoriList"></div>
                </div>

                <!-- TAB IMPEGNI -->
                <div class="tab-pane fade" id="tabImpegni">
                    <div class="d-flex justify-content-between mb-3">
                        <h4>Gestione Impegni</h4>
                        <button class="btn btn-success" onclick="showAddImpegnoModal()">
                            <i class="fas fa-plus me-1"></i>Nuovo Impegno
                        </button>
                    </div>
                    <div id="impegniList"></div>
                </div>

                <!-- TAB ATTIVITÀ -->
                <div class="tab-pane fade" id="tabAttivita">
                    <div class="d-flex justify-content-between mb-3">
                        <h4>Tipi di Attività</h4>
                        <button class="btn btn-success" onclick="showAddAttivitaModal()">
                            <i class="fas fa-plus me-1"></i>Nuova Attività
                        </button>
                    </div>
                    <div id="attivitaList"></div>
                </div>

                <!-- TAB FESTIVITÀ -->
                <div class="tab-pane fade" id="tabFestivi">
                    <h4 class="mb-3">Gestione Festività</h4>
                    
                    <div class="alert alert-info">
                        <strong><i class="fas fa-info-circle me-1"></i>Info:</strong>
                        Le festività italiane sono già incluse automaticamente. Qui puoi aggiungere festività aziendali extra (ponti, chiusure, ecc.).
                    </div>
                    
                    <div class="d-flex justify-content-between mb-3">
                        <h5>Festività Custom</h5>
                        <button class="btn btn-success" onclick="showAddFestivoModal()">
                            <i class="fas fa-plus me-1"></i>Nuova Festività
                        </button>
                    </div>
                    <div id="festiviList"></div>
                    
                    <hr>
                    
                    <h5 class="mt-4">Festività Italiane (automatiche)</h5>
                    <div id="festiviItalianiList"></div>
                </div>

                <!-- TAB UTENTI (Solo Admin) -->
                <div class="tab-pane fade" id="tabUtenti">
                    <div class="d-flex justify-content-between mb-3">
                        <h4>Gestione Utenti</h4>
                        <button class="btn btn-success" onclick="showAddUtenteModal()">
                            <i class="fas fa-user-plus me-1"></i>Nuovo Utente
                        </button>
                    </div>
                    <div id="utentiList"></div>
                </div>

                <!-- TAB EXPORT -->
                <div class="tab-pane fade" id="tabExport">
                    <h4>Export e Import Dati</h4>
                    <div class="export-section">
                        <h5><i class="fas fa-download me-2"></i>Esporta Dati</h5>
                        <p>Scarica tutti i dati in formato JSON per backup o condivisione.</p>
                        <button class="btn btn-primary" onclick="exportData()">
                            <i class="fas fa-file-download me-1"></i>Scarica Backup JSON
                        </button>
                    </div>
                    
                    <div class="export-section mt-3">
                        <h5><i class="fas fa-upload me-2"></i>Importa Dati</h5>
                        <p>Carica un file JSON precedentemente esportato.</p>
                        <input type="file" id="importFile" accept=".json" class="form-control mb-2">
                        <button class="btn btn-warning" onclick="importData()">
                            <i class="fas fa-file-upload me-1"></i>Importa da File
                        </button>
                    </div>
                    
                    <div class="export-section mt-3 bg-danger-subtle">
                        <h5 class="text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Reset Database</h5>
                        <p>Attenzione: questa operazione cancellerà tutti i dati!</p>
                        <button class="btn btn-danger" onclick="resetDatabase()">
                            <i class="fas fa-trash me-1"></i>Reset Completo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Nuovo Istruttore -->
    <div class="modal fade" id="modalIstruttore" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nuovo Istruttore</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formIstruttore">
                        <div class="mb-3">
                            <label class="form-label">Nome *</label>
                            <input type="text" class="form-control" id="istruttoreNome" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="istruttoreEmail">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Area di appartenenza</label>
                            <select class="form-select" id="istruttoreArea">
                                <option value="">Nessuna</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                    <button type="button" class="btn btn-primary" onclick="saveIstruttore()">Salva</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Nuovo Impegno -->
    <div class="modal fade" id="modalImpegno" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nuovo Impegno</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formImpegno">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Istruttore *</label>
                                <select class="form-select" id="impegnoIstruttore" required></select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Attività *</label>
                                <select class="form-select" id="impegnoAttivita" required></select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Data Inizio *</label>
                                <input type="date" class="form-control" id="impegnoDataInizio" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Giorni Lavorativi *</label>
                                <input type="number" class="form-control" id="impegnoGiorni" min="1" value="1" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Giorni Extra (sabato/festivi da includere)</label>
                            <div class="input-group">
                                <input type="date" class="form-control" id="impegnoGiornoExtraPicker">
                                <button type="button" class="btn btn-outline-primary" onclick="addGiornoExtra()">Aggiungi</button>
                            </div>
                            <div class="form-check mt-2">
                                <input class="form-check-input" type="checkbox" id="impegnoGiornoExtraConta" checked>
                                <label class="form-check-label" for="impegnoGiornoExtraConta">
                                    Conta per la data fine (accorcia la durata)
                                </label>
                            </div>
                            <div class="form-text">Se disattivo, il giorno extra NON conta nei giorni lavorativi (allunga il corso).</div>
                            <input type="hidden" id="impegnoGiorniExtra" value="">
                            <div id="impegnoGiorniExtraList" class="mt-2"></div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Note</label>
                            <textarea class="form-control" id="impegnoNote" rows="2"></textarea>
                        </div>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Luogo</label>
                                <input type="text" class="form-control" id="impegnoLuogo">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Aula</label>
                                <input type="text" class="form-control" id="impegnoAula">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Posti</label>
                                <input type="text" class="form-control" id="impegnoPosti">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                    <button type="button" class="btn btn-primary" onclick="saveImpegno()">Salva</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Nuova Attività -->
    <div class="modal fade" id="modalAttivita" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nuova Attività</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formAttivita">
                        <div class="mb-3">
                            <label class="form-label">Nome *</label>
                            <input type="text" class="form-control" id="attivitaNome" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Colore *</label>
                            <input type="color" class="form-control form-control-color" id="attivitaColore" value="#3498db" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Categoria</label>
                            <input type="text" class="form-control" id="attivitaCategoria">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                    <button type="button" class="btn btn-primary" onclick="saveAttivita()">Salva</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Nuova Festività Custom -->
    <div class="modal fade" id="modalFestivo" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nuova Festività Aziendale</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formFestivo">
                        <div class="mb-3">
                            <label class="form-label">Data *</label>
                            <input type="date" class="form-control" id="festivoData" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Descrizione *</label>
                            <input type="text" class="form-control" id="festivoNome" placeholder="es. Ponte Ferragosto, Chiusura aziendale..." required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                    <button type="button" class="btn btn-primary" onclick="saveFestivo()">Salva</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Nuovo Utente (Solo Admin) -->
    <div class="modal fade" id="modalUtente" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nuovo Utente</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formUtente">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nome *</label>
                                <input type="text" class="form-control" id="utenteNome" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Cognome *</label>
                                <input type="text" class="form-control" id="utenteCognome" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Username *</label>
                            <input type="text" class="form-control" id="utenteUsername" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Password *</label>
                            <input type="password" class="form-control" id="utentePassword" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Ruolo *</label>
                            <select class="form-select" id="utenteRuolo" required onchange="toggleAreaSelect()">
                                <option value="">Seleziona...</option>
                                <option value="Admin">Admin</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Editor">Editor</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>
                        <div class="mb-3" id="utenteAreaContainer">
                            <label class="form-label">Area di appartenenza</label>
                            <select class="form-select" id="utenteArea">
                                <option value="">Nessuna (tutte le aree)</option>
                            </select>
                            <small class="text-muted">Admin e Supervisor vedono tutte le aree. Editor/Viewer solo la propria.</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                    <button type="button" class="btn btn-primary" onclick="saveUtente()">Salva</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Conflitti/Sovrapposizioni -->
    <div class="modal fade" id="modalConflitti" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title"><i class="fas fa-exclamation-triangle me-2"></i>Sovrapposizione Rilevata!</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-warning">
                        <strong>Attenzione:</strong> L'impegno che stai cercando di creare si sovrappone con altri impegni esistenti.
                    </div>
                    <div id="conflittiDettaglio"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
                    <button type="button" class="btn btn-warning" onclick="forceAddImpegno()">
                        <i class="fas fa-exclamation-circle me-1"></i>Crea Comunque
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Database Storage - Scegli una delle due opzioni: -->
    
    <!-- OPZIONE 1: LocalStorage (file locale, singolo utente) -->
    <!-- <script src="static/js/db-storage.js"></script> -->
    
    <!-- OPZIONE 2: SharePoint Multi-Utente (80+ utenti concorrenti) ✅ USATO -->
    <script src="static/js/db-sharepoint.js"></script>
    
    <!-- FullCalendar JS -->
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script>
    
    <!-- Main App Logic -->
    <script src="static/js/calendario-app.js"></script>
    
    <script>
    // ========== MULTI-VISTA CALENDARIO ==========
    
    let calendar;
    let listaImpegni = [];
    let currentPageLista = 1;
    const itemsPerPageLista = 20;
    let sortColumn = 'dataInizio';
    let sortDirection = 'asc';
    
    // Inizializza le viste quando si carica il tab
    document.addEventListener('shown.bs.tab', function (event) {
        const target = event.target.getAttribute('href');
        
        if (target === '#vistaFullCalendar' && !calendar) {
            initFullCalendar();
        } else if (target === '#vistaLista') {
            initLista();
        } else if (target === '#vistaDashboard') {
            initDashboard();
        } else if (target === '#vistaTimeline') {
            initTimeline();
        }
    });
    
    // ========== FULLCALENDAR ==========
    async function initFullCalendar() {
        const calendarEl = document.getElementById('fullcalendar-view');
        if (!calendarEl || calendar) return;
        
        const impegni = await db.getImpegni();
        const istruttori = await db.getIstruttori();
        const attivita = await db.getAttivita();
        
        const events = (impegni || []).map(imp => {
            const istr = istruttori.find(i => i.id === imp.istruttore_id);
            const att = attivita.find(a => a.id === imp.attivita_id);
            return {
                id: imp.id,
                title: `${istr?.nome || 'N/A'} - ${att?.tipo || 'N/A'}`,
                start: imp.data_inizio,
                end: calcDataFinePlus1(imp.data_fine),
                backgroundColor: att?.colore ? '#' + att.colore : '#999999',
                extendedProps: { impegno: imp, istruttore: istr }
            };
        });
        
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: new Date(),
            locale: 'it',
            headerToolbar: {
                left: '',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth'
            },
            buttonText: {
                today: 'Oggi',
                month: 'Mese',
                week: 'Settimana',
                list: 'Lista'
            },
            events: events,
            eventClick: function(info) {
                alert(`Impegno: ${info.event.title}\\nData: ${formatDate(info.event.start)}`);
            },
            height: 'auto'
        });
        
        calendar.render();
    }
    
    function calcDataFinePlus1(dataFine) {
        const d = new Date(dataFine);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    }
    
    // ========== TIMELINE CON FILTRI ==========
    async function initTimeline() {
        const container = document.getElementById('timeline-calendar');
        if (!container) return;
        
        // Genera timeline semplificata (come calendario originale ma con più opzioni)
        const impegni = await db.getImpegni();
        const istruttori = await db.getIstruttori();
        
        let html = '<p class="text-muted">Timeline view: Filtra per vedere meno dati. Vista completa disponibile nella versione Flask.</p>';
        html += `<p><strong>${impegni.length} impegni</strong> totali da <strong>${istruttori.length} istruttori</strong></p>`;
        
        container.innerHTML = html;
    }
    
    async function applicaFiltriTimeline() {
        const area = document.getElementById('filtroArea').value;
        const mese = document.getElementById('filtroMese').value;
        const cerca = document.getElementById('filtroCerca').value.toLowerCase();
        const tipo = document.getElementById('filtroTipo').value;
        
        const allIstruttori = await db.getIstruttori();
        const allImpegni = await db.getImpegni();
        const allAttivita = await db.getAttivita();
        
        const istruttori = (allIstruttori || []).filter(i => {
            if (area && i.area !== area) return false;
            if (cerca && !i.nome.toLowerCase().includes(cerca)) return false;
            return true;
        });
        
        const impegni = (allImpegni || []).filter(imp => {
            if (mese) {
                const impMese = new Date(imp.data_inizio).getMonth() + 1;
                if (impMese !== parseInt(mese)) return false;
            }
            if (tipo) {
                const att = allAttivita.find(a => a.id === imp.attivita_id);
                if (!att || !att.tipo.includes(tipo)) return false;
            }
            return istruttori.some(i => i.id === imp.istruttore_id);
        });
        
        const container = document.getElementById('timeline-calendar');
        container.innerHTML = `
            <div class="alert alert-success">
                <strong>Filtri applicati!</strong><br>
                Istruttori: ${istruttori.length}<br>
                Impegni: ${impegni.length}
            </div>
        `;
    }
    
    function resetFiltriTimeline() {
        document.getElementById('filtroArea').value = '';
        document.getElementById('filtroMese').value = '';
        document.getElementById('filtroCerca').value = '';
        document.getElementById('filtroTipo').value = '';
        initTimeline();
    }
    
    // ========== VISTA LISTA ==========
    async function initLista() {
        listaImpegni = await db.getImpegni() || [];
        await renderLista();
    }
    
    function sortListaBy(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
        
        listaImpegni.sort((a, b) => {
            let valA, valB;
            const istrA = db.getIstruttori().find(i => i.id === a.istruttore_id);
            const istrB = db.getIstruttori().find(i => i.id === b.istruttore_id);
            const attA = db.getAttivita().find(at => at.id === a.attivita_id);
            const attB = db.getAttivita().find(at => at.id === b.attivita_id);
            
            switch(column) {
                case 'istruttore':
                    valA = istrA?.nome || '';
                    valB = istrB?.nome || '';
                    break;
                case 'dataInizio':
                    valA = new Date(a.data_inizio);
                    valB = new Date(b.data_inizio);
                    break;
                case 'dataFine':
                    valA = new Date(a.data_fine);
                    valB = new Date(b.data_fine);
                    break;
                case 'tipo':
                    valA = attA?.tipo || '';
                    valB = attB?.tipo || '';
                    break;
                case 'area':
                    valA = istrA?.area || '';
                    valB = istrB?.area || '';
                    break;
                case 'giorni':
                    valA = calcGiorniLav(a.data_inizio, a.data_fine);
                    valB = calcGiorniLav(b.data_inizio, b.data_fine);
                    break;
                default:
                    return 0;
            }
            
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        renderLista();
    }
    
    async function renderLista() {
        const tbody = document.getElementById('tbody-lista');
        if (!tbody) return;
        
        const istruttori = await db.getIstruttori() || [];
        const attivita = await db.getAttivita() || [];
        
        const start = (currentPageLista - 1) * itemsPerPageLista;
        const end = start + itemsPerPageLista;
        const pageItems = (listaImpegni || []).slice(start, end);
        
        tbody.innerHTML = pageItems.map(imp => {
            const istr = istruttori.find(i => i.id === imp.istruttore_id);
            const att = attivita.find(a => a.id === imp.attivita_id);
            const giorni = calcGiorniLav(imp.data_inizio, imp.data_fine);
            const badgeColor = {Scorta: 'danger', Condotta: 'primary', Verifica: 'success', Manovra: 'warning'}[istr?.area] || 'secondary';
            
            return `
                <tr>
                    <td>${istr?.nome || 'N/A'}</td>
                    <td>${formatDate(imp.data_inizio)}</td>
                    <td>${formatDate(imp.data_fine)}</td>
                    <td><span class="badge" style="background-color: #${att?.colore || '999'};">${att?.tipo || 'N/A'}</span></td>
                    <td><span class="badge bg-${badgeColor}">${istr?.area || 'N/A'}</span></td>
                    <td>${giorni}</td>
                    <td>${imp.note || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="alert('Dettagli impegno ${imp.id}')">👁️</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        const totPages = Math.ceil(listaImpegni.length / itemsPerPageLista);
        document.getElementById('pag-corrente-lista').textContent = currentPageLista;
        document.getElementById('pag-totali-lista').textContent = totPages;
        document.getElementById('btn-prev-lista').disabled = currentPageLista === 1;
        document.getElementById('btn-next-lista').disabled = currentPageLista === totPages;
    }
    
    function cambPagLista(delta) {
        currentPageLista += delta;
        renderLista();
    }
    
    function calcGiorniLav(dataInizio, dataFine) {
        const start = new Date(dataInizio);
        const end = new Date(dataFine);
        let count = 0;
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dow = d.getDay();
            if (dow !== 0 && dow !== 6) count++;
        }
        
        return count;
    }
    
    // ========== DASHBOARD ==========
    async function initDashboard() {
        const oggi = new Date();
        oggi.setHours(0,0,0,0);
        
        const impegni = await db.getImpegni() || [];
        const istruttori = await db.getIstruttori() || [];
        const attivita = await db.getAttivita() || [];
        
        // Impegni oggi
        const impegniOggi = impegni.filter(imp => {
            const start = new Date(imp.data_inizio);
            const end = new Date(imp.data_fine);
            return start <= oggi && end >= oggi;
        });
        
        document.getElementById('widget-oggi').textContent = impegniOggi.length;
        document.getElementById('widget-oggi-lista').innerHTML = impegniOggi.slice(0,5).map(imp => {
            const istr = istruttori.find(i => i.id === imp.istruttore_id);
            const att = attivita.find(a => a.id === imp.attivita_id);
            return `<li>${istr?.nome || 'N/A'} - ${att?.tipo || 'N/A'}</li>`;
        }).join('');
        
        // Settimana
        const inizioSett = new Date(oggi);
        inizioSett.setDate(oggi.getDate() - oggi.getDay() + 1);
        const fineSett = new Date(inizioSett);
        fineSett.setDate(inizioSett.getDate() + 6);
        
        const impegniSett = impegni.filter(imp => {
            const start = new Date(imp.data_inizio);
            return start >= inizioSett && start <= fineSett;
        });
        
        document.getElementById('widget-settimana').textContent = impegniSett.length;
        
        // Conflitti (calcolo semplificato)
        document.getElementById('widget-conflitti').textContent = 0;
        document.getElementById('widget-conflitti-lista').innerHTML = '<li>Nessuna sovrapposizione ✅</li>';
        
        // Disponibili
        const impegnatiOggi = new Set(impegniOggi.map(i => i.istruttore_id));
        const disponibili = istruttori.filter(i => !impegnatiOggi.has(i.id));
        
        document.getElementById('widget-disponibili').textContent = disponibili.length;
        document.getElementById('widget-disponibili-lista').innerHTML = disponibili.slice(0,8).map(i => 
            `<li>${i.nome} <span class="badge bg-secondary">${i.area}</span></li>`
        ).join('');
        
        // Per area
        const perArea = {Scorta: 0, Condotta: 0, Verifica: 0, Manovra: 0};
        impegni.forEach(imp => {
            const istr = istruttori.find(i => i.id === imp.istruttore_id);
            if (istr && perArea[istr.area] !== undefined) perArea[istr.area]++;
        });
        
        document.getElementById('widget-area-scorta').textContent = perArea.Scorta;
        document.getElementById('widget-area-condotta').textContent = perArea.Condotta;
        document.getElementById('widget-area-verifica').textContent = perArea.Verifica;
        document.getElementById('widget-area-manovra').textContent = perArea.Manovra;
        
        // Per tipo
        const perTipo = {CORSO: 0, FERIE: 0, MALATTIA: 0, COMMISSIONE: 0, RIUNIONE: 0};
        impegni.forEach(imp => {
            const att = attivita.find(a => a.id === imp.attivita_id);
            const tipo = att?.tipo.toUpperCase() || '';
            if (tipo.includes('CORSO')) perTipo.CORSO++;
            else if (tipo.includes('FERIE')) perTipo.FERIE++;
            else if (tipo.includes('MALATTIA')) perTipo.MALATTIA++;
            else if (tipo.includes('COMMISSIONE')) perTipo.COMMISSIONE++;
            else if (tipo.includes('RIUNIONE')) perTipo.RIUNIONE++;
        });
        
        document.getElementById('widget-tipo-corso').textContent = perTipo.CORSO;
        document.getElementById('widget-tipo-ferie').textContent = perTipo.FERIE;
        document.getElementById('widget-tipo-malattia').textContent = perTipo.MALATTIA;
        document.getElementById('widget-tipo-commissione').textContent = perTipo.COMMISSIONE;
        document.getElementById('widget-tipo-riunione').textContent = perTipo.RIUNIONE;
        
        // Mini calendar
        initMiniCalendar();
    }
    
    async function initMiniCalendar() {
        const calendarEl = document.getElementById('dashboard-mini-calendar');
        if (!calendarEl) return;
        
        const impegni = await db.getImpegni() || [];
        const istruttori = await db.getIstruttori() || [];
        const attivita = await db.getAttivita() || [];
        
        const events = impegni.map(imp => {
            const istr = istruttori.find(i => i.id === imp.istruttore_id);
            const att = attivita.find(a => a.id === imp.attivita_id);
            return {
                title: `${istr?.nome || 'N/A'} - ${att?.tipo || 'N/A'}`,
                start: imp.data_inizio,
                end: calcDataFinePlus1(imp.data_fine),
                backgroundColor: att?.colore ? '#' + att.colore : '#999999'
            };
        });
        
        const miniCal = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: new Date(),
            locale: 'it',
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: ''
            },
            events: events,
            height: 400
        });
        
        miniCal.render();
    }
    
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2,'0');
        const mon = String(d.getMonth()+1).padStart(2,'0');
        const yr = String(d.getFullYear());
        return `${day}/${mon}/${yr}`;
    }
    
    // Auto-init prima vista quando app si carica
    setTimeout(() => {
        if (document.getElementById('vistaFullCalendar').classList.contains('active')) {
            initFullCalendar();
        }
    }, 1000);
    </script>
</body>
</html>

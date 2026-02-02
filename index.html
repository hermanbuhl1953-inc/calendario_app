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
                    <a class="nav-link" data-bs-toggle="tab" href="#tabExport">
                        <i class="fas fa-download me-2"></i>Export/Import
                    </a>
                </li>
            </ul>

            <div class="tab-content p-4">
                <!-- TAB CALENDARIO -->
                <div class="tab-pane fade show active" id="tabCalendario">
                    <div class="month-selector">
                        <button class="btn btn-outline-primary" onclick="previousMonth()">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <select id="selectMese" class="form-select" style="width: auto;" onchange="loadCalendario()">
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
                        <select id="selectAnno" class="form-select" style="width: auto;" onchange="loadCalendario()"></select>
                        <button class="btn btn-outline-primary" onclick="nextMonth()">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="btn btn-outline-secondary ms-auto" onclick="goToToday()">
                            <i class="fas fa-calendar-day me-1"></i>Oggi
                        </button>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Filtra per Istruttore</label>
                        <select id="filtroIstruttore" class="form-select" onchange="loadCalendario()">
                            <option value="">Tutti gli istruttori</option>
                        </select>
                    </div>
                    
                    <div id="calendarioContainer"></div>
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

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Database Storage -->
    <script src="static/js/db-storage.js"></script>
    
    <!-- Main App Logic -->
    <script src="static/js/calendario-app.js"></script>
</body>
</html>

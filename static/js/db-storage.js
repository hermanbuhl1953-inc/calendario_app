/**
 * DB Storage - LocalStorage wrapper per gestione dati
 * Sostituisce SQLite con storage browser
 */

class CalendarioStorage {
    constructor() {
        this.KEYS = {
            ISTRUTTORI: 'calendario_istruttori',
            ATTIVITA: 'calendario_attivita',
            IMPEGNI: 'calendario_impegni',
            SOSTITUZIONI: 'calendario_sostituzioni',
            FESTIVI: 'calendario_festivi',
            UTENTI: 'calendario_utenti',
            CURRENT_USER: 'calendario_current_user',
            AUDIT_LOG: 'calendario_audit_log',
            AREE: 'calendario_aree',
            RUOLI: 'calendario_ruoli'
        };
        
        this.initializeData();
    }

    // ==================== INIZIALIZZAZIONE ====================
    
    initializeData() {
        // Inizializza strutture se non esistono
        if (!localStorage.getItem(this.KEYS.ISTRUTTORI)) {
            this.saveData(this.KEYS.ISTRUTTORI, []);
        }
        
        if (!localStorage.getItem(this.KEYS.ATTIVITA)) {
            this.saveData(this.KEYS.ATTIVITA, this.getDefaultAttivita());
        }
        
        if (!localStorage.getItem(this.KEYS.IMPEGNI)) {
            this.saveData(this.KEYS.IMPEGNI, []);
        }
        
        if (!localStorage.getItem(this.KEYS.SOSTITUZIONI)) {
            this.saveData(this.KEYS.SOSTITUZIONI, []);
        }
        
        if (!localStorage.getItem(this.KEYS.FESTIVI)) {
            this.saveData(this.KEYS.FESTIVI, []);
        }
        
        if (!localStorage.getItem(this.KEYS.UTENTI)) {
            this.saveData(this.KEYS.UTENTI, this.getDefaultUtenti());
        }
        
        if (!localStorage.getItem(this.KEYS.AUDIT_LOG)) {
            this.saveData(this.KEYS.AUDIT_LOG, []);
        }
        
        if (!localStorage.getItem(this.KEYS.AREE)) {
            this.saveData(this.KEYS.AREE, this.getDefaultAree());
        }
        
        if (!localStorage.getItem(this.KEYS.RUOLI)) {
            this.saveData(this.KEYS.RUOLI, this.getDefaultRuoli());
        }
    }
    
    getDefaultAttivita() {
        return [
            { id: 1, nome: 'Corso Base', colore: '#4CAF50', categoria: 'Formazione' },
            { id: 2, nome: 'Corso Avanzato', colore: '#2196F3', categoria: 'Formazione' },
            { id: 3, nome: 'Ferie', colore: '#FF9800', categoria: 'Assenza' },
            { id: 4, nome: 'Malattia', colore: '#F44336', categoria: 'Assenza' },
            { id: 5, nome: 'Permesso', colore: '#9C27B0', categoria: 'Assenza' },
            { id: 6, nome: 'Congedo', colore: '#FFC107', categoria: 'Assenza' },
            { id: 7, nome: 'Riposo', colore: '#607D8B', categoria: 'Assenza' }
        ];
    }
    
    getDefaultAree() {
        return [
            { id: 1, nome: 'Scorta', colore: '#dc3545', descrizione: 'Area Scorta' },
            { id: 2, nome: 'Condotta', colore: '#0d6efd', descrizione: 'Area Condotta' },
            { id: 3, nome: 'Verifica', colore: '#198754', descrizione: 'Area Verifica' },
            { id: 4, nome: 'Manovra', colore: '#ffc107', descrizione: 'Area Manovra' }
        ];
    }
    
    getDefaultUtenti() {
        return [
            {
                id: 1,
                username: 'admin',
                password: this.hashPassword('admin'),
                nome: 'Amministratore',
                cognome: 'Sistema',
                ruolo: 'Admin',
                area: null, // Admin vede tutte le aree
                attivo: true
            }
        ];
    }
    
    getDefaultRuoli() {
        return [
            { id: 1, nome: 'Admin', descrizione: 'Accesso totale, gestione utenti e permessi' },
            { id: 2, nome: 'Supervisor', descrizione: 'Tutte le aree, senza gestione utenti' },
            { id: 3, nome: 'Editor', descrizione: 'Modifica solo la propria area' },
            { id: 4, nome: 'Viewer', descrizione: 'Visualizzazione solo propria area' }
        ];
    }

    // ==================== UTILITY ====================
    
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Errore lettura ${key}:`, e);
            return null;
        }
    }
    
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error(`❌ Errore salvataggio ${key}:`, e);
            
            // Mostra errore all'utente
            if (e.name === 'QuotaExceededError') {
                alert('❌ Errore: localStorage pieno! Elimina alcuni dati per continuare.');
            } else if (e.name === 'SecurityError' || e.message.includes('denied')) {
                alert('❌ Errore: localStorage è disabilitato nel tuo browser o non autorizzato');
            } else {
                alert(`❌ Errore nel salvataggio: ${e.message}`);
            }
            
            return false;
        }
    }
    
    generateId(items) {
        if (!items || items.length === 0) return 1;
        return Math.max(...items.map(i => i.id)) + 1;
    }
    
    hashPassword(password) {
        // Semplice hash per demo (in produzione usare bcrypt o simili)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // ==================== ISTRUTTORI ====================
    
    getIstruttori() {
        return this.getData(this.KEYS.ISTRUTTORI) || [];
    }
    
    getIstruttore(id) {
        const istruttori = this.getIstruttori();
        return istruttori.find(i => i.id === parseInt(id));
    }
    
    addIstruttore(nome, email = '', area_id = null) {
        const istruttori = this.getIstruttori();
        const nuovoIstruttore = {
            id: this.generateId(istruttori),
            nome: nome,
            email: email,
            area_id: area_id,
            attivo: true
        };
        istruttori.push(nuovoIstruttore);
        this.saveData(this.KEYS.ISTRUTTORI, istruttori);
        this.logAction('add_istruttore', `Aggiunto istruttore: ${nome}`);
        return nuovoIstruttore;
    }
    
    updateIstruttore(id, data) {
        const istruttori = this.getIstruttori();
        const index = istruttori.findIndex(i => i.id === parseInt(id));
        if (index !== -1) {
            istruttori[index] = { ...istruttori[index], ...data };
            this.saveData(this.KEYS.ISTRUTTORI, istruttori);
            this.logAction('update_istruttore', `Modificato istruttore: ${istruttori[index].nome}`);
            return istruttori[index];
        }
        return null;
    }
    
    deleteIstruttore(id) {
        const istruttori = this.getIstruttori();
        const filtered = istruttori.filter(i => i.id !== parseInt(id));
        this.saveData(this.KEYS.ISTRUTTORI, filtered);
        this.logAction('delete_istruttore', `Eliminato istruttore ID: ${id}`);
        return true;
    }

    // ==================== ATTIVITÀ ====================
    
    getAttivita() {
        return this.getData(this.KEYS.ATTIVITA) || [];
    }
    
    getAttivitaById(id) {
        const attivita = this.getAttivita();
        return attivita.find(a => a.id === parseInt(id));
    }
    
    addAttivita(nome, colore, categoria = '') {
        const attivita = this.getAttivita();
        const nuovaAttivita = {
            id: this.generateId(attivita),
            nome: nome,
            colore: colore,
            categoria: categoria
        };
        attivita.push(nuovaAttivita);
        this.saveData(this.KEYS.ATTIVITA, attivita);
        this.logAction('add_attivita', `Aggiunta attività: ${nome}`);
        return nuovaAttivita;
    }
    
    updateAttivita(id, data) {
        const attivita = this.getAttivita();
        const index = attivita.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            attivita[index] = { ...attivita[index], ...data };
            this.saveData(this.KEYS.ATTIVITA, attivita);
            this.logAction('update_attivita', `Modificata attività: ${attivita[index].nome}`);
            return attivita[index];
        }
        return null;
    }
    
    deleteAttivita(id) {
        const attivita = this.getAttivita();
        const filtered = attivita.filter(a => a.id !== parseInt(id));
        this.saveData(this.KEYS.ATTIVITA, filtered);
        this.logAction('delete_attivita', `Eliminata attività ID: ${id}`);
        return true;
    }

    // ==================== IMPEGNI ====================
    
    getImpegni() {
        return this.getData(this.KEYS.IMPEGNI) || [];
    }
    
    getImpegno(id) {
        const impegni = this.getImpegni();
        return impegni.find(i => i.id === parseInt(id));
    }
    
    addImpegno(data) {
        // Verifica sovrapposizioni prima di aggiungere
        const sovrapposizioni = this.verificaSovrapposizione(
            data.istruttore_id,
            data.data_inizio,
            data.data_fine
        );
        
        if (sovrapposizioni.length > 0) {
            return {
                error: true,
                message: 'Sovrapposizione rilevata!',
                conflitti: sovrapposizioni
            };
        }
        
        const impegni = this.getImpegni();
        const nuovoImpegno = {
            id: this.generateId(impegni),
            ...data,
            creato_il: new Date().toISOString(),
            modificato_il: new Date().toISOString()
        };
        impegni.push(nuovoImpegno);
        
        // Prova a salvare
        const salvato = this.saveData(this.KEYS.IMPEGNI, impegni);
        if (!salvato) {
            return {
                error: true,
                message: 'Errore nel salvataggio dei dati'
            };
        }
        
        this.logAction('add_impegno', `Aggiunto impegno ID: ${nuovoImpegno.id}`);
        return {
            error: false,
            impegno: nuovoImpegno
        };
    }
    
    updateImpegno(id, data) {
        const impegni = this.getImpegni();
        const index = impegni.findIndex(i => i.id === parseInt(id));
        if (index !== -1) {
            // Se vengono modificate le date, verifica sovrapposizioni
            if (data.data_inizio || data.data_fine || data.istruttore_id) {
                const impegnoCorrente = impegni[index];
                const dataInizio = data.data_inizio || impegnoCorrente.data_inizio;
                const dataFine = data.data_fine || impegnoCorrente.data_fine;
                const istruttoreId = data.istruttore_id || impegnoCorrente.istruttore_id;
                
                const sovrapposizioni = this.verificaSovrapposizione(
                    istruttoreId,
                    dataInizio,
                    dataFine,
                    id
                );
                
                if (sovrapposizioni.length > 0) {
                    return {
                        error: true,
                        message: 'Sovrapposizione rilevata!',
                        conflitti: sovrapposizioni
                    };
                }
            }
            
            impegni[index] = { 
                ...impegni[index], 
                ...data,
                modificato_il: new Date().toISOString()
            };
            
            // Prova a salvare
            const salvato = this.saveData(this.KEYS.IMPEGNI, impegni);
            if (!salvato) {
                return {
                    error: true,
                    message: 'Errore nel salvataggio dei dati'
                };
            }
            
            this.logAction('update_impegno', `Modificato impegno ID: ${id}`);
            return {
                error: false,
                impegno: impegni[index]
            };
        }
        return {
            error: true,
            message: 'Impegno non trovato'
        };
    }
    
    deleteImpegno(id) {
        const impegni = this.getImpegni();
        const filtered = impegni.filter(i => i.id !== parseInt(id));
        this.saveData(this.KEYS.IMPEGNI, filtered);
        this.logAction('delete_impegno', `Eliminato impegno ID: ${id}`);
        return true;
    }
    
    getImpegniByIstruttore(istruttoreId, anno = null, mese = null) {
        let impegni = this.getImpegni().filter(i => i.istruttore_id === parseInt(istruttoreId));
        
        if (anno && mese) {
            impegni = impegni.filter(i => {
                const dataInizio = new Date(i.data_inizio);
                const dataFine = new Date(i.data_fine);
                const primoGiornoMese = new Date(anno, mese - 1, 1);
                const ultimoGiornoMese = new Date(anno, mese, 0);
                
                return (dataInizio <= ultimoGiornoMese && dataFine >= primoGiornoMese);
            });
        }
        
        return impegni;
    }

    // ==================== FESTIVI ====================
    
    getFestivi(anno = null) {
        let festivi = this.getData(this.KEYS.FESTIVI) || [];
        
        // Aggiungi festivi italiani fissi
        if (anno) {
            const festiviItaliani = this.getFestiviItaliani(anno);
            festivi = [...festiviItaliani, ...festivi.filter(f => {
                const dataFestivo = new Date(f.data);
                return dataFestivo.getFullYear() === anno;
            })];
        }
        
        return festivi;
    }
    
    getFestiviItaliani(anno) {
        const festivi = [
            { data: `${anno}-01-01`, nome: 'Capodanno' },
            { data: `${anno}-01-06`, nome: 'Epifania' },
            { data: `${anno}-04-25`, nome: 'Liberazione' },
            { data: `${anno}-05-01`, nome: 'Festa del Lavoro' },
            { data: `${anno}-06-02`, nome: 'Festa della Repubblica' },
            { data: `${anno}-08-15`, nome: 'Ferragosto' },
            { data: `${anno}-11-01`, nome: 'Tutti i Santi' },
            { data: `${anno}-12-08`, nome: 'Immacolata' },
            { data: `${anno}-12-25`, nome: 'Natale' },
            { data: `${anno}-12-26`, nome: 'Santo Stefano' }
        ];
        
        // Calcola Pasqua
        const pasqua = this.calcolaPasqua(anno);
        const lunediAngelo = new Date(pasqua);
        lunediAngelo.setDate(lunediAngelo.getDate() + 1);
        
        festivi.push({
            data: pasqua.toISOString().split('T')[0],
            nome: 'Pasqua'
        });
        festivi.push({
            data: lunediAngelo.toISOString().split('T')[0],
            nome: 'Lunedì dell\'Angelo'
        });
        
        return festivi;
    }
    
    calcolaPasqua(anno) {
        const a = anno % 19;
        const b = Math.floor(anno / 100);
        const c = anno % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const mese = Math.floor((h + l - 7 * m + 114) / 31);
        const giorno = ((h + l - 7 * m + 114) % 31) + 1;
        
        return new Date(anno, mese - 1, giorno);
    }
    
    addFestivoCustom(data, nome = '') {
        const festivi = this.getData(this.KEYS.FESTIVI) || [];
        const nuovoFestivo = {
            id: this.generateId(festivi),
            data: data,
            nome: nome
        };
        festivi.push(nuovoFestivo);
        this.saveData(this.KEYS.FESTIVI, festivi);
        this.logAction('add_festivo', `Aggiunto festivo: ${data} - ${nome}`);
        return nuovoFestivo;
    }
    
    deleteFestivoCustom(id) {
        const festivi = this.getData(this.KEYS.FESTIVI) || [];
        const filtered = festivi.filter(f => f.id !== parseInt(id));
        this.saveData(this.KEYS.FESTIVI, filtered);
        this.logAction('delete_festivo', `Eliminato festivo ID: ${id}`);
        return true;
    }

    // ==================== AREE ====================
    
    getAree() {
        return this.getData(this.KEYS.AREE) || [];
    }
    
    getArea(id) {
        const aree = this.getAree();
        return aree.find(a => a.id === parseInt(id));
    }
    
    getIstruttoriByArea(areaId) {
        const istruttori = this.getIstruttori();
        return istruttori.filter(i => i.area_id === parseInt(areaId));
    }

    // ==================== VERIFICA SOVRAPPOSIZIONI ====================
    
    verificaSovrapposizione(istruttoreId, dataInizio, dataFine, impegnoIdEscluso = null) {
        const impegni = this.getImpegni();
        const dataInizioObj = new Date(dataInizio);
        const dataFineObj = new Date(dataFine);
        
        const sovrapposizioni = impegni.filter(imp => {
            // Escludi l'impegno stesso se stiamo modificando
            if (impegnoIdEscluso && imp.id === parseInt(impegnoIdEscluso)) {
                return false;
            }
            
            // Controlla solo impegni dello stesso istruttore
            if (imp.istruttore_id !== parseInt(istruttoreId)) {
                return false;
            }
            
            const impInizio = new Date(imp.data_inizio);
            const impFine = new Date(imp.data_fine);
            
            // Verifica sovrapposizione: 
            // (Start1 <= End2) AND (End1 >= Start2)
            return (dataInizioObj <= impFine && dataFineObj >= impInizio);
        });
        
        // Arricchisci con info attività e istruttore
        return sovrapposizioni.map(sov => {
            const attivita = this.getAttivitaById(sov.attivita_id);
            const istruttore = this.getIstruttore(sov.istruttore_id);
            return {
                ...sov,
                attivita_nome: attivita ? attivita.nome : 'N/D',
                istruttore_nome: istruttore ? istruttore.nome : 'N/D'
            };
        });
    }
    
    // ==================== SOSTITUZIONI ====================
    
    getSostituzioni() {
        return this.getData(this.KEYS.SOSTITUZIONI) || [];
    }
    
    addSostituzione(impegnoId, dataSostituzione, istruttoreOriginaleId, istruttoreSostitutoId, note = '') {
        const sostituzioni = this.getSostituzioni();
        const nuovaSostituzione = {
            id: this.generateId(sostituzioni),
            impegno_id: impegnoId,
            data_sostituzione: dataSostituzione,
            istruttore_originale_id: istruttoreOriginaleId,
            istruttore_sostituto_id: istruttoreSostitutoId,
            note: note,
            creato_il: new Date().toISOString()
        };
        sostituzioni.push(nuovaSostituzione);
        this.saveData(this.KEYS.SOSTITUZIONI, sostituzioni);
        this.logAction('add_sostituzione', `Sostituzione creata per impegno ${impegnoId}`);
        return nuovaSostituzione;
    }
    
    getSostituzioniByImpegno(impegnoId) {
        const sostituzioni = this.getSostituzioni();
        return sostituzioni.filter(s => s.impegno_id === parseInt(impegnoId));
    }
    
    deleteSostituzione(id) {
        const sostituzioni = this.getSostituzioni();
        const filtered = sostituzioni.filter(s => s.id !== parseInt(id));
        this.saveData(this.KEYS.SOSTITUZIONI, filtered);
        this.logAction('delete_sostituzione', `Eliminata sostituzione ID: ${id}`);
        return true;
    }

    // ==================== AUTENTICAZIONE ====================
    
    login(username, password) {
        const utenti = this.getData(this.KEYS.UTENTI) || [];
        const utente = utenti.find(u => 
            u.username === username && 
            u.password === this.hashPassword(password) &&
            u.attivo
        );
        
        if (utente) {
            const userData = { ...utente };
            delete userData.password;
            this.saveData(this.KEYS.CURRENT_USER, userData);
            this.logAction('login', `Login: ${username}`);
            return userData;
        }
        return null;
    }
    
    logout() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            this.logAction('logout', `Logout: ${currentUser.username}`);
        }
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    }
    
    getCurrentUser() {
        return this.getData(this.KEYS.CURRENT_USER);
    }
    
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }
    
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.ruolo === 'Admin';
    }
    
    isSupervisor() {
        const user = this.getCurrentUser();
        return user && user.ruolo === 'Supervisor';
    }
    
    canViewAllAreas() {
        const user = this.getCurrentUser();
        return user && (user.ruolo === 'Admin' || user.ruolo === 'Supervisor');
    }
    
    getUserArea() {
        const user = this.getCurrentUser();
        return user ? user.area : null;
    }
    
    canEdit() {
        const user = this.getCurrentUser();
        return user && (user.ruolo === 'Admin' || user.ruolo === 'Supervisor' || user.ruolo === 'Editor');
    }
    
    // Gestione Utenti (solo Admin)
    
    addUtente(username, password, nome, cognome, ruolo, area = null) {
        if (!this.isAdmin()) {
            return { error: true, message: 'Solo Admin può creare utenti' };
        }
        
        const utenti = this.getData(this.KEYS.UTENTI) || [];
        
        // Verifica username univoco
        if (utenti.find(u => u.username === username)) {
            return { error: true, message: 'Username già esistente' };
        }
        
        const nuovoUtente = {
            id: this.generateId(utenti),
            username: username,
            password: this.hashPassword(password),
            nome: nome,
            cognome: cognome,
            ruolo: ruolo,
            area: area,
            attivo: true,
            creato_il: new Date().toISOString()
        };
        
        utenti.push(nuovoUtente);
        this.saveData(this.KEYS.UTENTI, utenti);
        this.logAction('add_utente', `Creato utente: ${username}`);
        
        return { error: false, utente: nuovoUtente };
    }
    
    getUtenti() {
        if (!this.isAdmin()) {
            return [];
        }
        return this.getData(this.KEYS.UTENTI) || [];
    }
    
    updateUtente(id, data) {
        if (!this.isAdmin()) {
            return { error: true, message: 'Solo Admin può modificare utenti' };
        }
        
        const utenti = this.getData(this.KEYS.UTENTI) || [];
        const index = utenti.findIndex(u => u.id === parseInt(id));
        
        if (index !== -1) {
            utenti[index] = { 
                ...utenti[index], 
                ...data,
                // Non modificare password se non fornita
                password: data.password ? this.hashPassword(data.password) : utenti[index].password
            };
            this.saveData(this.KEYS.UTENTI, utenti);
            this.logAction('update_utente', `Modificato utente ID: ${id}`);
            return { error: false, utente: utenti[index] };
        }
        
        return { error: true, message: 'Utente non trovato' };
    }
    
    deleteUtente(id) {
        if (!this.isAdmin()) {
            return { error: true, message: 'Solo Admin può eliminare utenti' };
        }
        
        const utenti = this.getData(this.KEYS.UTENTI) || [];
        const filtered = utenti.filter(u => u.id !== parseInt(id));
        this.saveData(this.KEYS.UTENTI, filtered);
        this.logAction('delete_utente', `Eliminato utente ID: ${id}`);
        return { error: false };
    }

    // ==================== AUDIT LOG ====================
    
    logAction(action, description) {
        const log = this.getData(this.KEYS.AUDIT_LOG) || [];
        const currentUser = this.getCurrentUser();
        
        log.push({
            id: this.generateId(log),
            action: action,
            description: description,
            username: currentUser ? currentUser.username : 'system',
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        });
        
        // Mantieni solo ultimi 1000 log
        if (log.length > 1000) {
            log.shift();
        }
        
        this.saveData(this.KEYS.AUDIT_LOG, log);
    }
    
    getAuditLog(limit = 100) {
        const log = this.getData(this.KEYS.AUDIT_LOG) || [];
        return log.slice(-limit).reverse();
    }

    // ==================== EXPORT/IMPORT ====================
    
    exportData() {
        return {
            istruttori: this.getData(this.KEYS.ISTRUTTORI),
            attivita: this.getData(this.KEYS.ATTIVITA),
            impegni: this.getData(this.KEYS.IMPEGNI),
            sostituzioni: this.getData(this.KEYS.SOSTITUZIONI),
            festivi: this.getData(this.KEYS.FESTIVI),
            utenti: this.getData(this.KEYS.UTENTI),
            aree: this.getData(this.KEYS.AREE),
            ruoli: this.getData(this.KEYS.RUOLI),
            audit_log: this.getData(this.KEYS.AUDIT_LOG),
            exported_at: new Date().toISOString(),
            version: '2.0'
        };
    }
    
    importData(data) {
        if (confirm('Attenzione: questa operazione sovrascriverà tutti i dati esistenti. Continuare?')) {
            if (data.istruttori) this.saveData(this.KEYS.ISTRUTTORI, data.istruttori);
            if (data.attivita) this.saveData(this.KEYS.ATTIVITA, data.attivita);
            if (data.impegni) this.saveData(this.KEYS.IMPEGNI, data.impegni);
            if (data.sostituzioni) this.saveData(this.KEYS.SOSTITUZIONI, data.sostituzioni);
            if (data.festivi) this.saveData(this.KEYS.FESTIVI, data.festivi);
            if (data.utenti) this.saveData(this.KEYS.UTENTI, data.utenti);
            if (data.aree) this.saveData(this.KEYS.AREE, data.aree);
            if (data.ruoli) this.saveData(this.KEYS.RUOLI, data.ruoli);
            
            this.logAction('import_data', `Dati importati da backup (v${data.version || '1.0'})`);
            return true;
        }
        return false;
    }
    
    resetAll() {
        if (confirm('ATTENZIONE: Questa operazione cancellerà TUTTI i dati! Continuare?')) {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            this.initializeData();
            this.logAction('reset_all', 'Database resettato');
            return true;
        }
        return false;
    }
}

// Inizializza storage globale
window.db = new CalendarioStorage();

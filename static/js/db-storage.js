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
            AUDIT_LOG: 'calendario_audit_log'
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
    }
    
    getDefaultAttivita() {
        return [
            { id: 1, nome: 'Corso Base', colore: '#4CAF50', categoria: 'Formazione' },
            { id: 2, nome: 'Corso Avanzato', colore: '#2196F3', categoria: 'Formazione' },
            { id: 3, nome: 'Ferie', colore: '#FF9800', categoria: 'Assenza' },
            { id: 4, nome: 'Malattia', colore: '#F44336', categoria: 'Assenza' },
            { id: 5, nome: 'Permesso', colore: '#9C27B0', categoria: 'Assenza' }
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
                attivo: true
            }
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
            console.error(`Errore salvataggio ${key}:`, e);
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
    
    addIstruttore(nome, email = '') {
        const istruttori = this.getIstruttori();
        const nuovoIstruttore = {
            id: this.generateId(istruttori),
            nome: nome,
            email: email,
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
        const impegni = this.getImpegni();
        const nuovoImpegno = {
            id: this.generateId(impegni),
            ...data,
            creato_il: new Date().toISOString(),
            modificato_il: new Date().toISOString()
        };
        impegni.push(nuovoImpegno);
        this.saveData(this.KEYS.IMPEGNI, impegni);
        this.logAction('add_impegno', `Aggiunto impegno ID: ${nuovoImpegno.id}`);
        return nuovoImpegno;
    }
    
    updateImpegno(id, data) {
        const impegni = this.getImpegni();
        const index = impegni.findIndex(i => i.id === parseInt(id));
        if (index !== -1) {
            impegni[index] = { 
                ...impegni[index], 
                ...data,
                modificato_il: new Date().toISOString()
            };
            this.saveData(this.KEYS.IMPEGNI, impegni);
            this.logAction('update_impegno', `Modificato impegno ID: ${id}`);
            return impegni[index];
        }
        return null;
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
            audit_log: this.getData(this.KEYS.AUDIT_LOG),
            exported_at: new Date().toISOString()
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
            
            this.logAction('import_data', 'Dati importati da backup');
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

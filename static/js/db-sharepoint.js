/**
 * Database SharePoint - Gestione dati tramite SharePoint REST API
 * Sostituisce LocalStorage con SharePoint Lists per supportare 80+ utenti concorrenti
 */

class SharePointDatabase {
    constructor() {
        // URL base SharePoint (verrà rilevato automaticamente)
        this.siteUrl = this.getSiteUrl();
        this.listNames = {
            istruttori: 'CalendarioIstruttori',
            attivita: 'CalendarioAttivita',
            impegni: 'CalendarioImpegni',
            sostituzioni: 'CalendarioSostituzioni',
            festivi: 'CalendarioFestivi',
            utenti: 'CalendarioUtenti',
            aree: 'CalendarioAree',
            auditLog: 'CalendarioAuditLog'
        };
        
        // Cache locale per performance
        this.cache = {
            istruttori: [],
            attivita: [],
            impegni: [],
            sostituzioni: [],
            festivi: [],
            utenti: [],
            aree: [],
            lastRefresh: null
        };
        
        // Intervallo auto-refresh (30 secondi)
        this.refreshInterval = 30000;
        this.autoRefreshEnabled = true;
        
        // Flag inizializzazione
        this.initialized = false;
    }
    
    /**
     * Rileva URL SharePoint corrente
     */
    getSiteUrl() {
        // Se siamo su SharePoint, usa l'URL corrente
        if (window.location.hostname.includes('sharepoint.com')) {
            const path = window.location.pathname.split('/');
            // Esempio: https://tenant.sharepoint.com/sites/sitename
            return `${window.location.protocol}//${window.location.hostname}/${path[1]}/${path[2]}`;
        }
        
        // Fallback per sviluppo locale
        return window.location.origin;
    }
    
    /**
     * Ottiene Form Digest Token per operazioni POST
     */
    async getFormDigest() {
        try {
            const response = await fetch(`${this.siteUrl}/_api/contextinfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json;odata=verbose'
                },
                credentials: 'same-origin'
            });
            
            const data = await response.json();
            return data.d.GetContextWebInformation.FormDigestValue;
        } catch (error) {
            console.error('Errore ottenimento Form Digest:', error);
            throw error;
        }
    }
    
    /**
     * Esegue chiamata REST API a SharePoint
     */
    async callSharePointAPI(endpoint, options = {}) {
        const url = `${this.siteUrl}/_api/${endpoint}`;
        
        const defaultHeaders = {
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose'
        };
        
        // Aggiungi Form Digest per POST/PUT/DELETE
        if (['POST', 'PUT', 'DELETE', 'MERGE'].includes(options.method)) {
            const digest = await this.getFormDigest();
            defaultHeaders['X-RequestDigest'] = digest;
        }
        
        // Se è DELETE o UPDATE, aggiungi headers specifici
        if (options.method === 'DELETE') {
            defaultHeaders['IF-MATCH'] = '*';
        }
        
        if (options.method === 'MERGE') {
            defaultHeaders['IF-MATCH'] = '*';
            defaultHeaders['X-HTTP-Method'] = 'MERGE';
            options.method = 'POST';
        }
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`SharePoint API Error: ${response.status} - ${errorText}`);
        }
        
        // Alcune richieste (DELETE) non hanno body
        if (response.status === 204) {
            return null;
        }
        
        return await response.json();
    }
    
    /**
     * Inizializza database SharePoint
     * Crea liste se non esistono
     */
    async initialize() {
        if (this.initialized) return;
        
        try {
            console.log('🔄 Inizializzazione SharePoint Database...');
            
            // Verifica/crea liste
            await this.ensureLists();
            
            // Inizializza dati default
            await this.initializeDefaultData();
            
            // Carica cache iniziale
            await this.refreshCache();
            
            // Avvia auto-refresh
            this.startAutoRefresh();
            
            this.initialized = true;
            console.log('✅ SharePoint Database inizializzato');
        } catch (error) {
            console.error('❌ Errore inizializzazione SharePoint:', error);
            // Fallback a LocalStorage
            console.warn('⚠️ Fallback a LocalStorage offline');
            this.useFallbackStorage();
        }
    }
    
    /**
     * Verifica esistenza liste, crea se necessario
     */
    async ensureLists() {
        const lists = await this.callSharePointAPI('web/lists?$select=Title');
        const existingLists = lists.d.results.map(l => l.Title);
        
        // Crea liste mancanti
        for (const [key, listName] of Object.entries(this.listNames)) {
            if (!existingLists.includes(listName)) {
                await this.createList(listName, key);
            }
        }
    }
    
    /**
     * Crea lista SharePoint con campi appropriati
     */
    async createList(listName, type) {
        console.log(`Creazione lista: ${listName}`);
        
        // Crea lista base
        const listData = {
            '__metadata': { 'type': 'SP.List' },
            'Title': listName,
            'BaseTemplate': 100, // Custom List
            'Description': `Database per ${type}`
        };
        
        await this.callSharePointAPI('web/lists', {
            method: 'POST',
            body: JSON.stringify(listData)
        });
        
        // Aggiungi campi specifici per tipo
        await this.addListFields(listName, type);
    }
    
    /**
     * Aggiunge campi custom alla lista
     */
    async addListFields(listName, type) {
        const fields = this.getFieldsForType(type);
        
        for (const field of fields) {
            try {
                await this.callSharePointAPI(`web/lists/getbytitle('${listName}')/fields`, {
                    method: 'POST',
                    body: JSON.stringify(field)
                });
            } catch (error) {
                console.warn(`Campo ${field.Title} già esistente o errore:`, error);
            }
        }
    }
    
    /**
     * Definisce campi per ogni tipo di lista
     */
    getFieldsForType(type) {
        const baseField = { '__metadata': { 'type': 'SP.Field' } };
        
        const schemas = {
            istruttori: [
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Nome' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Email' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'AreaId' }
            ],
            attivita: [
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Nome' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Colore' },
                { ...baseField, 'FieldTypeKind': 3, 'Title': 'GiorniLavorativi' }
            ],
            impegni: [
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'IstruttoreId' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'AttivitaId' },
                { ...baseField, 'FieldTypeKind': 4, 'Title': 'DataInizio' },
                { ...baseField, 'FieldTypeKind': 4, 'Title': 'DataFine' },
                { ...baseField, 'FieldTypeKind': 3, 'Title': 'GiorniLavorativi' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Numero' },
                { ...baseField, 'FieldTypeKind': 3, 'Title': 'Note' }
            ],
            aree: [
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Nome' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Colore' }
            ],
            festivi: [
                { ...baseField, 'FieldTypeKind': 4, 'Title': 'Data' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Nome' },
                { ...baseField, 'FieldTypeKind': 8, 'Title': 'IsCustom' }
            ],
            utenti: [
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Username' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'PasswordHash' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'Ruolo' },
                { ...baseField, 'FieldTypeKind': 2, 'Title': 'AreaId' }
            ]
        };
        
        return schemas[type] || [];
    }
    
    /**
     * Inizializza dati default (aree, utente admin, festività)
     */
    async initializeDefaultData() {
        // Verifica se già esistono dati
        const aree = await this.getItems('aree');
        if (aree.length === 0) {
            // Crea 4 aree default
            const defaultAree = [
                { nome: 'Scorta', colore: '#dc3545' },
                { nome: 'Condotta', colore: '#0d6efd' },
                { nome: 'Verifica', colore: '#198754' },
                { nome: 'Manovra', colore: '#ffc107' }
            ];
            
            for (const area of defaultAree) {
                await this.addArea(area.nome, area.colore);
            }
        }
        
        // Verifica utente admin
        const utenti = await this.getItems('utenti');
        if (utenti.length === 0) {
            await this.addUtente('admin', 'admin', 'admin', null);
        }
        
        // Inizializza festività italiane anno corrente
        const anno = new Date().getFullYear();
        const festivi = await this.getItems('festivi');
        if (festivi.length === 0) {
            await this.initializeFestiviItaliani(anno);
        }
    }
    
    /**
     * Refresh cache da SharePoint
     */
    async refreshCache() {
        try {
            const promises = Object.keys(this.cache).map(async (key) => {
                if (key !== 'lastRefresh') {
                    this.cache[key] = await this.getItems(key);
                }
            });
            
            await Promise.all(promises);
            this.cache.lastRefresh = new Date();
            
            // Notifica listeners
            if (window.onDatabaseRefresh) {
                window.onDatabaseRefresh();
            }
        } catch (error) {
            console.error('Errore refresh cache:', error);
        }
    }
    
    /**
     * Avvia auto-refresh periodico
     */
    startAutoRefresh() {
        if (this.autoRefreshEnabled) {
            setInterval(() => {
                this.refreshCache();
            }, this.refreshInterval);
        }
    }
    
    /**
     * Legge items da lista SharePoint
     */
    async getItems(type) {
        const listName = this.listNames[type];
        if (!listName) {
            console.error(`Tipo lista sconosciuto: ${type}`);
            return [];
        }
        
        try {
            const result = await this.callSharePointAPI(
                `web/lists/getbytitle('${listName}')/items?$top=5000`
            );
            
            return result.d.results.map(item => this.mapSharePointItem(item, type));
        } catch (error) {
            console.error(`Errore lettura ${type}:`, error);
            return this.cache[type] || [];
        }
    }
    
    /**
     * Mappa item SharePoint a oggetto applicazione
     */
    mapSharePointItem(spItem, type) {
        const base = {
            id: spItem.Id,
            created: spItem.Created,
            modified: spItem.Modified
        };
        
        const mappings = {
            istruttori: {
                nome: spItem.Nome,
                email: spItem.Email,
                areaId: spItem.AreaId
            },
            attivita: {
                nome: spItem.Nome,
                colore: spItem.Colore,
                giorniLavorativi: spItem.GiorniLavorativi
            },
            impegni: {
                istruttoreId: spItem.IstruttoreId,
                attivitaId: spItem.AttivitaId,
                dataInizio: spItem.DataInizio ? spItem.DataInizio.split('T')[0] : null,
                dataFine: spItem.DataFine ? spItem.DataFine.split('T')[0] : null,
                giorniLavorativi: spItem.GiorniLavorativi,
                numero: spItem.Numero,
                note: spItem.Note
            },
            aree: {
                nome: spItem.Nome,
                colore: spItem.Colore
            },
            festivi: {
                data: spItem.Data ? spItem.Data.split('T')[0] : null,
                nome: spItem.Nome,
                isCustom: spItem.IsCustom || false
            },
            utenti: {
                username: spItem.Username,
                passwordHash: spItem.PasswordHash,
                ruolo: spItem.Ruolo,
                areaId: spItem.AreaId
            }
        };
        
        return { ...base, ...mappings[type] };
    }
    
    /**
     * Crea item in lista SharePoint
     */
    async createItem(type, data) {
        const listName = this.listNames[type];
        
        const spData = {
            '__metadata': { 'type': `SP.Data.${listName}ListItem` },
            ...this.mapToSharePointFields(data, type)
        };
        
        try {
            const result = await this.callSharePointAPI(
                `web/lists/getbytitle('${listName}')/items`,
                {
                    method: 'POST',
                    body: JSON.stringify(spData)
                }
            );
            
            // Refresh cache
            await this.refreshCache();
            
            return result.d.Id;
        } catch (error) {
            console.error(`Errore creazione ${type}:`, error);
            throw error;
        }
    }
    
    /**
     * Aggiorna item in lista SharePoint
     */
    async updateItem(type, id, data) {
        const listName = this.listNames[type];
        
        const spData = {
            '__metadata': { 'type': `SP.Data.${listName}ListItem` },
            ...this.mapToSharePointFields(data, type)
        };
        
        try {
            await this.callSharePointAPI(
                `web/lists/getbytitle('${listName}')/items(${id})`,
                {
                    method: 'MERGE',
                    body: JSON.stringify(spData)
                }
            );
            
            // Refresh cache
            await this.refreshCache();
        } catch (error) {
            console.error(`Errore aggiornamento ${type}:`, error);
            throw error;
        }
    }
    
    /**
     * Elimina item da lista SharePoint
     */
    async deleteItem(type, id) {
        const listName = this.listNames[type];
        
        try {
            await this.callSharePointAPI(
                `web/lists/getbytitle('${listName}')/items(${id})`,
                { method: 'DELETE' }
            );
            
            // Refresh cache
            await this.refreshCache();
        } catch (error) {
            console.error(`Errore eliminazione ${type}:`, error);
            throw error;
        }
    }
    
    /**
     * Mappa dati applicazione a campi SharePoint
     */
    mapToSharePointFields(data, type) {
        const mappings = {
            istruttori: {
                'Nome': data.nome,
                'Email': data.email,
                'AreaId': data.areaId
            },
            attivita: {
                'Nome': data.nome,
                'Colore': data.colore,
                'GiorniLavorativi': data.giorniLavorativi
            },
            impegni: {
                'IstruttoreId': data.istruttoreId,
                'AttivitaId': data.attivitaId,
                'DataInizio': data.dataInizio,
                'DataFine': data.dataFine,
                'GiorniLavorativi': data.giorniLavorativi,
                'Numero': data.numero,
                'Note': data.note
            },
            aree: {
                'Nome': data.nome,
                'Colore': data.colore
            },
            festivi: {
                'Data': data.data,
                'Nome': data.nome,
                'IsCustom': data.isCustom
            },
            utenti: {
                'Username': data.username,
                'PasswordHash': data.passwordHash,
                'Ruolo': data.ruolo,
                'AreaId': data.areaId
            }
        };
        
        return mappings[type] || {};
    }
    
    // ============================================
    // API PUBBLICHE (compatibili con db-storage.js)
    // ============================================
    
    // ISTRUTTORI
    async getIstruttori() {
        return this.cache.istruttori || await this.getItems('istruttori');
    }
    
    async getIstruttore(id) {
        const istruttori = await this.getIstruttori();
        return istruttori.find(i => i.id == id);
    }
    
    async addIstruttore(nome, email, areaId) {
        return await this.createItem('istruttori', { nome, email, areaId });
    }
    
    async updateIstruttore(id, nome, email, areaId) {
        await this.updateItem('istruttori', id, { nome, email, areaId });
    }
    
    async deleteIstruttore(id) {
        await this.deleteItem('istruttori', id);
    }
    
    // ATTIVITÀ
    async getAttivita() {
        return this.cache.attivita || await this.getItems('attivita');
    }
    
    async addAttivita(nome, colore, giorniLavorativi) {
        return await this.createItem('attivita', { nome, colore, giorniLavorativi });
    }
    
    async deleteAttivita(id) {
        await this.deleteItem('attivita', id);
    }
    
    // IMPEGNI
    async getImpegni() {
        return this.cache.impegni || await this.getItems('impegni');
    }
    
    async addImpegno(istruttoreId, attivitaId, dataInizio, dataFine, giorniLavorativi, numero, note) {
        // Verifica sovrapposizioni
        const conflitti = await this.verificaSovrapposizione(istruttoreId, dataInizio, dataFine);
        
        if (conflitti.length > 0) {
            return {
                error: true,
                message: 'Sovrapposizione rilevata',
                conflitti: conflitti
            };
        }
        
        const id = await this.createItem('impegni', {
            istruttoreId,
            attivitaId,
            dataInizio,
            dataFine,
            giorniLavorativi,
            numero,
            note
        });
        
        return { error: false, id: id };
    }
    
    async deleteImpegno(id) {
        await this.deleteItem('impegni', id);
    }
    
    // AREE
    async getAree() {
        return this.cache.aree || await this.getItems('aree');
    }
    
    // ============================================
    // AUTENTICAZIONE (Compatibilità con db-storage)
    // ============================================
    
    isLoggedIn() {
        // Su SharePoint, autenticazione è gestita da Azure AD
        // Se siamo qui, siamo già autenticati
        if (this.offlineMode) {
            // In modalità offline, usa localStorage
            return localStorage.getItem('currentUser') !== null;
        }
        return true; // SharePoint = sempre autenticato
    }
    
    getCurrentUser() {
        if (this.offlineMode) {
            const userData = localStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        }
        // Su SharePoint, restituisci utente default
        return {
            username: 'admin',
            nome: 'Utente SharePoint',
            ruolo: 'Admin',
            area: null
        };
    }
    
    login(username, password) {
        // SharePoint usa Azure AD, non c'è login locale
        if (this.offlineMode) {
            // Modalità offline: fake login
            if (username === 'admin' && password === 'admin') {
                const user = {
                    username: 'admin',
                    nome: 'Admin Locale',
                    ruolo: 'Admin',
                    area: null
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, message: 'Credenziali non valide' };
        }
        // SharePoint: sempre autenticato
        return { success: true, user: this.getCurrentUser() };
    }
    
    logout() {
        if (this.offlineMode) {
            localStorage.removeItem('currentUser');
        }
        // SharePoint: non possiamo fare logout (gestito da Azure AD)
    }
    
    async addArea(nome, colore) {
        return await this.createItem('aree', { nome, colore });
    }
    
    // FESTIVITÀ
    async getFestivi(anno) {
        const festivi = this.cache.festivi || await this.getItems('festivi');
        const festiviItaliani = this.getFestiviItaliani(anno);
        return [...festiviItaliani, ...festivi.filter(f => f.isCustom)];
    }
    
    async addFestivoCustom(data, nome) {
        return await this.createItem('festivi', { data, nome, isCustom: true });
    }
    
    async deleteFestivoCustom(id) {
        await this.deleteItem('festivi', id);
    }
    
    getFestiviItaliani(anno) {
        const pasqua = this.calcolaPasqua(anno);
        const lunediAngelo = new Date(pasqua);
        lunediAngelo.setDate(lunediAngelo.getDate() + 1);
        
        return [
            { id: 'it1', data: `${anno}-01-01`, nome: 'Capodanno', isCustom: false },
            { id: 'it2', data: `${anno}-01-06`, nome: 'Epifania', isCustom: false },
            { id: 'it3', data: pasqua.toISOString().split('T')[0], nome: 'Pasqua', isCustom: false },
            { id: 'it4', data: lunediAngelo.toISOString().split('T')[0], nome: 'Lunedì dell\'Angelo', isCustom: false },
            { id: 'it5', data: `${anno}-04-25`, nome: 'Festa della Liberazione', isCustom: false },
            { id: 'it6', data: `${anno}-05-01`, nome: 'Festa del Lavoro', isCustom: false },
            { id: 'it7', data: `${anno}-06-02`, nome: 'Festa della Repubblica', isCustom: false },
            { id: 'it8', data: `${anno}-08-15`, nome: 'Ferragosto', isCustom: false },
            { id: 'it9', data: `${anno}-11-01`, nome: 'Tutti i Santi', isCustom: false },
            { id: 'it10', data: `${anno}-12-08`, nome: 'Immacolata Concezione', isCustom: false },
            { id: 'it11', data: `${anno}-12-25`, nome: 'Natale', isCustom: false },
            { id: 'it12', data: `${anno}-12-26`, nome: 'Santo Stefano', isCustom: false }
        ];
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
    
    // VERIFICA SOVRAPPOSIZIONI
    async verificaSovrapposizione(istruttoreId, dataInizio, dataFine, impegnoIdEscluso = null) {
        const impegni = await this.getImpegni();
        const conflitti = [];
        
        const start = new Date(dataInizio);
        const end = new Date(dataFine);
        
        for (const impegno of impegni) {
            if (impegno.id == impegnoIdEscluso) continue;
            if (impegno.istruttoreId != istruttoreId) continue;
            
            const impStart = new Date(impegno.dataInizio);
            const impEnd = new Date(impegno.dataFine);
            
            if (start <= impEnd && end >= impStart) {
                conflitti.push(impegno);
            }
        }
        
        return conflitti;
    }
    
    // UTENTI
    async getUtenti() {
        return this.cache.utenti || await this.getItems('utenti');
    }
    
    async addUtente(username, password, ruolo, areaId) {
        const passwordHash = btoa(password); // Simple hash, use bcrypt in production
        return await this.createItem('utenti', { username, passwordHash, ruolo, areaId });
    }
    
    async verificaLogin(username, password) {
        const utenti = await this.getUtenti();
        const passwordHash = btoa(password);
        return utenti.find(u => u.username === username && u.passwordHash === passwordHash);
    }
    
    // FESTIVITÀ ANNO
    async initializeFestiviItaliani(anno) {
        const festiviItaliani = this.getFestiviItaliani(anno);
        // Note: festività italiane sono calcolate al volo, non salvate
    }
    
    // FALLBACK LOCALSTORAGE
    useFallbackStorage() {
        console.warn('⚠️ Modalità OFFLINE - Usando LocalStorage');
        // Importa db-storage.js come fallback
        const script = document.createElement('script');
        script.src = 'static/js/db-storage.js';
        document.head.appendChild(script);
    }
}

// Istanza globale
const db = new SharePointDatabase();

// Auto-inizializza quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => db.initialize());
} else {
    db.initialize();
}

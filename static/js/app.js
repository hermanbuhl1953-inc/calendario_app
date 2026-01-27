// Calendario Istruttori - Custom JavaScript

// Utility functions
function formatData(dataStr) {
    if (!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function mostraMessaggio(tipo, messaggio) {
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[tipo] || 'alert-info';
    
    const alert = $(`
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${messaggio}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('main').prepend(alert);
    
    setTimeout(() => {
        alert.alert('close');
    }, 5000);
}

// Gestione loading
function mostraLoading() {
    if ($('#loadingOverlay').length === 0) {
        $('body').append(`
            <div id="loadingOverlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            ">
                <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `);
    }
}

function nascondiLoading() {
    $('#loadingOverlay').remove();
}

// Ajax setup globale
$.ajaxSetup({
    beforeSend: function() {
        mostraLoading();
    },
    complete: function() {
        nascondiLoading();
    },
    error: function(xhr, status, error) {
        console.error('Errore AJAX:', error);
        mostraMessaggio('error', 'Si è verificato un errore. Riprova.');
    }
});

// Inizializzazione
$(document).ready(function() {
    console.log('Calendario Istruttori caricato');
    
    // Tooltip Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    initDarkMode();
});

// Gestione Dark Mode
function initDarkMode() {
    const saved = localStorage.getItem('calendario-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const startDark = saved ? saved === 'dark' : prefersDark;
    applyDarkMode(startDark);
    $('#btnDarkMode').on('click', function() {
        applyDarkMode(!$('body').hasClass('dark-mode'));
    });
}

function applyDarkMode(enabled) {
    $('body').toggleClass('dark-mode', enabled);
    const btn = $('#btnDarkMode');
    if (enabled) {
        btn.removeClass('btn-outline-light').addClass('btn-light text-dark');
        btn.html('<i class="fas fa-sun"></i> Light Mode');
        localStorage.setItem('calendario-theme', 'dark');
    } else {
        btn.removeClass('btn-light text-dark').addClass('btn-outline-light');
        btn.html('<i class="fas fa-moon"></i> Dark Mode');
        localStorage.setItem('calendario-theme', 'light');
    }
}

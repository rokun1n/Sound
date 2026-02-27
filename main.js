// ── Navigation: mark active page ──────────────────
document.addEventListener('DOMContentLoaded', () => {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('href') === path) a.classList.add('active');
    });

    // Chips toggle
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => chip.classList.toggle('selected'));
    });

    // Range → live value
    document.querySelectorAll('input[type="range"]').forEach(r => {
        const display = r.parentElement.querySelector('.range-value');
        if (display) {
            display.textContent = r.value;
            r.addEventListener('input', () => display.textContent = r.value);
        }
    });
});

// ── Toast helper ──────────────────────────────────
function showToast(msg, icon = '✓') {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── History helpers ───────────────────────────────
function saveToHistory(track) {
    const history = JSON.parse(localStorage.getItem('sg_history') || '[]');
    history.unshift({ ...track, id: Date.now(), date: new Date().toLocaleDateString('uk-UA') });
    localStorage.setItem('sg_history', JSON.stringify(history.slice(0, 50)));
}
function getHistory() {
    return JSON.parse(localStorage.getItem('sg_history') || '[]');
}

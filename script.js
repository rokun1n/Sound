// ================================================
//  SoundMood — script.js
//  Практична робота №4: Основи JavaScript
// ================================================

// Застосовуємо збережену тему одразу, щоб не було миготіння
(function() {
    var saved = localStorage.getItem('soundmood-theme');
    if (saved && saved !== 'sakura') {
        document.documentElement.setAttribute('data-theme', saved);
    }
}());


// ------------------------------------------------
// 1. АКТИВНЕ МЕНЮ
//    Підсвічує пункт навігації поточної сторінки
// ------------------------------------------------

function markActiveNav() {
    // Отримуємо назву поточного файлу (наприклад "generator.html")
    var currentPage = window.location.pathname.split('/').pop();

    // Якщо сторінка порожня — це головна
    if (currentPage === '') {
        currentPage = 'index.html';
    }

    // Перебираємо всі посилання в навігації
    var navLinks = document.querySelectorAll('nav ul li a');
    for (var i = 0; i < navLinks.length; i++) {
        var link = navLinks[i];
        // Якщо href посилання збігається з поточною сторінкою
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('nav-active');
        }
    }
}


// ------------------------------------------------
// 2. КОНВЕРТОР BPM → НАСТРІЙ
//    На сторінці generator.html та settings.html:
//    при зміні BPM показує підказку про настрій
// ------------------------------------------------

function initBpmConverter() {
    var bpmInput = document.getElementById('bpm');
    if (!bpmInput) return; // якщо поля немає на сторінці — виходимо

    // Створюємо блок підказки
    var hint = document.createElement('p');
    hint.id = 'bpm-hint';
    hint.style.color = getCssVar('--color-accent');
    hint.style.fontWeight = 'bold';
    hint.style.marginTop = '6px';

    // Вставляємо підказку після поля BPM
    bpmInput.parentNode.insertBefore(hint, bpmInput.nextSibling);

    // Функція визначення настрою по BPM
    function getBpmMood(bpm) {
        bpm = parseInt(bpm);
        if (bpm < 60)  return '🧘 Дуже повільно — медитація, сон, релаксація';
        if (bpm < 80)  return '😌 Повільно — спокій, читання, концентрація';
        if (bpm < 100) return '😊 Помірно — Lo-Fi, Jazz, робоча атмосфера';
        if (bpm < 120) return '🎵 Жваво — Pop, легка електронна музика';
        if (bpm < 150) return '😤 Швидко — Rock, танці, тренування';
        return '⚡ Дуже швидко — Electronic, Dance, максимальна енергія';
    }

    // Оновлюємо підказку при зміні значення
    function updateHint() {
        hint.textContent = '💡 ' + getBpmMood(bpmInput.value);
    }

    // Вішаємо обробники подій на числове поле і слайдер
    bpmInput.addEventListener('input', updateHint);

    var bpmRange = document.querySelector('input[name="bpm_range"]');
    if (bpmRange) {
        bpmRange.addEventListener('input', function() {
            bpmInput.value = bpmRange.value; // синхронізуємо числове поле
            updateHint();
        });
    }

    updateHint(); // показуємо підказку одразу при завантаженні
}


// ------------------------------------------------
// 3. ЛІЧИЛЬНИК СИМВОЛІВ ДЛЯ TEXTAREA
//    Показує скільки символів введено
// ------------------------------------------------

function initCharCounter() {
    // Знаходимо всі textarea на сторінці
    var textareas = document.querySelectorAll('textarea');

    for (var i = 0; i < textareas.length; i++) {
        var textarea = textareas[i];
        var maxLen = textarea.getAttribute('maxlength') || 300;

        // Створюємо лічильник
        var counter = document.createElement('p');
        counter.style.fontSize = '0.8em';
        counter.style.color = '#888888';
        counter.style.margin = '4px 0 0 0';
        counter.textContent = '0 / ' + maxLen + ' символів';

        // Вставляємо лічильник після textarea
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);

        // Оновлюємо лічильник при введенні тексту
        // Використовуємо замикання (closure) щоб зберегти посилання
        (function(ta, cnt, max) {
            ta.addEventListener('input', function() {
                var len = ta.value.length;
                cnt.textContent = len + ' / ' + max + ' символів';
                // Червоний колір якщо більше 80% заповнено
                if (len > max * 0.8) {
                    cnt.style.color = '#cc4400';
                } else {
                    cnt.style.color = '#888888';
                }
            });
        })(textarea, counter, maxLen);
    }
}


// ------------------------------------------------
// 4. ВАЛІДАЦІЯ ФОРМИ ЗВОРОТНОГО ЗВ'ЯЗКУ
//    На сторінці about.html:
//    перевіряє поля перед відправкою
// ------------------------------------------------

function initContactFormValidation() {
    var form = document.querySelector('form[action="#"]');
    var nameInput = document.getElementById('contact-name');
    var emailInput = document.getElementById('contact-email');
    var msgInput = document.getElementById('contact-msg');

    // Якщо форми або полів немає — виходимо
    if (!form || !nameInput || !emailInput || !msgInput) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // зупиняємо стандартну відправку

        var errors = []; // масив помилок

        // Перевірка імені
        if (nameInput.value.trim() === '') {
            errors.push('Введіть ваше ім\'я');
        }

        // Перевірка email (простою регулярною формулою)
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value)) {
            errors.push('Введіть коректний email (наприклад: name@mail.com)');
        }

        // Перевірка повідомлення
        if (msgInput.value.trim().length < 10) {
            errors.push('Повідомлення має містити не менше 10 символів');
        }

        if (errors.length > 0) {
            // Є помилки — показуємо їх
            showPopup('❌ Помилка:\n\n' + errors.join('\n'), 'error');
        } else {
            // Все гаразд — показуємо успіх
            showPopup('✅ Повідомлення надіслано!\n\nДякуємо за зворотний зв\'язок. Ми відповімо вам найближчим часом.', 'success');
            form.reset(); // очищаємо форму
        }
    });
}


// ------------------------------------------------
// 5. ПІДТВЕРДЖЕННЯ ПРИ СКИДАННІ ФОРМИ
//    Питає "Ви впевнені?" при натисканні Reset
// ------------------------------------------------

function initResetConfirmation() {
    var resetButtons = document.querySelectorAll('button[type="reset"]');

    for (var i = 0; i < resetButtons.length; i++) {
        resetButtons[i].addEventListener('click', function(event) {
            // confirm() — вбудована JS функція, що показує вікно з OK/Скасувати
            var confirmed = confirm('Ви впевнені, що хочете скинути всі значення?');
            if (!confirmed) {
                event.preventDefault(); // скасовуємо скидання якщо натиснуто "Скасувати"
            }
        });
    }
}


// ------------------------------------------------
// 6. АНІМАЦІЯ ГЕНЕРАЦІЇ
//    На сторінці generator.html:
//    показує прогрес-бар при натисканні "Генерувати"
// ------------------------------------------------

function initGeneratorAnimation() {
    var form = document.querySelector('form[action="result.html"]');
    if (!form) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    // Створюємо блок прогресу
    var progressBlock = document.createElement('div');
    progressBlock.id = 'progress-block';
    progressBlock.style.display = 'none';  // прихований спочатку
    progressBlock.style.marginTop = '16px';
    progressBlock.style.padding = '16px';
    progressBlock.style.backgroundColor = getCssVar('--color-light-bg');
    progressBlock.style.borderRadius = '8px';
    progressBlock.style.border = '1px solid ' + getCssVar('--color-accent');

    var accent = getCssVar('--color-accent');
    var primary = getCssVar('--color-primary');
    progressBlock.innerHTML =
        '<p id="progress-status" style="font-weight:bold; color:' + primary + '; margin-bottom:10px;">🎵 Генерація...</p>' +
        '<div style="background:#dddddd; border-radius:99px; height:8px; overflow:hidden;">' +
        '<div id="progress-fill" style="height:100%; width:0%; background:' + accent + '; border-radius:99px; transition:width 0.4s;"></div>' +
        '</div>' +
        '<p id="progress-percent" style="font-size:0.85em; color:' + accent + '; margin-top:6px;">0%</p>';

    // Вставляємо блок після кнопки
    submitBtn.parentNode.insertBefore(progressBlock, submitBtn.nextSibling);

    // Кроки генерації
    var steps = [
        { text: '🔍 Аналіз параметрів...', pct: 20 },
        { text: '🏗️ Побудова структури...', pct: 45 },
        { text: '🎼 Генерація мелодії...', pct: 70 },
        { text: '🎸 Накладання інструментів...', pct: 90 },
        { text: '✅ Готово! Переходимо до результату...', pct: 100 },
    ];

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // зупиняємо миттєвий перехід

        submitBtn.disabled = true;        // блокуємо кнопку
        submitBtn.textContent = '⏳ Генерується...';
        progressBlock.style.display = 'block'; // показуємо прогрес

        var fill = document.getElementById('progress-fill');
        var status = document.getElementById('progress-status');
        var percent = document.getElementById('progress-percent');

        var step = 0;

        // Запускаємо кроки з затримками через setInterval
        var interval = setInterval(function() {
            if (step >= steps.length) {
                clearInterval(interval); // зупиняємо після останнього кроку
                // Переходимо на сторінку результату після паузи
                setTimeout(function() {
                    window.location.href = 'result.html';
                }, 700);
                return;
            }

            var current = steps[step];
            fill.style.width = current.pct + '%';
            status.textContent = current.text;
            percent.textContent = current.pct + '%';
            step++;
        }, 900); // кожен крок через 900 мс
    });
}


// ------------------------------------------------
// 7. TOAST-ПОВІДОМЛЕННЯ
//    Маленьке повідомлення знизу екрану
// ------------------------------------------------

function showToast(message) {
    // Видаляємо попередній toast якщо є
    var existing = document.getElementById('toast-msg');
    if (existing) {
        existing.remove();
    }

    // Створюємо новий toast
    var toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.textContent = message;
    toast.style.cssText =
        'position:fixed; bottom:24px; right:24px;' +
        'background:' + getCssVar('--color-primary') + '; color:#ffffff;' +
        'padding:12px 20px; border-radius:8px;' +
        'font-size:0.9em; z-index:9999;' +
        'box-shadow:0 4px 12px rgba(0,0,0,0.3);' +
        'transition:opacity 0.3s;';

    document.body.appendChild(toast);

    // Автоматично ховаємо через 3 секунди
    setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}


// ------------------------------------------------
// 8. СПЛИВАЮЧЕ ВІКНО (POPUP)
//    Власне модальне вікно замість alert()
// ------------------------------------------------

function showPopup(message, type) {
    // Видаляємо попередній popup
    var existing = document.getElementById('custom-popup');
    if (existing) existing.remove();

    var bgColor = type === 'error' ? '#fff4f0' : '#f0fff4';
    var borderColor = type === 'error' ? '#cc4400' : '#00aa66';
    var iconColor = type === 'error' ? '#cc4400' : '#00aa66';

    // Створюємо затемнення фону
    var overlay = document.createElement('div');
    overlay.id = 'custom-popup';
    overlay.style.cssText =
        'position:fixed; top:0; left:0; width:100%; height:100%;' +
        'background:rgba(0,0,0,0.5); z-index:9998;' +
        'display:flex; align-items:center; justify-content:center;';

    // Вікно повідомлення
    var box = document.createElement('div');
    box.style.cssText =
        'background:' + bgColor + '; border:2px solid ' + borderColor + ';' +
        'border-radius:12px; padding:28px 32px; max-width:400px; width:90%;' +
        'text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.2);';

    // Текст повідомлення (замінюємо \n на <br>)
    var msgHtml = message.replace(/\n/g, '<br>');
    box.innerHTML =
        '<p style="color:' + iconColor + '; font-weight:bold; font-size:1.1em; margin-bottom:16px;">' +
        msgHtml + '</p>' +
        '<button id="popup-close-btn" style="background:' + borderColor + '; color:#fff;' +
        'border:none; padding:9px 24px; border-radius:6px; cursor:pointer; font-size:0.95em;">OK</button>';

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Закриваємо при натисканні OK або на фон
    document.getElementById('popup-close-btn').addEventListener('click', function() {
        overlay.remove();
    });
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}


// ------------------------------------------------
// 9. TOAST-КНОПКИ НА СТОРІНЦІ RESULT
//    При натисканні кнопок "Поділитись", "Завантажити" тощо
// ------------------------------------------------

function initResultButtons() {
    // Знаходимо кнопки за текстом
    var buttons = document.querySelectorAll('button[type="button"]');

    for (var i = 0; i < buttons.length; i++) {
        (function(btn) {
            var text = btn.textContent.trim();

            if (text.indexOf('Поділитись') !== -1) {
                btn.addEventListener('click', function() {
                    showToast('🔗 Посилання скопійовано в буфер обміну!');
                });
            }
            if (text.indexOf('Завантажити') !== -1) {
                btn.addEventListener('click', function() {
                    showToast('⬇️ Завантаження розпочато...');
                });
            }
            if (text.indexOf('Зберегти') !== -1) {
                btn.addEventListener('click', function() {
                    showToast('💾 Трек збережено в Історію!');
                });
            }
            if (text.indexOf('Очистити') !== -1 || text.indexOf('🗑') !== -1) {
                btn.addEventListener('click', function() {
                    var ok = confirm('Ви впевнені? Цю дію не можна скасувати.');
                    if (ok) showToast('🗑️ Історію очищено.');
                });
            }
        })(buttons[i]);
    }
}




// ------------------------------------------------
// 11. ЛІЧИЛЬНИК СИМВОЛІВ ДЛЯ ПОЛЯ "НАЗВА ТРЕКУ"
//     Показує скільки символів залишилось
// ------------------------------------------------

function initTrackNameCounter() {
    var trackInput = document.getElementById('track_name');
    if (!trackInput) return;

    var maxLen = parseInt(trackInput.getAttribute('maxlength')) || 50;

    var counter = document.createElement('p');
    counter.style.cssText = 'font-size:0.8em; color:#888; margin:4px 0 0 0;';
    counter.textContent = 'Залишилось символів: ' + maxLen;

    trackInput.parentNode.insertBefore(counter, trackInput.nextSibling);

    trackInput.addEventListener('input', function() {
        var remaining = maxLen - trackInput.value.length;
        counter.textContent = 'Залишилось символів: ' + remaining;
        counter.style.color = remaining < 10 ? '#cc4400' : '#888888';
    });
}


// ------------------------------------------------
// 12. ОНЛАЙН КОНВЕРТОР ТЕМПУ
//     Перераховує BPM у секунди між ударами
// ------------------------------------------------

function initBpmToSecondsConverter() {
    // Додаємо конвертор тільки на сторінках з BPM
    var bpmInput = document.getElementById('bpm');
    if (!bpmInput) return;

    // Знаходимо контейнер поля BPM
    var fieldset = bpmInput.closest('fieldset');
    if (!fieldset) return;

    // Створюємо блок конвертора
    var converter = document.createElement('div');
    converter.style.cssText =
        'margin-top:12px; padding:10px 14px;' +
        'background:#f4f4f4; border-radius:6px;' +
        'font-size:0.875em; border:1px solid #dddddd;';
    converter.innerHTML =
        '<strong>🔢 Конвертор:</strong> ' +
        '<span id="bpm-seconds">—</span> секунд між ударами &nbsp;|&nbsp; ' +
        '<span id="bpm-ms">—</span> мс';

    fieldset.appendChild(converter);

    // Функція оновлення конвертора
    function updateConverter() {
        var bpm = parseFloat(bpmInput.value);
        if (!bpm || bpm <= 0) return;

        var seconds = (60 / bpm).toFixed(3); // секунд між ударами
        var ms = Math.round(60000 / bpm);     // мілісекунд між ударами

        document.getElementById('bpm-seconds').textContent = seconds;
        document.getElementById('bpm-ms').textContent = ms;
    }

    bpmInput.addEventListener('input', updateConverter);

    var bpmRange = document.querySelector('input[name="bpm_range"]');
    if (bpmRange) {
        bpmRange.addEventListener('input', updateConverter);
    }

    updateConverter(); // запускаємо одразу
}


// ------------------------------------------------
// 13. АДАПТИВНЕ БУРГЕР-МЕНЮ
//     На мобільних пристроях показує кнопку ☰
//     яка розкриває/закриває навігацію
// ------------------------------------------------

function initHamburgerMenu() {
    var nav = document.querySelector('header nav');
    if (!nav) return;

    var btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.setAttribute('aria-label', 'Відкрити меню');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('type', 'button');
    btn.innerHTML = '<span></span><span></span><span></span>';

    // Вставляємо кнопку перед nav у header
    nav.parentNode.insertBefore(btn, nav);

    function openMenu() {
        nav.classList.add('nav-open');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        nav.classList.remove('nav-open');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (nav.classList.contains('nav-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Закриваємо при кліку поза меню
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
            closeMenu();
        }
    });

    // Закриваємо при переході за посиланням
    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', closeMenu);
    }

    // Закриваємо при зміні розміру вікна на десктоп
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}


// ------------------------------------------------
// 14. ПЕРЕМИКАЧ РЕЖИМУ ЛОГО (SM ↔ SoundMood)
// ------------------------------------------------

function initLogoToggle() {
    var logo = document.querySelector('header h1');
    if (!logo) return;

    logo.innerHTML =
        '<span class="logo-emoji">🎵</span> ' +
        '<span class="logo-s">S</span>' +
        '<span class="logo-h lh1">o</span>' +
        '<span class="logo-h lh2">u</span>' +
        '<span class="logo-h lh3">n</span>' +
        '<span class="logo-h lh4">d</span>' +
        '<span class="logo-s">M</span>' +
        '<span class="logo-h lh5">o</span>' +
        '<span class="logo-h lh6">o</span>' +
        '<span class="logo-h lh7">d</span>';

    var compact = localStorage.getItem('soundmood-logo') === 'compact';
    if (compact) logo.classList.add('logo-compact');

    logo.addEventListener('click', function() {
            compact = !compact;
            logo.classList.toggle('logo-compact', compact);
            localStorage.setItem('soundmood-logo', compact ? 'compact' : 'expanded');
    });
}


// ------------------------------------------------
// 14. НОТКИ ТІКАЮТЬ ВІД КУРСОРА
//     CSS translate (окремо від transform-анімації) дозволяє
//     накладати зміщення поверх noteFloat без конфліктів
// ------------------------------------------------

function initHeroNotesCursor() {
    var banner = document.querySelector('.hero-banner');
    if (!banner) return;

    var notes = Array.prototype.slice.call(banner.querySelectorAll('.note'));
    var THRESHOLD = 130; // px — радіус реакції
    var FORCE     = 90;  // px — максимальне відштовхування

    banner.addEventListener('mousemove', function(e) {
        var mx = e.clientX;
        var my = e.clientY;

        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var r    = note.getBoundingClientRect();
            var nx   = r.left + r.width  * 0.5;
            var ny   = r.top  + r.height * 0.5;

            var dx   = nx - mx;
            var dy   = ny - my;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0 && dist < THRESHOLD) {
                var factor = (1 - dist / THRESHOLD);
                var px = ((dx / dist) * factor * FORCE).toFixed(1);
                var py = ((dy / dist) * factor * FORCE).toFixed(1);
                note.style.translate = px + 'px ' + py + 'px';
            } else {
                note.style.translate = '0px 0px';
            }
        }
    }, { passive: true });

    banner.addEventListener('mouseleave', function() {
        for (var i = 0; i < notes.length; i++) {
            notes[i].style.translate = '0px 0px';
        }
    }, { passive: true });
}


// ------------------------------------------------
// 14. ПАРАЛАКС БАНЕРА
//     Фон рухається повільніше за сторінку при скролі
// ------------------------------------------------

function initHeroParallax() {
    var bg = document.querySelector('.hero-parallax-bg');
    if (!bg) return;

    window.addEventListener('scroll', function() {
        bg.style.transform = 'translateY(' + (window.scrollY * 0.42) + 'px)';
    }, { passive: true });
}


// ------------------------------------------------
// 14. ПЕРЕМИКАЧ ТЕМ
//     Плаваюча кнопка з меню вибору теми
// ------------------------------------------------

var THEMES = [
    { id: 'sakura',   label: '🌸 Sakura',   desc: 'Ніжно-рожева',  swatch: '#d45fa0' },
    { id: 'classic',  label: '🔵 Classic',  desc: 'Класична синя', swatch: '#6c63ff' },
    { id: 'amber',    label: '🟠 Amber',    desc: 'Теплий янтар',  swatch: '#e07800' },
    { id: 'neon',     label: '💡 Neon',     desc: 'Електричний',   swatch: '#00bfff' },
    { id: 'ocean',    label: '🌊 Ocean',    desc: 'Морська бірюза', swatch: '#00a896' },
    { id: 'midnight', label: '🌙 Midnight', desc: 'Опівнічний',    swatch: '#9b5de5' },
];

function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function applyTheme(themeId) {
    if (themeId === 'sakura') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', themeId);
    }
    localStorage.setItem('soundmood-theme', themeId);
    updateThemeMenuState(themeId);
}

function updateThemeMenuState(activeId) {
    var options = document.querySelectorAll('.theme-option');
    for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        var isActive = opt.getAttribute('data-theme-id') === activeId;
        opt.classList.toggle('active', isActive);
        opt.querySelector('.theme-option-check').textContent = isActive ? '✓' : '';
    }
}

function initThemeSwitcher() {
    var saved = localStorage.getItem('soundmood-theme') || 'sakura';
    applyTheme(saved);

    // Обгортка
    var switcher = document.createElement('div');
    switcher.className = 'theme-switcher';

    // Головна кнопка
    var btn = document.createElement('button');
    btn.className = 'theme-toggle-btn';
    btn.innerHTML = '🎨 Тема сайту';
    btn.setAttribute('type', 'button');

    // Меню
    var menu = document.createElement('div');
    menu.className = 'theme-menu';
    menu.innerHTML = '<div class="theme-menu-title">Оберіть тему</div>';

    // Опції
    for (var i = 0; i < THEMES.length; i++) {
        (function(theme) {
            var opt = document.createElement('button');
            opt.className = 'theme-option';
            opt.setAttribute('type', 'button');
            opt.setAttribute('data-theme-id', theme.id);
            opt.innerHTML =
                '<span class="theme-swatch" style="background:' + theme.swatch + '"></span>' +
                '<span class="theme-option-name">' + theme.label + '<br>' +
                '<small style="color:#999;font-weight:normal">' + theme.desc + '</small></span>' +
                '<span class="theme-option-check"></span>';

            opt.addEventListener('click', function() {
                applyTheme(theme.id);
                menu.classList.remove('open');
            });

            menu.appendChild(opt);
        })(THEMES[i]);
    }

    // Відкриття/закриття меню
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('open');
    });

    document.addEventListener('click', function() {
        menu.classList.remove('open');
    });

    menu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    switcher.appendChild(menu);
    switcher.appendChild(btn);
    document.body.appendChild(switcher);

    updateThemeMenuState(saved);
}


// ================================================
// ЗАПУСК ВСІХ ФУНКЦІЙ ПІСЛЯ ЗАВАНТАЖЕННЯ СТОРІНКИ
// ================================================

// document.addEventListener('DOMContentLoaded') — чекаємо поки HTML завантажиться
document.addEventListener('DOMContentLoaded', function() {

    markActiveNav();             // 1. Активне меню
    initBpmConverter();          // 2. BPM → настрій
    initCharCounter();           // 3. Лічильник символів textarea
    initContactFormValidation(); // 4. Валідація форми
    initResetConfirmation();     // 5. Підтвердження скидання
    initGeneratorAnimation();    // 6. Анімація генерації
    initResultButtons();         // 9. Toast для кнопок result
    initTrackNameCounter();      // 11. Лічильник назви треку
    initBpmToSecondsConverter(); // 12. Конвертор BPM→секунди
    initHamburgerMenu();         // 13. Адаптивне бургер-меню
    initLogoToggle();            // 14. Перемикач режиму лого SM ↔ SoundMood
    initHeroNotesCursor();       // 15. Нотки тікають від курсора
    initHeroParallax();          // 16. Паралакс банера
    initThemeSwitcher();         // 17. Перемикач тем

});


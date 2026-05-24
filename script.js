// ================================================
//  SoundMood — script.js
//  Практична робота №4: Основи JavaScript
// ================================================


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
            link.style.backgroundColor = '#6c63ff'; // фіолетовий фон
            link.style.fontWeight = 'bold';          // жирний текст
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
    hint.style.color = '#6c63ff';
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
    progressBlock.style.backgroundColor = '#f0efff';
    progressBlock.style.borderRadius = '8px';
    progressBlock.style.border = '1px solid #6c63ff';

    progressBlock.innerHTML =
        '<p id="progress-status" style="font-weight:bold; color:#2c2c6c; margin-bottom:10px;">🎵 Генерація...</p>' +
        '<div style="background:#dddddd; border-radius:99px; height:8px; overflow:hidden;">' +
        '<div id="progress-fill" style="height:100%; width:0%; background:#6c63ff; border-radius:99px; transition:width 0.4s;"></div>' +
        '</div>' +
        '<p id="progress-percent" style="font-size:0.85em; color:#6c63ff; margin-top:6px;">0%</p>';

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
        'background:#2c2c6c; color:#ffffff;' +
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
// 10. ПАСХАЛКА
//     Подвійний клік на заголовок h1 — сюрприз!
// ------------------------------------------------

function initEasterEgg() {
    var logo = document.querySelector('header h1');
    if (!logo) return;

    logo.style.cursor = 'pointer';
    logo.title = 'Спробуй двічі клікнути...';

    logo.addEventListener('dblclick', function() {
        showPopup(
            '🎉 Ти знайшов пасхалку!\n\n' +
            'SoundMood створений з ❤️ у Вінниці.\n' +
            'Дякуємо що користуєшся нашим сервісом!\n\n' +
            '🎵 Музика — це мова душі.',
            'success'
        );
    });
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


// ================================================
// ЗАПУСК ВСІХ ФУНКЦІЙ ПІСЛЯ ЗАВАНТАЖЕННЯ СТОРІНКИ
// ================================================

// document.addEventListener('DOMContentLoaded') — чекаємо поки HTML завантажиться
document.addEventListener('DOMContentLoaded', function() {

    markActiveNav();           // 1. Активне меню
    initBpmConverter();        // 2. BPM → настрій
    initCharCounter();         // 3. Лічильник символів textarea
    initContactFormValidation(); // 4. Валідація форми
    initResetConfirmation();   // 5. Підтвердження скидання
    initGeneratorAnimation();  // 6. Анімація генерації
    initResultButtons();       // 9. Toast для кнопок result
    initEasterEgg();           // 10. Пасхалка
    initTrackNameCounter();    // 11. Лічильник назви треку
    initBpmToSecondsConverter(); // 12. Конвертор BPM→секунди

});

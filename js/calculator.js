/* ============================================================
   js/calculator.js
   Калькулятор стоимости проживания для rooms.html
   Работает со стилями из css/main.css и css/components/forms.css
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form          = document.getElementById('booking-calc');
    const checkInInput  = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const guestsInput   = document.getElementById('guests');
    const totalValue    = document.getElementById('calc-total-value');
    const totalHint     = document.getElementById('calc-total-hint');
    const roomRadios    = document.querySelectorAll('input[name="room-type"]');

    if (!form || !checkInInput || !checkOutInput || !totalValue) return;

    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const toISODate = (date) => {
        const tz = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tz).toISOString().split('T')[0];
    };

    const nightsBetween = (a, b) =>
        Math.round((new Date(b) - new Date(a)) / MS_PER_DAY);

    const formatPrice = (v) => v.toLocaleString('ru-RU') + ' ₽';

    const getSelectedRoom = () =>
        [...roomRadios].find(r => r.checked) || null;

    const setTotal = (value, hint) => {
        totalValue.textContent = value;
        if (totalHint) totalHint.textContent = hint;
    };

    const today = toISODate(new Date());
    checkInInput.min  = today;
    checkOutInput.min = today;

    function calculateTotal() {
        const checkIn  = checkInInput.value;
        const checkOut = checkOutInput.value;
        const room     = getSelectedRoom();

        if (!checkIn || !checkOut) {
            setTotal('—', 'Выберите даты пребывания — и здесь появится расчёт.');
            return;
        }

        const nights = nightsBetween(checkIn, checkOut);
        if (nights <= 0) {
            setTotal('—', '⚠️ Дата выезда должна быть позже даты заезда.');
            return;
        }

        if (!room) {
            setTotal('—', 'Выберите тип номера.');
            return;
        }

        const guests        = parseInt(guestsInput.value, 10) || 1;
        const pricePerNight = parseFloat(room.dataset.price) || 0;
        const total         = pricePerNight * nights;
        const roomName      = room.value;

        setTotal(
            formatPrice(total),
            `${nights} ноч. × ${formatPrice(pricePerNight)} · ${roomName} · гостей: ${guests}`
        );
    }

    checkInInput.addEventListener('change', () => {
        if (!checkInInput.value) return;
        const next = new Date(checkInInput.value);
        next.setDate(next.getDate() + 1);
        checkOutInput.min = toISODate(next);
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
            checkOutInput.value = toISODate(next);
        }
        calculateTotal();
    });

    checkOutInput.addEventListener('change', calculateTotal);
    guestsInput.addEventListener('input', calculateTotal);
    roomRadios.forEach(r => r.addEventListener('change', calculateTotal));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateTotal();
    });

    calculateTotal();
});document.addEventListener('DOMContentLoaded', () => {
    // --- Ссылки на элементы ---
    const form         = document.getElementById('booking-calc');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput= document.getElementById('check-out');
    const guestsInput  = document.getElementById('guests');
    const totalValue   = document.getElementById('calc-total-value');
    const totalHint    = document.getElementById('calc-total-hint');
    const roomRadios   = document.querySelectorAll('input[name="room-type"]');

    // Если калькулятора нет на странице — тихо выходим
    if (!form || !checkInInput || !checkOutInput || !totalValue) return;

    // --- Утилиты ---
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    /** Приводит дату к строке YYYY-MM-DD (для input[type="date"]) */
    const toISODate = (date) => {
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().split('T')[0];
    };

    /** Разница в ночах между двумя строками дат */
    const nightsBetween = (inStr, outStr) => {
        const dIn  = new Date(inStr);
        const dOut = new Date(outStr);
        return Math.round((dOut - dIn) / MS_PER_DAY);
    };

    /** Форматирование цены в рублях */
    const formatPrice = (value) =>
        value.toLocaleString('ru-RU') + ' ₽';

    /** Получить выбранный radio (тип номера) */
    const getSelectedRoom = () => {
        return [...roomRadios].find(r => r.checked) || null;
    };

    /** Показать сообщение в блоке итога */
    const setTotalMessage = (value, hint) => {
        totalValue.textContent = value;
        if (totalHint) totalHint.textContent = hint;
    };

    // --- Ограничения дат ---
    const today = toISODate(new Date());
    checkInInput.min  = today;
    checkOutInput.min = today;

    // --- Основная функция расчёта ---
    function calculateTotal() {
        const checkIn  = checkInInput.value;
        const checkOut = checkOutInput.value;
        const room     = getSelectedRoom();

        // 1. Не выбраны даты
        if (!checkIn || !checkOut) {
            setTotalMessage('—', 'Выберите даты пребывания — и здесь появится расчёт.');
            return;
        }

        // 2. Дата выезда не позже заезда
        const nights = nightsBetween(checkIn, checkOut);
        if (nights <= 0) {
            setTotalMessage('—', '⚠️ Дата выезда должна быть позже даты заезда.');
            return;
        }

        // 3. Не выбран тип номера
        if (!room) {
            setTotalMessage('—', 'Выберите тип номера.');
            return;
        }

        // 4. Гости (по ТЗ — просто валидация; можно расширить логику)
        const guests = parseInt(guestsInput.value, 10) || 1;

        // 5. Считаем
        const pricePerNight = parseFloat(room.dataset.price) || 0;
        const roomName      = room.value; // standard | comfort | lux
        const total         = pricePerNight * nights;

        // 6. Выводим
        setTotalMessage(
            formatPrice(total),
            `${nights} ноч. × ${formatPrice(pricePerNight)} · ${roomName} · гостей: ${guests}`
        );
    }

    // --- Автокоррекция даты выезда ---
    checkInInput.addEventListener('change', () => {
        if (!checkInInput.value) return;

        // Минимум для выезда — следующий день после заезда
        const nextDay = new Date(checkInInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = toISODate(nextDay);

        // Если выезд <= заезда — сдвигаем выезд на день вперёд
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
            checkOutInput.value = toISODate(nextDay);
        }

        calculateTotal();
    });

    // --- Реакция на изменения ---
    checkOutInput.addEventListener('change', calculateTotal);
    guestsInput.addEventListener('input',  calculateTotal);

    roomRadios.forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });

    // --- Пересчёт при отправке формы (защита от Enter) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateTotal();
    });

    // --- Первичный расчёт (если поля уже заполнены) ---
    calculateTotal();
});

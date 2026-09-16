/* ============================================================
   js/validation.js
   Логика маски телефона и валидации формы бронирования
   Автор: Шило Александр
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. МАСКА ТЕЛЕФОНА +7(XXX)-XXX-XX-XX ---
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', (e) => {
        // Оставляем только цифры
        let digits = e.target.value.replace(/\D/g, '');
        
        // Если первая цифра 7 или 8, убираем её (мы сами добавим +7)
        if (digits.startsWith('7') || digits.startsWith('8')) {
            digits = digits.substring(1);
        }
        
        // Ограничиваем длину 10 цифрами (после +7)
        digits = digits.substring(0, 10);

        // Собираем отформатированную строку
        let formatted = '+7';
        if (digits.length > 0) {
            formatted += '(' + digits.substring(0, 3);
        }
        if (digits.length >= 4) {
            formatted += ')-' + digits.substring(3, 6);
        }
        if (digits.length >= 7) {
            formatted += '-' + digits.substring(6, 8);
        }
        if (digits.length >= 9) {
            formatted += '-' + digits.substring(8, 10);
        }

        e.target.value = formatted;
    });

    // Разрешаем удалять символы (Backspace) корректно
    phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value.length <= 3) {
            e.target.value = '';
        }
    });


    // --- 2. ВАЛИДАЦИЯ ФОРМЫ ПРИ ОТПРАВКЕ ---
    const form = document.getElementById('booking-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Отменяем стандартную отправку

        let isValid = true;

        // Очищаем предыдущие ошибки
        clearErrors();

        // --- Проверка ФИО ---
        const fullname = document.getElementById('fullname');
        if (fullname.value.trim() === '') {
            showError(fullname, 'Пожалуйста, введите ФИО');
            isValid = false;
        }

        // --- Проверка Телефона (11 цифр) ---
        const phone = document.getElementById('phone');
        const phoneDigits = phone.value.replace(/\D/g, '');
        if (phoneDigits.length !== 11) {
            showError(phone, 'Телефон должен содержать 11 цифр');
            isValid = false;
        }

        // --- Проверка Email (Regex) ---
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Введите корректный Email');
            isValid = false;
        }

        // --- Проверка выбора номера ---
        const roomType = document.getElementById('room-type');
        if (roomType.value === '') {
            showError(roomType, 'Выберите категорию номера');
            isValid = false;
        }

        // --- Проверка Дат ---
        const checkIn = document.getElementById('check-in');
        const checkOut = document.getElementById('check-out');
        
        if (!checkIn.value) {
            showError(checkIn, 'Выберите дату заезда');
            isValid = false;
        }
        if (!checkOut.value) {
            showError(checkOut, 'Выберите дату выезда');
            isValid = false;
        }
        if (checkIn.value && checkOut.value && new Date(checkOut.value) <= new Date(checkIn.value)) {
            showError(checkOut, 'Дата выезда должна быть позже даты заезда');
            isValid = false;
        }

        // --- Проверка Чекбокса ---
        const agreement = document.getElementById('agreement');
        if (!agreement.checked) {
            showError(agreement, 'Необходимо согласие на обработку данных');
            isValid = false;
        }

        // --- Если всё верно ---
        if (isValid) {
            alert('Бронирование подтверждено!');
            form.reset(); // Очистить форму
            // Сброс маски телефона после reset
            document.getElementById('phone').value = ''; 
        }
    });


    // --- 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

    /**
     * Подсвечивает поле красным и выводит текст ошибки
     * @param {HTMLElement} input - элемент поля
     * @param {string} message - текст ошибки
     */
    function showError(input, message) {
        input.classList.add('error');
        
        // Находим span для ошибки. Он может быть как следующим sibling, так и внутри .form-group
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-message')) {
            // Если не нашли сразу после инпута, ищем внутри родителя
            const parent = input.closest('.form-group');
            if (parent) {
                errorSpan = parent.querySelector('.error-message');
            }
        }
        
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    /**
     * Очищает все ошибки на форме
     */
    function clearErrors() {
        // Убираем класс .error со всех полей
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Очищаем все сообщения об ошибках
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }
});

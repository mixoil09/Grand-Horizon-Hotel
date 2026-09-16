document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');

    // Маска телефона
    phoneInput.addEventListener('input', (e) => {
        let input = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        let formattedInput = '';

        if (input.length > 0) {
            if (input[0] === '7' || input[0] === '8') {
                input = input.substring(1); // Убираем первую 7 или 8, если введена
            }
            
            formattedInput = '+7';
            if (input.length > 0) formattedInput += '(' + input.substring(0, 3);
            if (input.length >= 4) formattedInput += ')-' + input.substring(3, 6);
            if (input.length >= 7) formattedInput += '-' + input.substring(6, 8);
            if (input.length >= 9) formattedInput += '-' + input.substring(8, 10);
        }
        
        e.target.value = formattedInput;
    });

    // Валидация формы при отправке
    const form = document.getElementById('booking-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Отменяем стандартную отправку формы
        let isValid = true;

        // Очищаем предыдущие ошибки
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // 1. Проверка ФИО
        const fullname = document.getElementById('fullname');
        if (fullname.value.trim() === '') {
            showError(fullname, 'Пожалуйста, введите ФИО');
            isValid = false;
        }

        // 2. Проверка телефона (11 цифр)
        const phone = document.getElementById('phone');
        const phoneDigits = phone.value.replace(/\D/g, '');
        if (phoneDigits.length !== 11) {
            showError(phone, 'Телефон должен содержать 11 цифр');
            isValid = false;
        }

        // 3. Проверка Email (Regex)
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Введите корректный Email');
            isValid = false;
        }

        // 4. Проверка дат
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

        // 5. Проверка чекбокса
        const agreement = document.getElementById('agreement');
        if (!agreement.checked) {
            showError(agreement, 'Необходимо согласие на обработку данных');
            isValid = false;
        }

        // Если всё верно
        if (isValid) {
            alert('Бронирование подтверждено!');
            form.reset(); // Очистить форму
        }
    });

    // Функция для подсветки ошибки
    function showError(inputElement, message) {
        inputElement.classList.add('error'); // Добавляем класс .error (стили от Олейникова)
        
        // Находим span для сообщения об ошибке рядом с полем
        const errorSpan = inputElement.closest('.form-group').querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }
});
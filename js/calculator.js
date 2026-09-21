
document.addEventListener('DOMContentLoaded', () => {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const roomTypeSelect = document.getElementById('roomType');
    const resultBlock = document.getElementById('result');
    const bookBtn = document.getElementById('bookBtn');

    const BASE_PRICE = 3000;
    let currentCalculation = null;

    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkOutInput.min = today;

    function calculateTotal() {
        const checkInValue = checkInInput.value;
        const checkOutValue = checkOutInput.value;
        const coefficient = parseFloat(roomTypeSelect.value);
        const roomName = roomTypeSelect.options[roomTypeSelect.selectedIndex].text.split(' (')[0];

        if (!checkInValue || !checkOutValue) {
            resultBlock.textContent = 'Выберите даты для расчёта';
            bookBtn.disabled = true;
            currentCalculation = null;
            return;
        }

        const dateIn = new Date(checkInValue);
        const dateOut = new Date(checkOutValue);

        if (dateOut <= dateIn) {
            resultBlock.innerHTML = '⚠️ Дата выезда должна быть позже заезда';
            bookBtn.disabled = true;
            currentCalculation = null;
            return;
        }

        const diffTime = Math.abs(dateOut - dateIn);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalCost = BASE_PRICE * nights * coefficient;

        resultBlock.innerHTML = `
            ${totalCost.toLocaleString('ru-RU')} ₽
            <small>${nights} ноч. × ${BASE_PRICE} ₽ × коэф. ${coefficient}</small>
        `;

        bookBtn.disabled = false;
        currentCalculation = {
            nights, totalCost, coefficient, roomName,
            checkIn: checkInValue, checkOut: checkOutValue
        };
    }

    checkInInput.addEventListener('input', () => {
        if (checkInInput.value) {
            const nextDay = new Date(checkInInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split('T')[0];
            if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
                checkOutInput.value = nextDay.toISOString().split('T')[0];
            }
        }
        calculateTotal();
    });

    checkOutInput.addEventListener('input', calculateTotal);
    roomTypeSelect.addEventListener('change', calculateTotal);

    bookBtn.addEventListener('click', () => {
        if (!currentCalculation) return;
        const { nights, totalCost, roomName, checkIn, checkOut } = currentCalculation;

        document.getElementById('modalDetails').innerHTML = `
            <div><span>Номер</span><span>${roomName}</span></div>
            <div><span>Заезд</span><span>${formatDate(checkIn)}</span></div>
            <div><span>Выезд</span><span>${formatDate(checkOut)}</span></div>
            <div><span>Ночей</span><span>${nights}</span></div>
            <div><span>Итого</span><span>${totalCost.toLocaleString('ru-RU')} ₽</span></div>
        `;

        document.getElementById('modal').classList.add('active');
    });
});

function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    showToast('Спасибо за бронирование! 🎉');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function selectRoom(coefficient, roomName) {
    const roomSelect = document.getElementById('roomType');
    roomSelect.value = coefficient;

    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    if (!checkIn.value) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        checkIn.value = today.toISOString().split('T')[0];
        checkOut.value = tomorrow.toISOString().split('T')[0];
        checkOut.min = tomorrow.toISOString().split('T')[0];
    }

    checkIn.dispatchEvent(new Event('input'));
    scrollToId('booking');
    showToast(`Выбран номер: ${roomName}`);
}

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

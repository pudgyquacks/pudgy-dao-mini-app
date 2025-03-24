// Инициализация Telegram Web App
window.Telegram.WebApp.ready();

// Получаем данные пользователя из Telegram
const user = Telegram.WebApp.initDataUnsafe.user;
const userId = user ? user.id : null;

// Таймер (10 дней с текущего момента)
const endDate = new Date("2025-04-03T00:00:00"); // Укажи дату окончания
function updateTimer() {
    const now = new Date();
    const timeLeft = endDate - now;
    if (timeLeft <= 0) {
        document.getElementById("timer").innerText = "Голосование завершено!";
        disableVoting();
        return;
    }
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("timer").innerText = `Осталось ${days} дней, ${hours} часов`;
}
setInterval(updateTimer, 1000);

// Проверка, голосовал ли пользователь
let hasVoted = localStorage.getItem(`voted_${userId}`) === "true";
if (hasVoted) {
    disableVoting();
    document.getElementById("status").innerText = "Ты уже проголосовал!";
}

// Голосование
document.querySelectorAll(".vote-btn").forEach((button) => {
    button.addEventListener("click", () => {
        if (!userId) {
            Telegram.WebApp.showAlert("Ошибка: Telegram ID не найден!");
            return;
        }
        if (hasVoted) {
            Telegram.WebApp.showAlert("Ты уже проголосовал!");
            return;
        }
        const style = button.getAttribute("data-style");
        Telegram.WebApp.showAlert(`Ты проголосовал за ${style}!`);
        hasVoted = true;
        localStorage.setItem(`voted_${userId}`, "true"); // Сохраняем локально
        disableVoting();
        document.getElementById("status").innerText = "Твой голос учтен!";
        // Здесь можно отправить голос на сервер (см. ниже)
    });
});

// Активация/деактивация кнопок голосования
function toggleVotingButtons(enabled) {
    const buttons = document.querySelectorAll(".vote-btn");
    buttons.forEach((btn) => (btn.disabled = !enabled));
}

function disableVoting() {
    toggleVotingButtons(false);
}

// Изначально отключаем кнопки, если пользователь уже голосовал
if (hasVoted) toggleVotingButtons(false);
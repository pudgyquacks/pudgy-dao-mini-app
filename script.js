window.Telegram.WebApp.ready();
const user = Telegram.WebApp.initDataUnsafe.user;
const userId = user ? user.id : null;

// Инициализация голосов в localStorage
const votes = JSON.parse(localStorage.getItem("votes")) || {
    Cyberpunk: 0,
    Anime: 0,
    Retro: 0
};

// Таймер
const endDate = new Date("2025-04-03T00:00:00");
let votingEnded = false;

function updateTimer() {
    const now = new Date();
    const timeLeft = endDate - now;
    if (timeLeft <= 0) {
        document.getElementById("timer").innerText = "Voting has ended!";
        votingEnded = true;
        disableVoting();
        showResults();
        document.getElementById("vote-prompt").style.display = "none";
        return;
    }
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("timer").innerText = `${days} days, ${hours} hours remaining`;
}
setInterval(updateTimer, 1000);

// Проверка, голосовал ли пользователь
let hasVoted = localStorage.getItem(`voted_${userId}`) === "true";
if (hasVoted) {
    disableVoting();
    document.getElementById("status").innerText = "Thank you for your vote!";
}
if (new Date() > endDate) {
    votingEnded = true;
    disableVoting();
    showResults();
    document.getElementById("vote-prompt").style.display = "none";
}

// Отображение результатов
function showResults() {
    document.getElementById("cyberpunk-result").innerText = `Cyberpunk: ${votes.Cyberpunk} votes`;
    document.getElementById("anime-result").innerText = `Anime: ${votes.Anime} votes`;
    document.getElementById("retro-result").innerText = `Retro: ${votes.Retro} votes`;
    document.getElementById("results").style.display = "block";
}

// Голосование
document.querySelectorAll(".vote-btn").forEach((button) => {
    button.addEventListener("click", () => {
        if (!userId) {
            Telegram.WebApp.showAlert("Error: Telegram ID not found!");
            return;
        }
        if (hasVoted) {
            Telegram.WebApp.showAlert("You have already voted!");
            return;
        }
        if (votingEnded) {
            Telegram.WebApp.showAlert("Voting has ended!");
            return;
        }
        const style = button.getAttribute("data-style");
        Telegram.WebApp.showAlert(`You voted for ${style}!`);

        // Сохраняем голос
        votes[style]++;
        localStorage.setItem("votes", JSON.stringify(votes));

        hasVoted = true;
        localStorage.setItem(`voted_${userId}`, "true");
        disableVoting();
        document.getElementById("status").innerText = "Thank you for your vote!";
    });
});

function toggleVotingButtons(enabled) {
    const buttons = document.querySelectorAll(".vote-btn");
    buttons.forEach((btn) => (btn.disabled = !enabled));
}

function disableVoting() {
    toggleVotingButtons(false);
}

if (hasVoted || votingEnded) toggleVotingButtons(false);

const questions = [
    {
        question: "Türkiye'nin başkenti neresidir?",
        options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
        correctAnswer: 1 // Ankara
    },
    {
        question: "Dünya'nın en büyük okyanusu hangisidir?",
        options: ["Atlas Okyanusu", "Hint Okyanusu", "Pasifik Okyanusu", "Arktik Okyanusu"],
        correctAnswer: 2 // Pasifik Okyanusu
    },
    {
        question: "Birleşmiş Milletler'in merkezi hangi şehirde bulunmaktadır?",
        options: ["Washington D.C.", "Londra", "Paris", "New York"],
        correctAnswer: 3 // New York
    },
    {
        question: "Avustralya'nın başkenti neresidir?",
        options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        correctAnswer: 2 // Canberra
    },
    {
        question: "Dünya'nın en uzun nehri hangisidir?",
        options: ["Nil Nehri", "Amazon Nehri", "Mississippi Nehri", "Yangtze Nehri"],
        correctAnswer: 0 // Nil Nehri
    },
    {
        question: "Fransa'nın başkenti neresidir?",
        options: ["Lyon", "Paris", "Marsilya", "Toulouse"],
        correctAnswer: 1 // Paris
    },
    {
        question: "Dünyanın en büyük çölü hangisidir?",
        options: ["Gobi Çölü", "Sahara Çölü", "Kalahari Çölü", "Atacama Çölü"],
        correctAnswer: 1 // Sahara Çölü
    },
    {
        question: "Japonya'nın başkenti neresidir?",
        options: ["Kyoto", "Osaka", "Tokyo", "Sapporo"],
        correctAnswer: 2 // Tokyo
    },
    {
        question: "Amerika Birleşik Devletleri'nin başkenti neresidir?",
        options: ["Los Angeles", "New York", "Washington D.C.", "Chicago"],
        correctAnswer: 2 // Washington D.C.
    },
    {
        question: "İngiltere'nin başkenti neresidir?",
        options: ["Liverpool", "Manchester", "Londra", "Edinburgh"],
        correctAnswer: 2 // Londra
    }
];

let currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex')) || 0; // Soruyu kaydeden indeks
let score = parseInt(localStorage.getItem('score')) || 0; // Skor
let answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions')) || []; // Yanıtlanan sorular
let timer;
let timeLeft = 30; // Her soru için 30 saniye

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const timerElement = document.getElementById("timer");
const scoreText = document.getElementById("score-text");
const answerDetails = document.getElementById("answer-details");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

// Sayfa yüklendiğinde, eğer quiz devam ediyorsa doğrudan quiz ekranını aç
window.addEventListener('load', () => {
    if (currentQuestionIndex > 0) {
        startScreen.classList.add("hidden");
        quizScreen.classList.remove("hidden");
        showQuestion();
        // Timer başlatılmamalı, sadece quiz başladıysa başlatılacak
    }
});

// Quiz başlatma
startButton.addEventListener("click", startQuiz);

// Quiz bitirme ve tekrar başlatma
restartButton.addEventListener("click", restartQuiz);

// Quiz başlatma fonksiyonu
function startQuiz() {
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    currentQuestionIndex = 0; // Quiz sıfırlansın
    score = 0; // Skor sıfırlansın
    answeredQuestions = []; // Yanıtlar sıfırlansın
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    localStorage.setItem('score', score);
    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    showQuestion();
    startTimer(); // Timer'ı başlatıyoruz
}

// Soruyu gösterme
function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;

        // Seçenekleri gösterme
        optionsContainer.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.textContent = option;
            button.addEventListener("click", () => handleAnswer(index));
            optionsContainer.appendChild(button);
        });
    } else {
        // Quiz bitince sonuç ekranını göster
        showResult();
    }
}

// Cevap işleme
function handleAnswer(selectedIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
        score++;
    }

    // Yanıtı sakla
    answeredQuestions.push({ question: currentQuestion, selectedIndex, isCorrect });

    // Sonraki soruya geç
    currentQuestionIndex++;

    // LocalStorage'ı güncelle
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    localStorage.setItem('score', score);
    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));

    // Sonraki soruyu göster
    showQuestion();
}

// Timer başlatma
function startTimer() {
    timeLeft = 30; // Her yeni soru başladığında zaman sıfırlanmalı
    timerElement.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleAnswer(null); // Zaman bittiğinde da cevapları işleme
        }
    }, 1000);
}

// Quiz bitince sonucu göster
function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    // Sonuçları yazdır
    scoreText.textContent = `Toplam Puan: ${score} / ${questions.length}`;

    // Yanlış cevapları ve doğrularını göster
    let answerDetailsHtml = '';
    answeredQuestions.forEach(item => {
        answerDetailsHtml += `
            <div>
                <p><strong>Soru:</strong> ${item.question.question}</p>
                <p><strong>Cevabınız:</strong> ${item.question.options[item.selectedIndex]}</p>
                <p><strong>Doğru Cevap:</strong> ${item.question.options[item.question.correctAnswer]}</p>
            </div>
        `;
    });
    answerDetails.innerHTML = answerDetailsHtml;
}

// Quiz'i yeniden başlatma
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = [];
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
    localStorage.setItem('score', score);
    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
}

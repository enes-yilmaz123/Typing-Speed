// --- DİL SEÇENEKLERİ VE ÇEVİRİLER ---
const wordsEn = ["apple", "computer", "code", "student", "keyboard", "mouse", "screen", "project", "window", "game", "speed", "test", "coffee", "network", "system", "book", "chair", "desk", "egg", "fish", "home", "ice", "jump", "king", "lamp", "milk", "name", "open", "park", "queen", "rain", "sun", "tree"];
const wordsTr = ["elma", "bilgisayar", "kod", "öğrenci", "klavye", "fare", "ekran", "proje", "pencere", "oyun", "hız", "test", "kahve", "ağ", "sistem", "kitap", "sandalye", "masa", "yumurta", "balık", "ev", "buz", "zıpla", "kral", "lamba", "süt", "isim", "açık", "park", "kraliçe", "yağmur", "güneş", "ağaç"];

const uiTranslations = {
    "English": {
        "title": "Typing Speed Test",
        "subtitle": "Type the text below into the box:",
        "placeholder": "Start typing to begin...",
        "timeLeft": "TIME LEFT",
        "wpm": "WPM",
        "correctLetters": "Correct Letters",
        "wrongLetters": "Wrong Letters",
        "wrongWords": "Wrong Words",
        "restart": "↻ RESTART"
    },
    "Turkish": {
        "title": "Yazma Hızı Testi",
        "subtitle": "Aşağıdaki metni kutuya yazın:",
        "placeholder": "Başlamak için yazmaya başlayın...",
        "timeLeft": "KALAN SÜRE",
        "wpm": "DKS", // Dakika Başına Kelime
        "correctLetters": "Doğru Harfler",
        "wrongLetters": "Yanlış Harfler",
        "wrongWords": "Yanlış Kelimeler",
        "restart": "↻ YENİDEN BAŞLAT"
    }
};

let currentLang = "English";
let wordsList = wordsEn;

// Zaman olcumu icin degiskenler
let timeLeft = 60;
let timerInterval;
let isTestRunning = false;

let currentTargetWords = [];
let currentWordIndex = 0;
let totalCorrectWords = 0;
let totalCorrectLetters = 0;
let totalWrongWords = 0;
let totalWrongLetters = 0;
let lastWrongAttempt = "";

// Sayfa yüklendiğinde çalışacak kısım (F5 atıldığında burası devreye girer)
window.onload = function() {
    // Tarayıcı hafızasında kayıtlı bir dil var mı kontrol et, yoksa İngilizce başlat
    let savedLang = localStorage.getItem("preferredLang") || "English";
    changeLanguage(savedLang);
};

// --- DİL DEĞİŞTİRME İŞLEMİ ---
function changeLanguage(selectedLang) {
    currentLang = selectedLang;
    
    // Seçilen dili F5 atıldığında hatırlaması için tarayıcı hafızasına kaydet
    localStorage.setItem("preferredLang", selectedLang);
    
    // Butonun içindeki yazıyı değiştir
    let langBtn = document.getElementById("lang-btn");
    if(langBtn) langBtn.innerHTML = selectedLang + " ▾";
    
    // Menüyü kapat
    let langMenu = document.getElementById("language-menu");
    if(langMenu) langMenu.classList.remove("show-menu");

    // Kelime listesini değiştir
    if (selectedLang === 'English') {
        wordsList = wordsEn;
    } else if (selectedLang === 'Turkish') {
        wordsList = wordsTr;
    }

    // Arayüz metinlerini çevir
    let t = uiTranslations[selectedLang];
    document.querySelector(".game-title-text").innerText = t.title;
    document.querySelector(".game-subtitle-text").innerText = t.subtitle;
    document.getElementById("user-input").placeholder = t.placeholder;
    document.querySelector(".timer-label").innerText = t.timeLeft;
    
    // İstatistik kutularının başlıklarını çevir
    let statBoxes = document.querySelectorAll(".stat-box span");
    if(statBoxes.length >= 4) {
        statBoxes[0].innerText = t.wpm;
        statBoxes[1].innerText = t.correctLetters;
        statBoxes[2].innerText = t.wrongLetters;
        statBoxes[3].innerText = t.wrongWords;
    }

    // Dil değiştiğinde oyunu yeni dilde sıfırla ve baştan başlat
    restartGame();
}

// Menüleri açma/kapama fonksiyonu
function toggleMenu(menuId) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.id !== menuId && openDropdown.classList.contains('show-menu')) {
            openDropdown.classList.remove('show-menu');
        }
    }
    document.getElementById(menuId).classList.toggle("show-menu");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show-menu')) {
                openDropdown.classList.remove('show-menu');
            }
        }
    }
}

// Listeden rastgele kelime secip html div icine ekleyen fonksiyon
function generateRandomWords() {
    let targetDiv = document.getElementById("target-text");
    if (!targetDiv) return;

    currentTargetWords = [];
    currentWordIndex = 0;
    targetDiv.innerHTML = "";

    // 10 rastgele kelime secelim
    for (let i = 0; i < 10; i++) {
        let randomIndex = Math.floor(Math.random() * wordsList.length);
        currentTargetWords.push(wordsList[randomIndex]);
    }

    for (let i = 0; i < currentTargetWords.length; i++) {
        let wordSpan = document.createElement("span");
        wordSpan.className = "target-word";

        for (let j = 0; j < currentTargetWords[i].length; j++) {
            let charSpan = document.createElement("span");
            charSpan.className = "target-char";
            charSpan.textContent = currentTargetWords[i][j];
            wordSpan.appendChild(charSpan);
        }

        targetDiv.appendChild(wordSpan);
    }

    updateTargetWordStyles();
}

function prepareTest() {
    let timeDisplay = document.getElementById("time");
    let userInput = document.getElementById("user-input");

    isTestRunning = false;
    timeLeft = 60;
    currentWordIndex = 0;
    totalCorrectWords = 0;
    totalCorrectLetters = 0;
    totalWrongLetters = 0;
    totalWrongWords = 0;
    lastWrongAttempt = "";

    if (timerInterval) clearInterval(timerInterval);
    if (timeDisplay) timeDisplay.innerText = timeLeft;

    updateTargetWordStyles();

    if (userInput) {
        userInput.value = "";
        userInput.disabled = false;
        userInput.oninput = handleTyping;
        userInput.onkeydown = handleKeyDown;
        userInput.focus();
    }

    updateStats();
}

function startTimer() {
    if (isTestRunning) {
        return;
    }

    isTestRunning = true;

    let timeDisplay = document.getElementById("time");
    let userInput = document.getElementById("user-input");

    updateStats();

    timerInterval = setInterval(function() {
        timeLeft--;

        if (timeDisplay) timeDisplay.innerText = timeLeft;
        updateStats();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isTestRunning = false;

            if (userInput) {
                userInput.blur();
                userInput.disabled = true; // Süre bitince klavyeyi kilitliyoruz
                userInput.value = "";      // Kutunun içindeki yarım kalan yazıyı siliyoruz
            }

            // Ekrandaki kelimeleri sil ve yerine dille uyumlu RESTART butonu koy
            let targetDiv = document.getElementById("target-text");
            if (targetDiv) {
                targetDiv.style.textAlign = "center"; // Butonu tam ortaya hizala
                let restartText = uiTranslations[currentLang].restart;
                targetDiv.innerHTML = `<button class="restart-button" onclick="restartGame()">${restartText}</button>`; 
            }

        }
    }, 1000);
}

function handleTyping() {
    let userInput = document.getElementById("user-input");
    if (!userInput) return;

    if (!isTestRunning && userInput.value.length > 0) {
        startTimer();
    }

    if (/\s/.test(userInput.value)) {
        submitCurrentWord();
        return;
    }

    updateCurrentWordFeedback();
    if (userInput.value.trim() !== lastWrongAttempt) {
        lastWrongAttempt = "";
    }
    updateStats();
}

function handleKeyDown(event) {
    if (event.key !== " " && event.key !== "Enter") {
        return;
    }

    event.preventDefault();
    submitCurrentWord();
}

function submitCurrentWord() {
    let userInput = document.getElementById("user-input");
    if (!userInput) return;

    let typedWord = userInput.value.trim();
    if (typedWord === "") {
        userInput.value = "";
        return;
    }

    if (!isTestRunning) {
        startTimer();
    }

    let currentWord = currentTargetWords[currentWordIndex];
    let currentSpan = getCurrentWordSpan();

    if (typedWord === currentWord) {
        totalCorrectWords++;
        totalCorrectLetters += typedWord.length;
        lastWrongAttempt = "";
        if (currentSpan) currentSpan.classList.add("completed-word");
    } else {
        if (typedWord !== lastWrongAttempt) {
            totalWrongWords++;
            lastWrongAttempt = typedWord;
        }
        if (currentSpan) currentSpan.classList.add("missed-word");
        
        let currentStats = getCurrentLetterStats();
        totalWrongLetters += currentStats.wrong;
    }

    currentWordIndex++;
    userInput.value = "";

    if (currentWordIndex >= currentTargetWords.length) {
        generateRandomWords();
    } else {
        updateTargetWordStyles();
    }

    updateStats();
}

function updateCurrentWordFeedback() {
    let userInput = document.getElementById("user-input");
    let currentSpan = getCurrentWordSpan();
    if (!userInput || !currentSpan) return;

    let typedWord = userInput.value;
    let currentWord = currentTargetWords[currentWordIndex];
    let charSpans = currentSpan.querySelectorAll(".target-char");

    for (let i = 0; i < charSpans.length; i++) {
        charSpans[i].classList.remove("correct", "incorrect");
    }

    if (typedWord === "") {
        return;
    }

    for (let i = 0; i < typedWord.length && i < charSpans.length; i++) {
        if (typedWord[i] === currentWord[i]) {
            charSpans[i].classList.add("correct");
        } else {
            charSpans[i].classList.add("incorrect");
        }
    }
}

function updateTargetWordStyles() {
    let wordSpans = document.querySelectorAll("#target-text .target-word");

    for (let i = 0; i < wordSpans.length; i++) {
        wordSpans[i].classList.remove("current-word");

        if (i === currentWordIndex) {
            wordSpans[i].classList.add("current-word");
        }
    }
}

function getCurrentWordSpan() {
    return document.querySelectorAll("#target-text .target-word")[currentWordIndex];
}

function updateStats() {
    let userInput = document.getElementById("user-input");
    let wpmDisplay = document.getElementById("wpm");
    let correctLettersDisplay = document.getElementById("correct-letters");
    let wrongLettersDisplay = document.getElementById("wrong-letters");
    let wrongWordsDisplay = document.getElementById("wrong-words");

    let currentStats = getCurrentLetterStats();
    let elapsedSeconds = 60 - timeLeft;
    let wpm = elapsedSeconds > 0 ? Math.round(totalCorrectWords / (elapsedSeconds / 60)) : 0;

    if (wpmDisplay) wpmDisplay.innerText = wpm;
    if (correctLettersDisplay) correctLettersDisplay.innerText = totalCorrectLetters + currentStats.correct;
    if (wrongLettersDisplay) wrongLettersDisplay.innerText = totalWrongLetters + currentStats.wrong;
    if (wrongWordsDisplay) wrongWordsDisplay.innerText = totalWrongWords;
}

function getCurrentLetterStats() {
    let userInput = document.getElementById("user-input");
    let currentWord = currentTargetWords[currentWordIndex];
    let typedWord = userInput ? userInput.value : "";
    let correct = 0;
    let wrong = 0;

    if (!currentWord) {
        return { correct: 0, wrong: 0 };
    }

    for (let i = 0; i < typedWord.length; i++) {
        if (typedWord[i] === currentWord[i]) {
            correct++;
        } else {
            wrong++;
        }
    }

    return { correct: correct, wrong: wrong };
}

function restartGame() {
    let targetDiv = document.getElementById("target-text");
    if (targetDiv) {
        targetDiv.style.textAlign = "center"; // Kelimeler artık hep ortada kalacak
    }
    generateRandomWords();
    prepareTest();
}
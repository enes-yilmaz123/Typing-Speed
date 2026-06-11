// --- DİL SEÇENEKLERİ, ÇEVİRİLER VE KELİME HAVUZLARI ---

const wordsEnNormal = ["apple", "computer", "code", "student", "keyboard", "mouse", "screen", "project", "window", "game", "speed", "test", "coffee", "network", "system", "book", "chair", "desk", "egg", "fish"];
const wordsTrNormal = ["elma", "bilgisayar", "kod", "öğrenci", "klavye", "fare", "ekran", "proje", "pencere", "oyun", "hız", "test", "kahve", "ağ", "sistem", "kitap", "sandalye", "masa", "yumurta", "balık"];

const wordsEnHard = ["experience", "government", "understand", "difference", "management", "technology", "information", "university", "particular", "development", "population", "production", "performance", "environment", "traditional"];
const wordsTrHard = ["araştırmacı", "sürdürülebilir", "gerçekleştirme", "değerlendirme", "koordinasyon", "kütüphane", "laboratuvar", "uluslararası", "mühendislik", "üniversite", "organizasyon", "sorumluluk", "memnuniyet", "bağımsızlık", "vazgeçilmez"];

const wordsEnExtreme = ["Hello!", "It's", "Wait,", "U.S.A.", "Wi-Fi", "100%", "O'clock", "Code;", "A.I.", "Yes/No", "X-Ray", "Top-tier", "#1", "$100", "Why?", "C++", "T-Shirt", "Don't", "Stop.", "Well-done"];
const wordsTrExtreme = ["Merhaba!", "Türkiye'de", "Bekle,", "A.B.D.", "Wi-Fi", "%100", "Saat'te", "Kod;", "Yapay-Zeka", "Evet/Hayır", "Röntgen", "Üst-düzey", "#1", "100₺", "Neden?", "C++", "T-Shirt", "Yapma!", "Dur.", "E-Posta"];

const uiTranslations = {
    "English": {
        "langLabel": "Language",
        "title": "Typing Speed Test",
        "subtitle": "Type the text below into the box:",
        "placeholder": "Start typing to begin...",
        "timeLeft": "TIME LEFT",
        "wpm": "WPM",
        "correctLetters": "Correct Letters",
        "wrongLetters": "Wrong Letters",
        "wrongWords": "Wrong Words",
        "restart": "↻ RESTART",
        "difficultyLabel": "Difficulty",
        "diffNormal": "Normal",
        "diffHard": "Hard",
        "diffExtreme": "Extreme",
        "fontLabel": "Font",
        "soundLabel": "Sound",
        "soundOff": "Off",
        "sound1": "Sound 1",
        "sound2": "Sound 2",
        "sound3": "Sound 3",
        "lastGameTitle": "Last Game",
        "lgCorrect": "Correct Letters",
        "lgWrong": "Wrong Letters",
        "lgWrongWords": "Wrong Words",
        "bestWpmLabel": "Best WPM " // YENİ
    },
    "Turkish": {
        "langLabel": "Dil",
        "title": "Yazma Hızı Testi",
        "subtitle": "Aşağıdaki metni kutuya yazın:",
        "placeholder": "Başlamak için yazmaya başlayın...",
        "timeLeft": "KALAN SÜRE",
        "wpm": "DKS", 
        "correctLetters": "Doğru Harfler",
        "wrongLetters": "Yanlış Harfler",
        "wrongWords": "Yanlış Kelimeler",
        "restart": "↻ YENİDEN BAŞLAT",
        "difficultyLabel": "Zorluk",
        "diffNormal": "Normal",
        "diffHard": "Zor",
        "diffExtreme": "Ekstrem",
        "fontLabel": "Yazı Tipi",
        "soundLabel": "Klavye Sesi",
        "soundOff": "Kapalı",
        "sound1": "Klavye 1",
        "sound2": "Klavye 2",
        "sound3": "Klavye 3",
        "lastGameTitle": "Son Oyun",
        "lgCorrect": "Doğru Harfler",
        "lgWrong": "Yanlış Harfler",
        "lgWrongWords": "Yanlış Kelimeler",
        "bestWpmLabel": "En İyi DKS " // YENİ
    }
};

let currentLang = "English";
let currentDifficulty = "Normal";
let currentFont = "Courier New, monospace";
let currentSound = "Off"; 
let wordsList = wordsEnNormal;

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

window.onload = function() {
    let savedLang = localStorage.getItem("preferredLang") || "English";
    let savedDiff = localStorage.getItem("preferredDiff") || "Normal";
    let savedFont = localStorage.getItem("preferredFont") || "Courier New, monospace";
    let savedFontName = localStorage.getItem("preferredFontName") || "Courier";
    let savedSound = localStorage.getItem("preferredSound") || "Off";
    
    changeLanguage(savedLang);
    changeDifficulty(savedDiff);
    changeFont(savedFont, savedFontName);
    changeSound(savedSound);
    
    loadSoundsToRAM();
    updateLastGameUI(); 
    updateBestWpmUI(); // Sayfa açılırken rekoru da yükle
};

// --- SON OYUN VE REKOR İSTATİSTİKLERİNİ GETİRME ---
function updateLastGameUI() {
    let savedData = localStorage.getItem("lastGameStats");
    if (savedData) {
        let stats = JSON.parse(savedData);
        let lgWpm = document.getElementById("lg-wpm");
        let lgCorrect = document.getElementById("lg-correct");
        let lgWrong = document.getElementById("lg-wrong");
        let lgWrongWords = document.getElementById("lg-wrong-words");

        if(lgWpm) lgWpm.innerText = stats.wpm;
        if(lgCorrect) lgCorrect.innerText = stats.correct;
        if(lgWrong) lgWrong.innerText = stats.wrong;
        if(lgWrongWords) lgWrongWords.innerText = stats.wrongWords;
    }
}

function updateBestWpmUI() {
    let savedBest = localStorage.getItem("bestWpm") || "0";
    let bestWpmEl = document.getElementById("best-wpm-value");
    if (bestWpmEl) bestWpmEl.innerText = savedBest;
}

function updateWordsList() {
    if (currentLang === "English") {
        if (currentDifficulty === "Normal") wordsList = wordsEnNormal;
        else if (currentDifficulty === "Hard") wordsList = wordsEnHard;
        else if (currentDifficulty === "Extreme") wordsList = wordsEnExtreme;
    } else if (currentLang === "Turkish") {
        if (currentDifficulty === "Normal") wordsList = wordsTrNormal;
        else if (currentDifficulty === "Hard") wordsList = wordsTrHard;
        else if (currentDifficulty === "Extreme") wordsList = wordsTrExtreme;
    }
}

// --- KLAVYE SESİ ÜRETME (RAM BUFFER) ---
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let decodedSounds = {
    "Sound 1": null,
    "Sound 2": null,
    "Sound 3": null
};

async function loadSoundsToRAM() {
    const soundFiles = {
        "Sound 1": "klavye1.wav",
        "Sound 2": "klavye2.wav",
        "Sound 3": "klavye3.wav"
    };

    for (const [key, url] of Object.entries(soundFiles)) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            decodedSounds[key] = audioBuffer;
        } catch (err) {
            console.warn(url + " yüklenirken bir hata oluştu:", err);
        }
    }
}

function playKeystrokeSound() {
    if (currentSound === "Off") return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const buffer = decodedSounds[currentSound];
    
    if (buffer) {
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.4; 
        
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        source.start(0); 
    }
}

// --- SES DEĞİŞTİRME ---
function changeSound(soundType) {
    currentSound = soundType;
    localStorage.setItem("preferredSound", soundType);

    let t = uiTranslations[currentLang];
    let soundText = t.soundOff;
    
    if (currentSound === "Sound 1") soundText = t.sound1;
    else if (currentSound === "Sound 2") soundText = t.sound2;
    else if (currentSound === "Sound 3") soundText = t.sound3;

    let soundBtn = document.getElementById("sound-btn");
    if (soundBtn) soundBtn.innerHTML = soundText + " ▾";

    let soundMenu = document.getElementById("sound-menu");
    if (soundMenu) soundMenu.classList.remove("show-menu");
}

// --- FONT DEĞİŞTİRME ---
function changeFont(fontValue, fontName) {
    currentFont = fontValue;
    localStorage.setItem("preferredFont", fontValue);
    localStorage.setItem("preferredFontName", fontName);

    let fontBtn = document.getElementById("font-btn");
    if (fontBtn) fontBtn.innerHTML = fontName + " ▾";

    let fontMenu = document.getElementById("font-menu");
    if(fontMenu) fontMenu.classList.remove("show-menu");

    let targetText = document.getElementById("target-text");
    let userInput = document.getElementById("user-input");
    
    if (targetText) targetText.style.fontFamily = fontValue;
    if (userInput) userInput.style.fontFamily = fontValue;
}

// --- DİL DEĞİŞTİRME ---
function changeLanguage(selectedLang) {
    currentLang = selectedLang;
    localStorage.setItem("preferredLang", selectedLang);
    
    let langBtn = document.getElementById("lang-btn");
    if(langBtn) langBtn.innerHTML = selectedLang + " ▾";
    
    let langMenu = document.getElementById("language-menu");
    if(langMenu) langMenu.classList.remove("show-menu");

    let t = uiTranslations[selectedLang];
    
    let elementsToUpdate = {
        "language-label": t.langLabel,
        "font-label": t.fontLabel,
        "sound-label": t.soundLabel,
        "difficulty-label": t.difficultyLabel,
        "diff-normal": t.diffNormal,
        "diff-hard": t.diffHard,
        "diff-extreme": t.diffExtreme,
        "snd-off": t.soundOff,
        "snd-k1": t.sound1,
        "snd-k2": t.sound2,
        "snd-k3": t.sound3,
        "lg-title": t.lastGameTitle,
        "lg-correct-label": t.lgCorrect,
        "lg-wrong-label": t.lgWrong,
        "lg-wrong-words-label": t.lgWrongWords,
        "best-wpm-label": t.bestWpmLabel // YENİ ÇEVİRİ BAĞLANDI
    };

    for (let id in elementsToUpdate) {
        let el = document.getElementById(id);
        if (el) el.innerText = elementsToUpdate[id];
    }
    
    let titleEl = document.querySelector(".game-title-text");
    if (titleEl) titleEl.innerText = t.title;
    
    let subtitleEl = document.querySelector(".game-subtitle-text");
    if (subtitleEl) subtitleEl.innerText = t.subtitle;
    
    let inputEl = document.getElementById("user-input");
    if (inputEl) inputEl.placeholder = t.placeholder;
    
    let timerEl = document.querySelector(".timer-label");
    if (timerEl) timerEl.innerText = t.timeLeft;
    
    let statBoxes = document.querySelectorAll(".stat-box span");
    if(statBoxes.length >= 4) {
        statBoxes[0].innerText = t.wpm;
        statBoxes[1].innerText = t.correctLetters;
        statBoxes[2].innerText = t.wrongLetters;
        statBoxes[3].innerText = t.wrongWords;
    }

    let diffText = currentDifficulty === "Normal" ? t.diffNormal : (currentDifficulty === "Hard" ? t.diffHard : t.diffExtreme);
    let diffBtn = document.getElementById("diff-btn");
    if (diffBtn) diffBtn.innerHTML = diffText + " ▾";

    let soundText = t.soundOff;
    if (currentSound === "Sound 1") soundText = t.sound1;
    else if (currentSound === "Sound 2") soundText = t.sound2;
    else if (currentSound === "Sound 3") soundText = t.sound3;
    
    let soundBtn = document.getElementById("sound-btn");
    if (soundBtn) soundBtn.innerHTML = soundText + " ▾";

    updateWordsList();
    restartGame();
}

// --- ZORLUK DEĞİŞTİRME ---
function changeDifficulty(diff) {
    currentDifficulty = diff;
    localStorage.setItem("preferredDiff", diff);

    let t = uiTranslations[currentLang];
    let diffText = diff === "Normal" ? t.diffNormal : (currentDifficulty === "Hard" ? t.diffHard : t.diffExtreme);
    let diffBtn = document.getElementById("diff-btn");
    if (diffBtn) diffBtn.innerHTML = diffText + " ▾";

    let diffMenu = document.getElementById("difficulty-menu");
    if(diffMenu) diffMenu.classList.remove("show-menu");

    updateWordsList();
    restartGame();
}

// MENÜLERİ AÇMA/KAPAMA
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

function generateRandomWords() {
    let targetDiv = document.getElementById("target-text");
    if (!targetDiv) return;

    currentTargetWords = [];
    currentWordIndex = 0;
    targetDiv.innerHTML = "";

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

window.onload = function() {
    generateRandomWords();
    prepareTest();
    initProfileLogic();
};

// kullanici adini yerel hafizada saklayan ve degistiren fonksiyon
function initProfileLogic() {
    const headerActionBtn = document.getElementById("login-button"); // LOG IN / LOG OUT Butonu
    const profileTrigger = document.getElementById("profile-trigger");
    const profileModal = document.getElementById("profile-modal");
    const modalCancel = document.getElementById("modal-cancel");
    const modalSave = document.getElementById("modal-save");
    const usernameInput = document.getElementById("username-input");
    const profileAvatar = document.getElementById("profile-avatar");

    // Kullanıcının giriş yapıp yapmadığını kontrol et
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    let savedName = localStorage.getItem("gameUsername") || "Gamer";

    // Arayüzü hafızadaki verilere göre başlat
    if (profileAvatar) profileAvatar.textContent = savedName.charAt(0).toUpperCase();
    if (usernameInput) usernameInput.value = savedName;
    
    if (headerActionBtn) {
        if (isLoggedIn) {
            headerActionBtn.textContent = "LOG OUT";
            headerActionBtn.classList.add("logout-state");
        } else {
            headerActionBtn.textContent = "LOG IN";
            headerActionBtn.classList.remove("logout-state");
        }
    }

    if (!profileModal) return;

    // Header butonuna (LOG IN / LOG OUT) tıklama olayları
    if (headerActionBtn) {
        headerActionBtn.onclick = function(e) {
            e.stopPropagation(); 
            
            if (headerActionBtn.textContent === "LOG OUT") {
                // LOG OUT İŞLEMİ: Hafızayı temizle ve arayüzü sıfırla
                localStorage.removeItem("gameUsername");
                localStorage.removeItem("isLoggedIn");
                
                if (usernameInput) usernameInput.value = "Gamer";
                if (profileAvatar) profileAvatar.textContent = "G";
                
                headerActionBtn.textContent = "LOG IN";
                headerActionBtn.classList.remove("logout-state");
                profileModal.classList.remove("active"); // Eğer kutu açıksa kapat
            } else {
                // LOG IN İŞLEMİ: Sadece profil kutusunu aç
                profileModal.classList.toggle("active");
                if (profileModal.classList.contains("active") && usernameInput) {
                    usernameInput.focus();
                }
            }
        };
    }

    // Profil avatarına (G) tıklayınca isim değiştirmek için her zaman kutuyu aç
    if (profileAvatar) {
        profileAvatar.onclick = function(e) {
            e.stopPropagation();
            profileModal.classList.toggle("active");
            if (profileModal.classList.contains("active") && usernameInput) {
                usernameInput.focus();
            }
        };
    }

    if (modalCancel) {
        modalCancel.onclick = function() {
            profileModal.classList.remove("active");
            let reloadedName = localStorage.getItem("gameUsername") || "Gamer";
            if (usernameInput) usernameInput.value = reloadedName;
        };
    }

    if (modalSave) {
        modalSave.onclick = function() {
            let newName = usernameInput.value.trim();
            if (newName === "") {
                newName = "Gamer";
            }
            // İsmi kaydet ve login durumunu true yap
            localStorage.setItem("gameUsername", newName);
            localStorage.setItem("isLoggedIn", "true");
            
            if (profileAvatar) profileAvatar.textContent = newName.charAt(0).toUpperCase();
            
            // Kayıt başarılıysa header butonunu LOG OUT olarak değiştir
            if (headerActionBtn) {
                headerActionBtn.textContent = "LOG OUT";
                headerActionBtn.classList.add("logout-state");
            }
            
            profileModal.classList.remove("active");
        };
    }

    // Modal dışına veya bağımsız alanlara tıklandığında pencereyi kapatma
    window.addEventListener("click", function(event) {
        if (profileTrigger && !profileTrigger.contains(event.target) && headerActionBtn && !headerActionBtn.contains(event.target)) {
            profileModal.classList.remove("active");
        }
    });
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
    }
    updateStats();
}

function startTimer() {
    if (isTestRunning) return;
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
                userInput.disabled = true; 
                userInput.value = "";      
            }

            // SÜRE BİTTİĞİNDE VERİLERİ KAYDET
            let finalWpmText = document.getElementById("wpm").innerText;
            let finalCorrect = document.getElementById("correct-letters").innerText;
            let finalWrong = document.getElementById("wrong-letters").innerText;
            let finalWrongWords = document.getElementById("wrong-words").innerText;

            // Son oyunu kaydet
            let lastGameData = {
                wpm: finalWpmText,
                correct: finalCorrect,
                wrong: finalWrong,
                wrongWords: finalWrongWords
            };
            localStorage.setItem("lastGameStats", JSON.stringify(lastGameData));
            updateLastGameUI(); 

            // REKOR KONTROLÜ (Yeni WPM eskisinden büyükse kaydet)
            let finalWpmNum = parseInt(finalWpmText) || 0;
            let currentBestNum = parseInt(localStorage.getItem("bestWpm")) || 0;

            if (finalWpmNum > currentBestNum) {
                localStorage.setItem("bestWpm", finalWpmNum);
            }
            updateBestWpmUI(); // Arayüzde rekoru hemen güncelle!

            let targetDiv = document.getElementById("target-text");
            if (targetDiv) {
                targetDiv.style.textAlign = "center"; 
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
    const ignoredKeys = ["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape"];
    if (ignoredKeys.indexOf(event.key) === -1) {
        playKeystrokeSound();
    }

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

    if (!isTestRunning) startTimer();

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

    if (typedWord === "") return;

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

// WPM DÜNYA STANDARDI HESAPLAMASI
function updateStats() {
    let userInput = document.getElementById("user-input");
    let wpmDisplay = document.getElementById("wpm");
    let correctLettersDisplay = document.getElementById("correct-letters");
    let wrongLettersDisplay = document.getElementById("wrong-letters");
    let wrongWordsDisplay = document.getElementById("wrong-words");

    let currentStats = getCurrentLetterStats();
    let elapsedSeconds = 60 - timeLeft;
    
    let totalChars = totalCorrectLetters + currentStats.correct;
    
    let wpm = elapsedSeconds > 0 ? Math.round((totalChars / 5) / (elapsedSeconds / 60)) : 0;

    if (wpmDisplay) wpmDisplay.innerText = wpm;
    if (correctLettersDisplay) correctLettersDisplay.innerText = totalChars;
    if (wrongLettersDisplay) wrongLettersDisplay.innerText = totalWrongLetters + currentStats.wrong;
    if (wrongWordsDisplay) wrongWordsDisplay.innerText = totalWrongWords;
}

function getCurrentLetterStats() {
    let userInput = document.getElementById("user-input");
    let currentWord = currentTargetWords[currentWordIndex];
    let typedWord = userInput ? userInput.value : "";
    let correct = 0;
    let wrong = 0;

    if (!currentWord) return { correct: 0, wrong: 0 };

    for (let i = 0; i < typedWord.length; i++) {
        if (typedWord[i] === currentWord[i]) correct++;
        else wrong++;
    }

    return { correct: correct, wrong: wrong };
}

function restartGame() {
    let targetDiv = document.getElementById("target-text");
    if (targetDiv) {
        targetDiv.style.textAlign = "center"; 
    }
    generateRandomWords();
    prepareTest();
}
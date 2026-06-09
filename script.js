// Basit ingilizce kelimeler iceren bir liste
const wordsList = ["apple", "computer", "code", "student", "keyboard", "mouse", "screen", "project", "window", "game", "speed", "test", "coffee", "network", "system"];

// Zaman olcumu icin degiskenler
let timeLeft = 60;
let timerInterval;
let isTestRunning = false;

let currentTargetText = "";
let totalCorrectWords = 0;

// Listeden rastgele kelime secip html div icine ekleyen fonksiyon
function generateRandomWords() {
    let targetDiv = document.getElementById("target-text");
    if (!targetDiv) return;

    let chosenWords = [];

    // 10 rastgele kelime secelim
    for (let i = 0; i < 10; i++) {
        let randomIndex = Math.floor(Math.random() * wordsList.length);
        chosenWords.push(wordsList[randomIndex]);
    }

    currentTargetText = chosenWords.join(" ");
    targetDiv.innerHTML = "";

    // Her karakteri ayri span icine koyarak dogruluk rengini gosterelim
    for (let i = 0; i < currentTargetText.length; i++) {
        let charSpan = document.createElement("span");
        charSpan.textContent = currentTargetText[i];
        targetDiv.appendChild(charSpan);
    }
}

window.onload = function() {
    generateRandomWords();
    prepareTest();
};

function prepareTest() {
    let timeDisplay = document.getElementById("time");
    let userInput = document.getElementById("user-input");

    isTestRunning = false;
    timeLeft = 60;
    totalCorrectWords = 0;

    if (timerInterval) clearInterval(timerInterval);
    if (timeDisplay) timeDisplay.innerText = timeLeft;

    if (userInput) {
        userInput.value = "";
        userInput.disabled = false;
        userInput.oninput = handleTyping;
        userInput.focus();
    }
}

function startTimer() {
    if (isTestRunning) {
        return;
    }

    isTestRunning = true;

    let timeDisplay = document.getElementById("time");
    let userInput = document.getElementById("user-input");

    timerInterval = setInterval(function() {
        timeLeft--;

        if (timeDisplay) timeDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isTestRunning = false;

            if (userInput) {
                userInput.blur();
            }

            alert("Time is up! Game over. You typed " + totalCorrectWords + " words correctly!");
            generateRandomWords();
            prepareTest();
        }
    }, 1000);
}

function handleTyping() {
    let userInput = document.getElementById("user-input");
    if (!userInput) return;

    let typedText = userInput.value;

    if (!isTestRunning && typedText.length > 0) {
        startTimer();
    }

    let targetTextSpans = document.getElementById("target-text").querySelectorAll("span");

    for (let i = 0; i < targetTextSpans.length; i++) {
        let charSpan = targetTextSpans[i];
        let typedChar = typedText[i];

        if (typedChar == null) {
            charSpan.classList.remove("correct");
            charSpan.classList.remove("incorrect");
        } else if (typedChar === charSpan.textContent) {
            charSpan.classList.add("correct");
            charSpan.classList.remove("incorrect");
        } else {
            charSpan.classList.add("incorrect");
            charSpan.classList.remove("correct");
        }
    }

    if (typedText === currentTargetText) {
        totalCorrectWords += 10;
        userInput.value = "";
        generateRandomWords();
    }
}

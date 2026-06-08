// basit ingilizce kelimeler içeren bir liste
const wordsList = ["apple", "computer", "code", "student", "keyboard", "mouse", "screen", "project", "window", "game", "speed", "test", "coffee", "network", "system"];

// zaman ölçümü için değişkenler
let timeLeft = 60;
let timerInterval;
let isTestRunning = false; // testin başlamış olup olmadığını kontrol etmek için

// listeden rastgele kelime seçip html div içine ekleyen fonksiyon
function generateRandomWords() {
    let targetDiv = document.getElementById("target-text");
    if (!targetDiv) return; // Safety check

    let chosenWords = [];
    
    // 10 rastgele kelime seçelim
    for (let i = 0; i < 10; i++) {
        // 0 ile wordsList.length-1 arasında rastgele bir index seçelim
        let randomIndex = Math.floor(Math.random() * wordsList.length);
        
        // seçilen kelimeyi chosenWords listesine ekleyelim
        chosenWords.push(wordsList[randomIndex]);
    }
    
    // seçilen kelimeleri boşlukla birleştirip html div içine ekleyelim
    targetDiv.innerHTML = chosenWords.join(" ");
}

// program başladığında fonksiyonu çağır 
window.onload = function() {
    generateRandomWords();
};

let startButton = document.getElementById("start-button");
if (startButton)
{
    startButton.onclick = function() {
        if (isTestRunning) {
            return;
        }
        
        isTestRunning = true;
        timeLeft = 60; 
        
        let timeDisplay = document.getElementById("time");
        let userInput = document.getElementById("user-input");

        // Başlangıçta zaman göstergesini güncelleyelim
        if (timeDisplay) timeDisplay.innerText = timeLeft;
        
        if (userInput) {
            userInput.value = ""; // Kullanıcı girişini temizle
            userInput.focus();    // Kullanıcı giriş kutusuna odaklan
        }

        // Her saniye çalışacak bir timer başlatalım
        timerInterval = setInterval(function() {
            timeLeft--; // Zamanı 1 saniye azalt
            
            if (timeDisplay) timeDisplay.innerText = timeLeft;
            
            // Zaman bittiğinde timer'ı durduralım ve kullanıcıya oyun bitti mesajı gösterelim
            if (timeLeft <= 0) {
                clearInterval(timerInterval);  
                isTestRunning = false;
                
                if (userInput) userInput.blur();  
                
                alert("Time is up! Game over.");
            }
        }, 1000);
    };
}
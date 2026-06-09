// basit ingilizce kelimeler içeren bir liste
const wordsList = ["apple", "computer", "code", "student", "keyboard", "mouse", "screen", "project", "window", "game", "speed", "test", "coffee", "network", "system"];

// zaman ölçümü için değişkenler
let timeLeft = 60;
let timerInterval;
let isTestRunning = false; // testin başlamış olup olmadığını kontrol etmek için

let currentTargetText = ""; // ekrana yazılan kelimeleri tutmak için
let totalCorrectWords = 0;  // doğru yazılan kelime sayısını tutmak için

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
    // chosenWords listesindeki kelimeleri boşlukla birleştirip ekrana yazalım
    currentTargetText = chosenWords.join(" ");
    targetDiv.innerHTML = "";

    // her karakteri ayrı bir span içine koyarak ekleyelim, böylece doğruluk kontrolü yaparken renk değiştirebiliriz
    for (let i = 0; i < currentTargetText.length; i++) {
        let charSpan = document.createElement("span"); 
        charSpan.textContent = currentTargetText[i];     
        targetDiv.appendChild(charSpan);               
    }
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
        totalCorrectWords = 0; // doğru kelime sayısını sıfırla
        
        let timeDisplay = document.getElementById("time");
        let userInput = document.getElementById("user-input");

        // başlangıçta zaman göstergesini güncelleyelim
        if (timeDisplay) timeDisplay.innerText = timeLeft;
        
        if (userInput) {
            userInput.value = ""; 
            userInput.disabled = false;
            userInput.focus();    

            // kullanıcının yazdığı metni kontrol eden event listener
            userInput.oninput = function() {
                let typedText = userInput.value;

                let targetTextSpans = document.getElementById("target-text").querySelectorAll("span");

                for (let i = 0; i < targetTextSpans.length; i++) {
                    let charSpan = targetTextSpans[i];
                    let typedChar = typedText[i]; // Kullanıcının o sıradaki harfi

                    if (typedChar == null) {
                        // Eğer kullanıcı bu harfi sildiyse veya henüz yazmadıysa renkleri kaldır
                        charSpan.classList.remove("correct");
                        charSpan.classList.remove("incorrect");
                    } else if (typedChar === charSpan.textContent) {
                        // Eğer yazdığı harf ekrandaki ile aynıysa yeşil sınıfını ver
                        charSpan.classList.add("correct");
                        charSpan.classList.remove("incorrect");
                    } else {
                        // Harf yanlışsa kırmızı sınıfını ver
                        charSpan.classList.add("incorrect");
                        charSpan.classList.remove("correct");
                    }
                }
                // Tüm cümleyi eksiksiz ve doğru bitirdiyse yeni kelimeler getir
                if (typedText === currentTargetText) {
                    totalCorrectWords += 10; 
                    userInput.value = "";    
                    generateRandomWords();   
                }
            };
        }

        timerInterval = setInterval(function() {
            timeLeft--; 
            
            if (timeDisplay) timeDisplay.innerText = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);  
                isTestRunning = false;
                
                if (userInput) {
                    userInput.blur();
                    userInput.disabled = true;  
                    userInput.oninput = null; 
                }
                
                alert("Time is up! Game over. You typed " + totalCorrectWords + " words correctly!");
            }
        }, 1000);
    };
}
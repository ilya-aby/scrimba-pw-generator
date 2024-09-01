const characters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9","~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?",
"/"];
const wordList = []
const spacerChar = "-"

function generatePassword() {
    const passwordLength = parseInt(document.getElementById("length-slider").value);
    const isXkcdStyle = document.getElementById("xkcd-style").checked;
    let password = "";

    if (isXkcdStyle) {
        let remainingLength = passwordLength;
        while (remainingLength > 0) {
            // Candidate words must:
            // - Be no longer than remaining length
            // - Match remaining length exactly or leave enough space for at least one more word
            const suitableWords = wordList.filter(word => 
                word.length <= remainingLength && 
                (remainingLength - word.length >= 4 || remainingLength - word.length === 0)
            );

            // If no suitable words are found, break the loop to avoid infinite loop
            if (suitableWords.length === 0) {
                break;
            }

            const randomIndex = Math.floor(Math.random() * suitableWords.length);
            const randomWord = suitableWords[randomIndex];

            password += randomWord;
            remainingLength -= randomWord.length;

            // Add a spacer if there's still room left
            if (remainingLength > 0) {
                password += spacerChar;
                remainingLength--;
            }
        }
    } else {
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);  
            password += characters[randomIndex];
        }
    }

    // Animate the password generation
    const passwordElement = document.getElementById("password");
    passwordElement.textContent = password;
    passwordElement.classList.add('password-generated');
    setTimeout(() => passwordElement.classList.remove('password-generated'), 300);
}

function copyPassword() {
    const passwordElement = document.getElementById("password");
    const password = passwordElement.textContent;
    const copyButton = document.getElementById("copy-button");
    navigator.clipboard.writeText(password)
        .then(() => {
            copyButton.textContent = '✅';
            setTimeout(() => copyButton.textContent = '📋', 750);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

// Update slider value and generate password
function updateSlider() {
    const slider = document.getElementById("length-slider");
    const lengthValue = document.getElementById("length-value");
    lengthValue.textContent = slider.value;
    generatePassword();
}

// Populates wordlist for xkcd style password generation
function loadWordList() {
    return fetch('wordlists/1password-replacement.txt')
        .then(response => response.text())
        .then(text => {
            wordList.push(...text.split('\n'));
        })
        .catch(err => console.error('Failed to load word list:', err));
}

// Generate password on page load and set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadWordList().then(() => {
        const slider = document.getElementById("length-slider");
        const xkcdStyle = document.getElementById("xkcd-style");
        const classicStyle = document.getElementById("classic-style");
        
        slider.addEventListener('input', updateSlider);
        xkcdStyle.addEventListener('change', generatePassword);
        classicStyle.addEventListener('change', generatePassword);
        generatePassword();
    });
});
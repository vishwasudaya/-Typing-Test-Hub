
const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random'
const typing_text = document.querySelector('.text-of-typing p');
const inputField = document.querySelector('.container .input-field');
const errorTag = document.querySelector('.errors span');
const timeTag = document.querySelector('.time span');
const wpmTag = document.querySelector('.wpm span');
const cpmTag = document.querySelector('.cpm span');
const button = document.querySelector('button');

let characterIndex = 0;
let errors = 0;
let timer;
let maxTime = 60;
let timeLeft = maxTime;
let isTyping = 0;

function randomParagraph(){
    return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content);
}
async function getRandomQuote()
{    
    const quote = await randomParagraph();
    typing_text.innerHTML = "";

    quote.split("").forEach((span) => {
        let spanTag = `<span>${span}</span>`;
        typing_text.innerHTML += spanTag;
    });

    typing_text.querySelectorAll('span')[0].classList.add('active');

    document.addEventListener('keydown', () => inputField.focus());
    typing_text.addEventListener('click', () => inputField.focus());
}
getRandomQuote();

function initTyping(){
    const characters = typing_text.querySelectorAll('span');
    
    let typedCharacter = inputField.value.split("")[characterIndex];

    if(characterIndex < characters.length - 1 && timeLeft > 0){
        if(!isTyping){
            timer = setInterval(initTimer, 1000);
            isTyping = true;   
        }
    
        if(typedCharacter == null){//if user typed backspace
            characterIndex--;
    
            if(characters[characterIndex].classList.contains('incorrect')){
                errors--;
            }
    
            characters[characterIndex].classList.remove('correct', 'incorrect');
        }
        else{
            if(characters[characterIndex].innerText === typedCharacter){
                characters[characterIndex].classList.add('correct')
            }
            else{
                errors++
                characters[characterIndex].classList.add('incorrect')
            }
            characterIndex++;
        }
    
    
        characters.forEach(span => span.classList.remove('active'));
        characters[characterIndex].classList.add('active');
    
        errorTag.innerText = errors;
    
       // cpmTag.innerText = characterIndex - errors; //error solved
    cpmTag.innerText =  Math.round((characterIndex - errors)/(maxTime-timeLeft))*60;
        let wpm = Math.round((((characterIndex - errors) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;
    }
    else{
        inputField.value = "";
        clearInterval(timer);
    }
    
}

inputField.addEventListener('input', initTyping);

function initTimer(){
    if(timeLeft > 0){
        timeLeft--;
        timeTag.innerText = timeLeft;
    }else{
        clearInterval(timer);
    }
}

function resetGame(){
    getRandomQuote()
    inputField.value = "";
    clearInterval(timer);
    timeLeft = maxTime;
    characterIndex = 0;
    errors = 0;
    isTyping = 0;
    timeTag.innerText = timeLeft;
    errorTag.innerText = errors;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
}

button.addEventListener('click', resetGame);

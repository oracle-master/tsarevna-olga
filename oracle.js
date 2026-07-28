
/*
=====================================
        ЦАРЕВНА ОЛЬГА
        oracle.js

        Версия: только любовь и поддержка

=====================================
*/

const OracleState = Object.freeze({
    SLEEP: "sleep",
    LISTENING: "listening",
    THINKING: "thinking",
    PROPHECY: "prophecy"
});

let currentState = OracleState.SLEEP;

// ===============================
// NFC 2.0
// ===============================
let ndefReader = null;
let isScanning = false;
let scanCooldown = false;

async function startNFCListening(){
    if (!("NDEFReader" in window)){
        setStatus("Царевна дремлет");
        return;
    }
    if(isScanning) return;
    try{
        ndefReader = new NDEFReader();
        await ndefReader.scan();
        isScanning = true;
        setStatus("Царевна слушает...");
        ndefReader.onreading = () => {
            if(scanCooldown) return;
            scanCooldown = true;
            handleNFCTouch();
            setTimeout(()=>{ scanCooldown = false; }, 2000);
        };
        ndefReader.onreadingerror = ()=>{
            setStatus("Талисман не услышан...");
        };
    }catch(error){
        setStatus("Царевна дремлет");
        setTimeout(() => { startNFCListening(); }, 1000);
        console.log(error);
    }
}

function handleNFCTouch(){
    if(currentState === OracleState.SLEEP){
        wakePrincess();
        return;
    }
    if(currentState === OracleState.LISTENING){
        startThinking();
        return;
    }
}

// ===============================
// ТОЛЬКО ДОБРЫЕ ПРЕДСКАЗАНИЯ
// ===============================
const answers = [
"✨ Оленька, всё будет хорошо ✨",
"✨ Ты сильнее, чем думаешь ✨",
"✨ Этот день принесёт радость ✨",
"✨ Твоя улыбка лечит мир ✨",
"✨ Всё получится ✨",
"✨ Ты не одна, с тобой свет ✨",
"✨ Скоро ты будешь дома ✨",
"✨ Твоё сердце полно тепла ✨",
"✨ Каждый день — шаг к чуду ✨",
"✨ Ты — настоящее сокровище ✨",
"✨ Лёля, мир тебя любит ✨",
"✨ Впереди только хорошее ✨",
"✨ Твоя сила восхищает ✨",
"✨ Пусть будет легко и спокойно ✨",
"✨ Ты справишься со всем ✨",
"✨ Сегодня особенный день ✨",
"✨ Оля, ты — чудо ✨",
"✨ Все мечты сбудутся ✨",
"✨ Рядом с тобой ангелы ✨",
"✨ Ты — свет в этом мире ✨",
"✨ Здоровье возвращается ✨",
"✨ Ольга, верь в себя ✨",
"✨ Самое трудное позади ✨",
"✨ Ты — герой своей истории ✨"
];

function randomItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function getOracleAnswer(){
    return {
        text: randomItem(answers),
        type: "positive"
    };
}

function setText(text) {
    const answer = document.getElementById("answer-text");
    if (!answer) return;
    answer.style.opacity = "0";
    setTimeout(() => { answer.textContent = text; answer.style.opacity = "1"; }, 500);
}

function showFinalAnswer(data) {
    const answer = document.getElementById("answer-text");
    const mirror = document.getElementById("mirrorFrame");
    if (!answer) return;
    if (mirror) { mirror.classList.remove("positive-glow", "neutral-glow", "negative-glow"); }
    let color = "#FFD700";
    let glowClass = "positive-glow";
    if (mirror && glowClass) { mirror.classList.add(glowClass); }
    answer.style.opacity = "0";
    setTimeout(() => {
        answer.innerHTML = `<span style="color:${color};font-size:28px;">✨</span>${data.text}<span style="color:${color};font-size:28px;">✨</span>`;
        answer.style.opacity = "0";
        setTimeout(() => { answer.style.opacity = "1"; },100);
    },700);
}

function setStatus(text) {
    const status = document.getElementById("portalStatus");
    if (status) { status.textContent = text; }
}

function setEyes(state) {
    const closed = document.querySelector(".eyes-closed");
    const open = document.querySelector(".eyes-open");
    const glasses = document.querySelector(".glasses");
    if (!closed || !open || !glasses) return;
    closed.style.opacity = state === "closed" ? "1" : "0";
    open.style.opacity = state === "open" ? "1" : "0";
    glasses.style.opacity = state === "glasses" ? "1" : "0";
}

function fadeGlassesToSleep() {
    const closed = document.querySelector(".eyes-closed");
    const glasses = document.querySelector(".glasses");
    if (!closed || !glasses) return;
    closed.style.opacity = "0";
    glasses.style.opacity = "1";
    setTimeout(() => { glasses.style.opacity = "0"; closed.style.opacity = "1"; }, 50);
}

function wakePrincess() {
    if (currentState !== OracleState.SLEEP) return;
    currentState = OracleState.LISTENING;
    setEyes("open");
    setText("Я слушаю...");
    setStatus("Царевна проснулась 👑");
    setTimeout(() => {
        setText("Оленька, я здесь 🤍");
        setStatus("Царевна ждёт...");
    }, 1800);
}

function startThinking() {
    if (currentState !== OracleState.LISTENING) return;
    currentState = OracleState.THINKING;
    setText("Ищу ответ...");
    setStatus("Зеркало думает ✨");
    setTimeout(() => { setText("..."); }, 2500);
    const mirror = document.getElementById("mirrorFrame");
    if (mirror) { mirror.classList.add("spin"); }
    setTimeout(() => { setEyes("glasses"); }, 6000);
    setTimeout(() => {
        currentState = OracleState.PROPHECY;
        if (mirror) { mirror.classList.remove("spin"); }
        setText("...");
        setStatus("Пророчество явлено 🔮");
        setTimeout(() => {
            showFinalAnswer(getOracleAnswer());
            setTimeout(() => { returnToSleep(); }, 7000);
        }, 1500);
    }, 10000);
}

function returnToSleep() {
    const fog = document.getElementById("fog");
    if (fog) { fog.style.opacity = "1"; }
    setTimeout(() => {
        currentState = OracleState.SLEEP;
        const mirror = document.getElementById("mirrorFrame");
        if (mirror) { mirror.classList.remove("positive-glow", "neutral-glow", "negative-glow"); }
        fadeGlassesToSleep();
        setStatus("Царевна спит...");
        if (fog) { fog.style.opacity = "0"; }
        setTimeout(() => { wakePrincess(); }, 2000);
    }, 4000);
}

// ===============================
// ЗАПУСК
// ===============================
window.addEventListener("load", () => {
    wakePrincess();
    startNFCListening();
});

document.addEventListener("click", (event) => {
    if (isScanning) return;
    if (event.target !== document.body && event.target !== document.querySelector(".stars-layer")) return;
    startNFCListening();
});

console.log("👑 Царевна Ольга — с любовью");
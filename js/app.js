// Global state
const S = {
  name: '',
  question: '',
  phrase: '',
  tokens: [], // Array of { kind: 'normal'|'phrase', ch: string }
  phraseIndex: 0,
  capturedAnswer: '',
  hiddenMode: false,
  dotUsed: false,
  ritualReady: false,
  complete: false
};

let _screen = 'question';

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  _screen = name;
}

function beginRitual() {
  const nField = document.getElementById('n-field');
  const qField = document.getElementById('q-field');
  const nVal = nField.value.trim();
  const qVal = qField.value.trim();
  
  if (!nVal || !qVal) {
    if (!nVal) {
      nField.style.borderColor = 'rgba(107,46,46,0.6)';
      nField.style.color = 'rgba(107,46,46,0.8)';
      setTimeout(() => { nField.style.borderColor = ''; nField.style.color = ''; }, 900);
    }
    if (!qVal) {
      qField.style.borderColor = 'rgba(107,46,46,0.6)';
      qField.style.color = 'rgba(107,46,46,0.8)';
      setTimeout(() => { qField.style.borderColor = ''; qField.style.color = ''; }, 900);
    }
    return;
  }
  
  S.name = nVal;
  S.question = qVal;
  S.phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  S.tokens = [];
  
  S.capturedAnswer = '';
  S.hiddenMode = false;
  S.dotUsed = false;
  S.ritualReady = false;
  S.complete = false;

  showScreen('ritual');
  if (typeof refreshDisplay === 'function') refreshDisplay();
  animatePhraseIn(S.phrase);
}

function animatePhraseIn(phrase) {
  const el = document.getElementById('ritual-phrase');
  el.innerHTML = '';
  el.classList.remove('ready', 'breathing');

  const spans = Array.from(phrase).map(ch => {
    const span = document.createElement('span');
    span.className = 'ph-ch';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    el.appendChild(span);
    return span;
  });

  el.classList.add('ready');

  let i = 0;
  function step() {
    if (i < spans.length) {
      spans[i].classList.add('vis');
      i++;
      setTimeout(step, 52 + Math.random() * 38);
    } else {
      el.classList.add('breathing');
      S.ritualReady = true;
    }
  }
  setTimeout(step, 650);
}

function submitRitual() {
  if (S.complete) return;
  if (!S.dotUsed || S.tokens.length < S.phrase.length) {
    const failText = document.querySelector('.fail-text');
    const nameLower = S.name.toLowerCase();
    
    if (nameLower === 'ashish' || nameLower === 'harshil') {
      const mockTemplate = FOUNDER_MOCKS[Math.floor(Math.random() * FOUNDER_MOCKS.length)];
      const capName = S.name.charAt(0).toUpperCase() + S.name.slice(1).toLowerCase();
      failText.innerHTML = mockTemplate.replace(/Ashish/g, capName);
    } else {
      failText.innerHTML = `The ritual remains incomplete, ${S.name}.<br>You have not learned.`;
    }
    
    showScreen('failure');
  } else {
    checkComplete();
  }
}

function checkComplete() {
  if (S.dotUsed && S.tokens.length >= S.phrase.length) {
    S.complete = true;
    S.ritualReady = false;
    saveRecord();
    setTimeout(() => {
      document.getElementById('c-phrase').textContent = S.capturedAnswer || "The spirits are silent.";
      showScreen('complete');
    }, 500); // reduced delay slightly for responsiveness after enter
  }
}

function saveRecord() {
  try {
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      question: S.question,
      answer: S.capturedAnswer,
      phrase: S.phrase
    };
    const all = JSON.parse(localStorage.getItem('phantomSight') || '[]');
    all.push(record);
    localStorage.setItem('phantomSight', JSON.stringify(all));
  } catch(_) {}
}

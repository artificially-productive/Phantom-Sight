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

  // Trigger GSAP animations for the new screen
  if (name === 'ritual' && window.animateScreenRitual) {
      window.animateScreenRitual();
  } else if (name === 'loader' && window.animateScreenLoader) {
      window.animateScreenLoader();
  } else if (name === 'complete' && window.animateScreenComplete) {
      window.animateScreenComplete();
  }
}

function beginRitual() {
  const nField = document.getElementById('n-field');
  const qField = document.getElementById('q-field');
  const nVal = nField.value.trim();
  const qVal = qField.value.trim();
  
  if (!nVal || !qVal) {
    if (!nVal) {
      nField.style.borderColor = 'rgba(225, 29, 72, 0.6)';
      nField.style.color = 'rgba(225, 29, 72, 0.8)';
      setTimeout(() => { nField.style.borderColor = ''; nField.style.color = ''; }, 900);
    }
    if (!qVal) {
      qField.style.borderColor = 'rgba(225, 29, 72, 0.6)';
      qField.style.color = 'rgba(225, 29, 72, 0.8)';
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

  // Animate the current screen out before switching
  gsap.to("#screen-question > *", {
    y: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.in",
    onComplete: () => {
      showScreen('ritual');
      if (typeof resetMobileInput === 'function') resetMobileInput();
      if (typeof refreshDisplay === 'function') refreshDisplay();
      animatePhraseIn(S.phrase);
      
      // Reset properties for next time
      gsap.set("#screen-question > *", { clearProps: "all" });
    }
  });
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

    // Animate ritual screen out
    gsap.to("#screen-ritual > *", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.in",
        onComplete: () => {
            showScreen('loader');
            
            // Wait for 2.5 seconds (pretend to connect to the ether)
            setTimeout(() => {
                // Animate loader out
                gsap.to("#screen-loader > *", {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.5,
                    onComplete: () => {
                        // Kill the infinite bouncing animation so it resets properly next time
                        gsap.killTweensOf("#screen-loader .loader-dot");
                        
                        document.getElementById('c-phrase').textContent = S.capturedAnswer || "The spirits are silent.";
                        showScreen('complete');
                        
                        // Clean up GSAP props for screens we just exited
                        gsap.set("#screen-ritual > *", { clearProps: "all" });
                        gsap.set("#screen-loader > *", { clearProps: "all" });
                    }
                });
            }, 2500);
        }
    });
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

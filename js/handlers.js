window.addEventListener('load', () => {
  document.getElementById('n-field').focus();
});

document.getElementById('n-field').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); beginRitual(); }
});
document.getElementById('q-field').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); beginRitual(); }
});
document.getElementById('q-submit').addEventListener('click', beginRitual);

document.addEventListener('keydown', e => {
  if (_screen !== 'ritual' || !S.ritualReady || S.complete) return;
  processKey(e);
});

document.getElementById('r-submit').addEventListener('click', submitRitual);

document.getElementById('f-again').addEventListener('click', () => {
  const nf = document.getElementById('n-field');
  const qf = document.getElementById('q-field');
  nf.value = '';
  qf.value = '';
  showScreen('question');
  setTimeout(() => nf.focus(), 200);
});

document.getElementById('c-again').addEventListener('click', () => {
  const nf = document.getElementById('n-field');
  const qf = document.getElementById('q-field');
  nf.value = '';
  qf.value = '';
  showScreen('question');
  setTimeout(() => nf.focus(), 200);
});

function processKey(e) {
  const k = e.key;

  if (k === 'Tab') {
    e.preventDefault();
    const pct = S.tokens.length / S.phrase.length;
    if ((S.dotUsed || pct >= 0.4) && S.tokens.length > 0 && S.tokens.length < S.phrase.length) {
      const remaining = S.phrase.slice(S.tokens.length);
      for (const ch of remaining) {
        S.tokens.push({ kind: 'phrase', ch });
        
      }
      refreshDisplay();
    }
    return;
  }

  if (k === 'Enter') {
    e.preventDefault();
    submitRitual();
    return;
  }

  if (k === 'Backspace') {
    e.preventDefault();
    doBackspace();
    return;
  }

  // CRITICAL FIX: Dot toggles hidden mode AND displays phrase[phraseIndex]
  if (k === '.') {
    e.preventDefault();
    S.hiddenMode = !S.hiddenMode;
    S.dotUsed = true;
    
    if (S.tokens.length < S.phrase.length) {
      S.tokens.push({ kind: 'phrase', ch: S.phrase[S.tokens.length] });
      
    }
    refreshDisplay();
    return;
  }

  if (k.length !== 1) return;
  e.preventDefault();

  if (S.hiddenMode) {
    // Capture answer secretly; display next phrase character
    S.capturedAnswer += k;
    if (S.tokens.length < S.phrase.length) {
      S.tokens.push({ kind: 'phrase', ch: S.phrase[S.tokens.length] });
      
    }
  } else {
    // Normal typing (pre-ritual or after hidden mode is closed)
    S.tokens.push({ kind: 'normal', ch: k });
  }

  refreshDisplay();
}

function doBackspace() {
  if (S.tokens.length === 0) return;
  const last = S.tokens[S.tokens.length - 1];
  
  if (last.kind === 'phrase') {
    S.tokens.pop();
    
    
    // In hidden mode, backspace should also delete the last captured char
    if (S.hiddenMode && S.capturedAnswer.length > 0) {
      S.capturedAnswer = S.capturedAnswer.slice(0, -1);
    }
  } else {
    S.tokens.pop();
  }
  refreshDisplay();
}

function refreshDisplay() {
  const tRevealed = document.getElementById('t-revealed');
  const tCursor   = document.getElementById('t-cursor');
  const tPending  = document.getElementById('t-pending');
  const tabHint   = document.getElementById('tab-hint');

  tRevealed.textContent = S.tokens.map(t => t.ch).join('');

  const pct = S.tokens.length / S.phrase.length;
  const showPending = (S.dotUsed || pct >= 0.4) && S.tokens.length > 0 && S.tokens.length < S.phrase.length && !S.hiddenMode;
  tPending.textContent = showPending ? S.phrase.slice(S.tokens.length) : '';

  if (showPending) {
    tabHint.classList.add('show');
  } else {
    tabHint.classList.remove('show');
  }

  if (S.hiddenMode) {
    tCursor.classList.add('h');
  } else {
    tCursor.classList.remove('h');
  }
}

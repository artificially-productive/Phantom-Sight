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
  // If the event came from the hidden input, and it's a character, let the input event handle it.
  // But we must catch Enter, Tab, and Backspace globally.
  if (e.key === 'Tab') { e.preventDefault(); doTab(); return; }
  if (e.key === 'Enter') { e.preventDefault(); submitRitual(); return; }
  if (e.key === 'Backspace') { e.preventDefault(); doBackspace(); syncHiddenInput(); return; }

  // If it's a 1-length character and NOT from the mobile input, process it manually.
  // If it IS from the mobile input, we STILL preventDefault on desktop so it doesn't double fire,
  // EXCEPT on Android where e.key is often 'Unidentified'. If 'Unidentified', it falls through to input event!
  if (e.key.length === 1) {
    if (e.key !== 'Unidentified') {
      e.preventDefault();
      simulateKey(e.key);
      syncHiddenInput();
    }
  }
});

// Mobile virtual keyboard handling
let _lastInputValue = '';
const hiddenInput = document.getElementById('hidden-input');

hiddenInput.addEventListener('input', e => {
  if (_screen !== 'ritual' || !S.ritualReady || S.complete) return;
  const currentVal = e.target.value;
  
  if (currentVal.length < _lastInputValue.length) {
    const diff = _lastInputValue.length - currentVal.length;
    for (let i = 0; i < diff; i++) doBackspace();
  } else if (currentVal.length > _lastInputValue.length) {
    const added = currentVal.slice(_lastInputValue.length);
    for (const ch of added) {
      simulateKey(ch);
    }
  }
  _lastInputValue = currentVal;
});

document.getElementById('display-area').addEventListener('click', () => {
  if (_screen === 'ritual') hiddenInput.focus();
});

document.getElementById('tab-hint').addEventListener('click', () => {
  doTab();
  hiddenInput.focus();
});

document.getElementById('r-submit').addEventListener('click', submitRitual);

document.getElementById('f-again').addEventListener('click', () => {
  const nf = document.getElementById('n-field');
  const qf = document.getElementById('q-field');
  nf.value = ''; qf.value = '';
  showScreen('question');
  setTimeout(() => nf.focus(), 200);
});

document.getElementById('c-again').addEventListener('click', () => {
  const nf = document.getElementById('n-field');
  const qf = document.getElementById('q-field');
  nf.value = ''; qf.value = '';
  showScreen('question');
  setTimeout(() => nf.focus(), 200);
});

function resetMobileInput() {
  _lastInputValue = '';
  hiddenInput.value = '';
}

function syncHiddenInput() {
  _lastInputValue = '*'.repeat(S.tokens.length);
  hiddenInput.value = _lastInputValue;
}

function doTab() {
  const pct = S.tokens.length / S.phrase.length;
  if ((S.dotUsed || pct >= 0.4) && S.tokens.length > 0 && S.tokens.length < S.phrase.length) {
    const remaining = S.phrase.slice(S.tokens.length);
    for (const ch of remaining) {
      S.tokens.push({ kind: 'phrase', ch });
    }
    refreshDisplay();
    syncHiddenInput();
  }
}

function simulateKey(k) {
  if (k === '.') {
    S.hiddenMode = !S.hiddenMode;
    S.dotUsed = true;
    if (S.tokens.length < S.phrase.length) {
      S.tokens.push({ kind: 'phrase', ch: S.phrase[S.tokens.length] });
    }
  } else {
    if (S.hiddenMode) {
      S.capturedAnswer += k;
      if (S.tokens.length < S.phrase.length) {
        S.tokens.push({ kind: 'phrase', ch: S.phrase[S.tokens.length] });
      }
    } else {
      S.tokens.push({ kind: 'normal', ch: k });
    }
  }
  refreshDisplay();
}

function doBackspace() {
  if (S.tokens.length === 0) return;
  const last = S.tokens[S.tokens.length - 1];
  
  if (last.kind === 'phrase') {
    S.tokens.pop();
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

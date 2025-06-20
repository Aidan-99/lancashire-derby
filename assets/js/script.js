document.addEventListener('DOMContentLoaded', () => {
  const horses = [
    document.getElementById('horse1'),
    document.getElementById('horse2'),
    document.getElementById('horse3'),
    document.getElementById('horse4')
  ];
  const startBtn = document.getElementById('start-race');
  const winnerDiv = document.getElementById('winner');
  const track = document.getElementById('race-track');
  const resultsBody = document.getElementById('resultsTableBody'); // fixed ID to match your HTML
  const raceStartSound = document.getElementById('raceStartSound'); // if you add this audio element in your HTML
  
  let raceInterval = null;
  let raceInProgress = false;

  let balance = 100;
  let wins = 0;
  let losses = 0;

  const balanceDisplay = document.getElementById('currentBalance');
  const betAmountInput = document.getElementById('betAmount');
  const horseSelect = document.getElementById('horseSelect');
  const betForm = document.getElementById('betForm');

  const winsCount = document.getElementById('winsCount');
  const lossesCount = document.getElementById('lossesCount');

  let selectedHorse = null;
  let betAmount = 0;

  function getTrackWidth() {
    const horseWidth = horses[0].offsetWidth;
    const width = track.offsetWidth - horseWidth - 20; // keep some margin
    return width > 0 ? width : 0;
  }

  function positionHorses() {
    const rowHeight = 50;
    horses.forEach((horse, i) => {
      horse.style.top = (i * rowHeight) + 'px';
      horse.style.left = '0px';
    });
  }

  function resetRace() {
    positionHorses();
    winnerDiv.textContent = '';
    resultsBody.innerHTML = '';
  }

  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function updateBalanceDisplay() {
    balanceDisplay.textContent = `You currently have £${balance}`;
    betAmountInput.max = balance;
    if (balance < 1) {
      startBtn.disabled = true;
      winnerDiv.textContent = 'Game Over: You ran out of money!';
    }
  }

  function updateStats() {
    winsCount.textContent = wins;
    lossesCount.textContent = losses;
  }

  function startRace() {
    if (raceInProgress) return; // prevent multiple races
    if (!selectedHorse) {
      alert('Place a bet before starting!');
      return;
    }
    if (betAmount < 1 || betAmount > balance) {
      alert('Invalid bet amount!');
      return;
    }

    raceInProgress = true;
    startBtn.disabled = true;
    betForm.querySelector('button[type="submit"]').disabled = true;

    // Play start sound if available
    if (raceStartSound) {
      raceStartSound.currentTime = 0;
      raceStartSound.play();
    }

    resetRace();

    const trackWidth = getTrackWidth();

    const speeds = horses.map(() => Math.random() * 3 + 2);
    const positions = [0, 0, 0, 0];
    const finished = [];
    const finishTimes = [null, null, null, null];
    let tick = 0;

    raceInterval = setInterval(() => {
      tick++;
      for (let i = 0; i < horses.length; i++) {
        if (finishTimes[i] !== null) continue;
        positions[i] += speeds[i] + Math.random() * 2;
        if (positions[i] > trackWidth) positions[i] = trackWidth;
        horses[i].style.left = positions[i] + 'px';
        if (positions[i] >= trackWidth && finishTimes[i] === null) {
          finishTimes[i] = tick;
          finished.push({ horse: i + 1, tick }); // horses indexed 1-based for display
        }
      }
      if (finished.length === horses.length) {
        clearInterval(raceInterval);
        finished.sort((a, b) => a.tick - b.tick);

        // Show results in table
        resultsBody.innerHTML = '';
        finished.forEach((entry, idx) => {
          const row = document.createElement('tr');
          const posCell = document.createElement('td');
          const horseCell = document.createElement('td');
          posCell.textContent = getOrdinal(idx + 1);
          horseCell.textContent = `Horse ${entry.horse}`;
          row.appendChild(posCell);
          row.appendChild(horseCell);
          resultsBody.appendChild(row);
        });

        // Determine winner & update balance
        const winningHorse = finished[0].horse;

        if (parseInt(selectedHorse) === winningHorse) {
          balance += betAmount; // won: add bet amount (you can adjust payout here)
          wins++;
          winnerDiv.textContent = `You won! Horse ${winningHorse} came first 🏆`;
        } else {
          balance -= betAmount; // lost: subtract bet
          losses++;
          winnerDiv.textContent = `You lost. Horse ${winningHorse} won.`;
        }

        // Reset betting for next round
        selectedHorse = null;
        betAmount = 0;
        betForm.reset();

        updateBalanceDisplay();
        updateStats();

        raceInProgress = false;
        startBtn.disabled = balance < 1;
        betForm.querySelector('button[type="submit"]').disabled = false;
      }
    }, 30);
  }

  // Event listeners
  betForm.addEventListener('submit', e => {
    e.preventDefault();
    selectedHorse = horseSelect.value;
    betAmount = parseInt(betAmountInput.value);

    if (!selectedHorse || betAmount < 1 || betAmount > balance) {
      alert('Invalid bet. Please select a horse and enter a valid bet amount.');
      return;
    }

    winnerDiv.textContent = `Bet placed on Horse ${selectedHorse} for £${betAmount}. Start the race!`;
    startBtn.disabled = false;
  });

  startBtn.addEventListener('click', startRace);

  // Initialize
  positionHorses();
  updateBalanceDisplay();
  updateStats();
  startBtn.disabled = true; // disabled until bet placed
});




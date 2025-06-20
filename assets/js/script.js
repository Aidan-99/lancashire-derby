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
  const resultsBody = document.getElementById('results-body');
  // Add reference to the audio element
  const raceStartSound = document.getElementById('raceStartSound');
  let raceInterval = null;

  function getTrackWidth() {
    const horseWidth = horses[0].offsetWidth;
    const width = track.offsetWidth - horseWidth;
    return width > 0 ? width : 0;
  }

  function positionHorses() {
    const rowHeight = 50;
    horses.forEach((horse, i) => {
      horse.style.top = (i * rowHeight) + 'px';
      horse.style.left = '0px';
    });
  }

  // Reset race visuals and results
  function resetRace() {
    positionHorses();
    winnerDiv.textContent = '';
  }

  function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function startRace() {
    // Play the race start sound
    if (raceStartSound) {
      raceStartSound.currentTime = 0;
      raceStartSound.play();
    }
    resetRace();
    const trackWidth = getTrackWidth();
    if (trackWidth === 0) {
      winnerDiv.textContent = "Track width is zero. Try resizing the window or check your layout.";
      return;
    }

    resetRace();
    raceInProgress = true;
    startBtn.disabled = true; // Disable start button during race

    const trackWidth = track.offsetWidth - horses[0].offsetWidth - 20;
    const speeds = horses.map(() => Math.random() * 3 + 2);
    const positions = [0, 0, 0, 0];
    const finished = [];
    const finishTimes = [null, null, null, null];
    let tick = 0;

    raceInterval = setInterval(() => {
      tick++;
      for (let i = 0; i < horses.length; i++) {
        if (finishTimes[i] !== null) continue; // Skip finished horses
        positions[i] += speeds[i] + Math.random() * 2;
        if (positions[i] > trackWidth) positions[i] = trackWidth;
        horses[i].style.left = positions[i] + 'px';
        if (positions[i] >= trackWidth && finishTimes[i] === null) {
          finishTimes[i] = tick;
          finished.push({ horse: i, tick }); // Store index
        }
      }
      // When all horses have finished, show results
      if (finished.length === horses.length) {
        clearInterval(raceInterval);
        // Sort by finish tick (lower is better)
        finished.sort((a, b) => a.tick - b.tick);
        // Clear previous results
        resultsBody.innerHTML = '';
        finished.forEach((entry, idx) => {
          const row = document.createElement('tr');
          const posCell = document.createElement('td');
          const horseCell = document.createElement('td');
          posCell.textContent = getOrdinal(idx + 1);
          horseCell.textContent = horses[entry.horse].alt; // Use alt text
          row.appendChild(posCell);
          row.appendChild(horseCell);
          resultsBody.appendChild(row);
        });
      }
    }, 30);
  }

  positionHorses();
  updateBetInputLimits();

  startBtn.addEventListener('click', startRace);
});
let balance = 100;
let wins = 0;
let losses = 0;

const balanceDisplay = document.getElementById('currentBalance');
const betAmountInput = document.getElementById('betAmount');
const horseSelect = document.getElementById('horseSelect');
const betForm = document.getElementById('betForm');
const winnerDisplay = document.getElementById('winner');
const resultsTableBody = document.getElementById('resultsTableBody');
const startRaceBtn = document.getElementById('start-race');

const winsCount = document.getElementById('winsCount');
const lossesCount = document.getElementById('lossesCount');

let selectedHorse = null;
let betAmount = 0;

// Update UI balance
function updateBalanceDisplay() {
  balanceDisplay.textContent = `You currently have £${balance}`;
  betAmountInput.max = balance;
  if (balance < 1) {
    startRaceBtn.disabled = true;
    winnerDisplay.textContent = 'Game Over: You ran out of money!';
  }
}

// Handle Bet Submission
betForm.addEventListener('submit', function (e) {
  e.preventDefault();
  selectedHorse = horseSelect.value;
  betAmount = parseInt(betAmountInput.value);

  if (!selectedHorse || betAmount < 1 || betAmount > balance) {
    alert('Invalid bet.');
    return;
  }

  winnerDisplay.textContent = 'Bet placed! Start the race!';
  startRaceBtn.disabled = false;
});

// Handle Race
startRaceBtn.addEventListener('click', function () {
  if (!selectedHorse) {
    alert('Place a bet before starting!');
    return;
  }

  startRaceBtn.disabled = true;

  // Simulate race with random results
  const horses = [1, 2, 3, 4];
  const results = horses.sort(() => Math.random() - 0.5);

  // Update race result display
  resultsTableBody.innerHTML = '';
  results.forEach((horse, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${index + 1}${['st', 'nd', 'rd', 'th'][index]}</td><td>Horse ${horse}</td>`;
    resultsTableBody.appendChild(row);
  });

  // Determine winner
  const winningHorse = results[0];

  // Check if the player won
  if (parseInt(selectedHorse) === winningHorse) {
    balance += betAmount; // win: double return
    wins++;
    winnerDisplay.textContent = `You won! Horse ${winningHorse} came first 🏆`;
  } else {
    balance -= betAmount; // lose bet
    losses++;
    winnerDisplay.textContent = `You lost. Horse ${winningHorse} won.`;
  }

  // Reset for next round
  selectedHorse = null;
  betForm.reset();

  // Update stats
  winsCount.textContent = wins;
  lossesCount.textContent = losses;

  // Update balance and max bet
  updateBalanceDisplay();
});

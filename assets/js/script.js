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
  const resultsTable = document.getElementById('resultsTableBody');
  const winsDisplay = document.getElementById('winsCount');
  const lossesDisplay = document.getElementById('lossesCount');

  // New elements for betting
  const betForm = document.getElementById("betForm");
  const horseSelect = document.getElementById("horseSelect");
  const betAmountInput = document.getElementById("betAmount");
  const currentBalanceDisplay = document.getElementById("currentBalance");

  let playerHorse = null;
  let wins = 0;
  let losses = 0;
  let raceInProgress = false;

  // Start user with £100
  let currentBalance = 100;
  let currentBet = 0;

  // Update the max attribute of betAmount to currentBalance and display balance
  function updateBetInputLimits() {
    betAmountInput.max = currentBalance;
    if (parseInt(betAmountInput.value) > currentBalance) {
      betAmountInput.value = currentBalance;
    }
    currentBalanceDisplay.textContent = `You currently have £${currentBalance}`;
  }

  // Handle Bet Form submission
  betForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selected = horseSelect.value;
    const betAmount = parseInt(betAmountInput.value);

    if (!selected) {
      alert("Please select a horse to bet on.");
      return;
    }

    if (isNaN(betAmount) || betAmount < 50) {
      alert("Minimum bet is £50.");
      return;
    }
    if (betAmount > currentBalance) {
      alert(`You don't have enough funds to bet £${betAmount}.`);
      return;
    }

    // Set the player's horse and current bet amount
    playerHorse = parseInt(selected);
    currentBet = betAmount;

    // Deduct the bet amount from the balance immediately
    currentBalance -= currentBet;
    updateBetInputLimits();

    alert(`Bet placed on Horse ${playerHorse} for £${currentBet}`);
  });

  // Position Horses vertically on left start line
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
    resultsTable.innerHTML = `
      <tr><td>1st</td><td>---</td></tr>
      <tr><td>2nd</td><td>---</td></tr>
      <tr><td>3rd</td><td>---</td></tr>
      <tr><td>4th</td><td>---</td></tr>
    `;
  }

  // Show race results and update wins/losses & balance
  function declareResults(order) {
    const positions = ['1st', '2nd', '3rd', '4th'];
    resultsTable.innerHTML = '';
    for (let i = 0; i < order.length; i++) {
      resultsTable.innerHTML += `<tr><td>${positions[i]}</td><td>Horse ${order[i]}</td></tr>`;
    }

    const winnerHorse = order[0];
    if (playerHorse === winnerHorse) {
      wins++;
      winnerDiv.textContent = `🎉 You won! Horse ${winnerHorse} placed 1st! You earn £${currentBet * 2}!`;
      // Add double the bet amount (win the bet amount + the original bet back)
      currentBalance += currentBet * 2;
    } else {
      losses++;
      winnerDiv.textContent = `😞 You lost. Horse ${winnerHorse} won the race. You lost £${currentBet}.`;
      // Bet amount was already deducted
    }

    winsDisplay.textContent = wins;
    lossesDisplay.textContent = losses;

    updateBetInputLimits();

    // Reset bet for next race
    playerHorse = null;
    currentBet = 0;
    raceInProgress = false;
    startBtn.disabled = false; // Re-enable start button
  }

  // Animate the race
  function startRace() {
    if (raceInProgress) return;
    if (!playerHorse) {
      alert("Place a bet before starting the race!");
      return;
    }
    if (currentBet <= 0) {
      alert("Please place a valid bet before starting the race!");
      return;
    }
    if (currentBalance < 0) {
      alert("You don't have enough funds to race!");
      return;
    }

    resetRace();
    raceInProgress = true;
    startBtn.disabled = true; // Disable start button during race

    const trackWidth = track.offsetWidth - horses[0].offsetWidth - 20;
    const speeds = horses.map(() => Math.random() * 3 + 2);
    const positions = [0, 0, 0, 0];
    const finished = [];

    const interval = setInterval(() => {
      for (let i = 0; i < horses.length; i++) {
        if (finished.includes(i + 1)) continue;

        positions[i] += speeds[i] + Math.random() * 2;
        if (positions[i] >= trackWidth) {
          positions[i] = trackWidth;
          finished.push(i + 1);
        }
        horses[i].style.left = positions[i] + 'px';
      }

      if (finished.length === horses.length) {
        clearInterval(interval);
        declareResults(finished);
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

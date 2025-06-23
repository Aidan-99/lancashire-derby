document.addEventListener('DOMContentLoaded', () => {
  const horses = [
    document.getElementById('horse1'),
    document.getElementById('horse2'),
    document.getElementById('horse3'),
    document.getElementById('horse4'),
    document.getElementById('horse5'),
    document.getElementById('horse6')
  ];
  const startBtn = document.getElementById('start-race');
  const winnerDiv = document.getElementById('winner');
  const track = document.getElementById('race-track');
  const resultsBody = document.getElementById('results-body');
  const raceStartSound = document.getElementById('raceStartSound');
  const loseSound = document.getElementById('loseSound');
  const winSound = document.getElementById('winSound');
  const crowdSound = document.getElementById('crowdSound');

  // Betting elements
  const betForm = document.getElementById('betForm');
  const horseSelect = document.getElementById('horseSelect');
  const betAmountInput = document.getElementById('betAmount');
  const userBalanceSpan = document.getElementById('userBalance');

  let userBalance = 1000;
  let userBet = null; // { horseIndex, amount }
  let raceInterval = null;

  function updateBalanceDisplay() {
    userBalanceSpan.textContent = userBalance;
  }

  // Populate horseSelect with horse alts
  if (horseSelect && horses && horses.length) {
    horseSelect.innerHTML = '<option selected disabled>Bet on horse</option>';
    horses.forEach((horse, idx) => {
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = horse.alt;
      horseSelect.appendChild(option);
    });
  }

  // Disable start button by default
  startBtn.disabled = true;

  // Handle bet form submission
  if (betForm) {
    betForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const horseIndex = parseInt(horseSelect.value, 10);
      const betAmount = parseInt(betAmountInput.value, 10);

      if (isNaN(horseIndex) || isNaN(betAmount) || betAmount < 1) {
        alert('Please select a horse and enter a valid bet amount.');
        return;
      }
      if (betAmount > userBalance) {
        alert('Insufficient balance!');
        return;
      }
      userBet = { horseIndex, betAmount };
      userBalance -= betAmount;
      updateBalanceDisplay();
      showBetPlacedModal(betAmount, horses[horseIndex].alt);
      startBtn.disabled = false; // Enable the start button
    });
  }

  function getTrackWidth() {
    const horseWidth = horses[0].offsetWidth;
    const width = track.offsetWidth - horseWidth;
    return width > 0 ? width : 0;
  }

  function positionHorses() {
    const startTop = 30;
    const rowHeight = 50;
    horses.forEach((horse, i) => {
      const top = startTop + i * rowHeight;
      horse.style.top = top + 'px';
      horse.style.left = '0px';
      // Move the name tag as well
      const nameTag = document.getElementById(`horse${i+1}-name`);
      if (nameTag) {
        nameTag.style.left = (horse.offsetWidth + 10) + 'px';
        nameTag.style.top = (top + horse.offsetHeight / 2 - 16) + 'px';
      }
    });
  }

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
    // Remove all finish position tags from previous race
    document.querySelectorAll('.finish-position-tag').forEach(tag => tag.remove());

    const rowHeight = 50; // <-- Add this line!
    // Play the race start sound
    if (raceStartSound) {
      raceStartSound.currentTime = 0;
      raceStartSound.play();
    }
    // Play the crowd sound
    if (crowdSound) {
      crowdSound.currentTime = 0;
      crowdSound.play();
    }
    resetRace();
    const trackWidth = getTrackWidth();
    if (trackWidth === 0) {
      winnerDiv.textContent = "Track width is zero. Try resizing the window or check your layout.";
      return;
    }
    const speeds = horses.map(() => Math.random() * 3 + 2);
    const positions = Array(horses.length).fill(0);
    const finished = [];
    const finishTimes = Array(horses.length).fill(null);
    let tick = 0;

    raceInterval = setInterval(() => {
      tick++;
      for (let i = 0; i < horses.length; i++) {
        if (finishTimes[i] !== null) continue; // Skip finished horses
        positions[i] += speeds[i] + Math.random() * 2;
        if (positions[i] > trackWidth) positions[i] = trackWidth;
        horses[i].style.left = positions[i] + 'px';
        horses[i].style.top = (i * rowHeight) + 'px';

        // Move the name tag to follow the horse
        const nameTag = document.getElementById(`horse${i + 1}-name`);
        if (nameTag) {
          nameTag.style.left = (positions[i] + horses[i].offsetWidth + 10) + 'px';
          nameTag.style.top = (i * rowHeight + (horses[i].offsetHeight / 2) - 16) + 'px';
        }

        if (positions[i] >= trackWidth && finishTimes[i] === null) {
          finishTimes[i] = tick;
          finished.push({ horse: i, tick }); // Store index

          // Show finish position tag
          const finishPos = finished.length; // 1-based position
          showFinishTag(i, finishPos);
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
          horseCell.textContent = horses[entry.horse].alt;
          row.appendChild(posCell);
          row.appendChild(horseCell);
          resultsBody.appendChild(row);
        });

        // Check if user bet and if their horse won
        if (userBet) {
          if (finished[0].horse === userBet.horseIndex) {
            const winnings = userBet.betAmount * 2;
            userBalance += winnings;
            updateBalanceDisplay();
            showWinModal(winnings);
            checkOutOfMoney(); // This will only show if balance is 0 after winning
          } else {
            showLoseModal();
          }
          userBet = null;
        }
        startBtn.disabled = true;
      }
    }, 30);
  }

  function checkOutOfMoney() {
    if (userBalance <= 0) {
      showOutOfMoneyModal();
      betForm.querySelector('button[type="submit"]').disabled = true;
      startBtn.disabled = true;
    }
  }

  const loseModal = document.getElementById('loseModal');
  const closeLoseModal = document.getElementById('closeLoseModal');

  function showLoseModal() {
    if (loseSound) {
      loseSound.currentTime = 0;
      loseSound.play();
    }
    loseModal.style.display = 'flex';
  }

  if (closeLoseModal) {
    closeLoseModal.addEventListener('click', () => {
      loseModal.style.display = 'none';
      checkOutOfMoney();
    });
  }

  const winModal = document.getElementById('winModal');
  const winModalMsg = document.getElementById('winModalMsg');
  const closeWinModal = document.getElementById('closeWinModal');
  const outOfMoneyModal = document.getElementById('outOfMoneyModal');
  const closeOutOfMoneyModal = document.getElementById('closeOutOfMoneyModal');
  const outOfMoneySound = document.getElementById('outOfMoneySound');

  function showWinModal(winnings) {
    if (winModalMsg) {
      winModalMsg.textContent = `Congratulations! Your horse won! You earned $${winnings}.`;
    }
    if (winSound) {
      winSound.currentTime = 0;
      winSound.play();
    }
    winModal.style.display = 'flex';
  }

  if (closeWinModal) {
    closeWinModal.addEventListener('click', () => {
      winModal.style.display = 'none';
      checkOutOfMoney();
    });
  }

  function showOutOfMoneyModal() {
    if (outOfMoneySound) {
      outOfMoneySound.currentTime = 0;
      outOfMoneySound.play();
    }
    outOfMoneyModal.style.display = 'flex';
  }

  if (closeOutOfMoneyModal) {
    closeOutOfMoneyModal.addEventListener('click', () => {
      outOfMoneyModal.style.display = 'none';
      // Optionally, reload or reset the game here
    });
  }

  const betPlacedModal = document.getElementById('betPlacedModal');
  const betPlacedMsg = document.getElementById('betPlacedMsg');
  const closeBetPlacedModal = document.getElementById('closeBetPlacedModal');

  function showBetPlacedModal(betAmount, horseName) {
    if (betPlacedMsg) {
      betPlacedMsg.textContent = `Bet placed: $${betAmount} on ${horseName}. You may now start the race!`;
    }
    betPlacedModal.style.display = 'flex';
  }

  if (closeBetPlacedModal) {
    closeBetPlacedModal.addEventListener('click', () => {
      betPlacedModal.style.display = 'none';
      // Scroll to the race track
      const raceTrack = document.getElementById('race-track-bg');
      if (raceTrack) {
        raceTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Set initial positions for horses and name tags
  const horseCount = 6;
  const startLeft = 0;
  const startTop = 30;
  const rowGap = 50;

  for (let i = 0; i < horseCount; i++) {
    const horse = document.getElementById(`horse${i+1}`);
    const nameTag = document.getElementById(`horse${i+1}-name`);
    if (horse && nameTag) {
      const left = startLeft; // 0 at the start
      const top = startTop + i * rowGap;
      horse.style.left = left + "px";
      horse.style.top = top + "px";
      // Align name tag exactly with the horse's top and left
      nameTag.style.left = (left + horse.offsetWidth + 10) + "px";
      nameTag.style.top = (top + horse.offsetHeight / 2 - 16) + "px";
    }
  }

  // In your race animation loop, after moving each horse:
  // (Assuming positions[i] is the current left position of the horse)
  function updateHorsePositions(positions) {
    for (let i = 0; i < horseCount; i++) {
      const horse = document.getElementById(`horse${i+1}`);
      const nameTag = document.getElementById(`horse${i+1}-name`);
      if (horse && nameTag) {
        horse.style.left = positions[i] + "px";
        nameTag.style.left = (positions[i] + horse.offsetWidth + 10) + "px";
        nameTag.style.top = (parseInt(horse.style.top) + horse.offsetHeight/2 - 16) + "px";
      }
    }
  }

  function showFinishTag(horseIndex, position) {
    const horse = document.getElementById(`horse${horseIndex+1}`);
    const raceTrack = document.getElementById('race-track');
    if (!horse || !raceTrack) return;

    // Create the tag
    const tag = document.createElement('div');
    tag.className = 'finish-position-tag';
    tag.textContent = getOrdinal(position);

    // Calculate vertical position to match the horse
    const horseTop = parseInt(horse.style.top) || 0;
    tag.style.top = (horseTop + horse.offsetHeight/2 - 18) + 'px';

    // Start at the right edge (finish line)
    tag.style.right = '-120px'; // offscreen
    tag.style.opacity = '0';

    raceTrack.appendChild(tag);

    // Animate in: move to just left of the finish line
    setTimeout(() => {
      tag.style.right = '0px';
      tag.style.opacity = '1';
    }, 50);
  }

  positionHorses();
  startBtn.addEventListener('click', startRace);
});
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
    const speeds = horses.map(() => Math.random() * 3 + 2);
    const positions = [0, 0, 0, 0, 0, 0];
    const finished = [];
    const finishTimes = [null, null, null, null, null, null];
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
  startBtn.addEventListener('click', startRace);
});
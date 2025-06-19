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

  function startRace() {
    resetRace();
    const trackWidth = getTrackWidth();
    if (trackWidth === 0) {
      winnerDiv.textContent = "Track width is zero. Try resizing the window or check your layout.";
      return;
    }
    const speeds = horses.map(() => Math.random() * 3 + 2);
    const positions = [0, 0, 0, 0];

    raceInterval = setInterval(() => {
      for (let i = 0; i < horses.length; i++) {
        positions[i] += speeds[i] + Math.random() * 2;
        if (positions[i] > trackWidth) positions[i] = trackWidth;
        horses[i].style.left = positions[i] + 'px';
        if (positions[i] >= trackWidth) {
          clearInterval(raceInterval);
          winnerDiv.textContent = `🏆 Winner: Horse ${i + 1}!`;
          break;
        }
      }
    }, 30);
  }

  positionHorses();
  startBtn.addEventListener('click', startRace);
});
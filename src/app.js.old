const data = [
  {
    frame: 'Crust Romanceur',
    size: '52cm',
    tireWidthIn: 2.3,
    brake: 'Paul Neo-Retro',
    yoke: 'Rene Herse',
    frontHeightMm: 28,
    rearHeightMm: 28,
  },
];

function findHeight(frame, size, tireWidth, brake, yoke) {
  for (const entry of data) {
    if (
      entry.frame.toLowerCase() === frame.toLowerCase() &&
      entry.size.toLowerCase() === size.toLowerCase() &&
      Math.abs(entry.tireWidthIn - tireWidth) < 0.01 &&
      entry.brake.toLowerCase() === brake.toLowerCase() &&
      entry.yoke.toLowerCase() === yoke.toLowerCase()
    ) {
      return { front: entry.frontHeightMm, rear: entry.rearHeightMm };
    }
  }
  // fallback simple formula
  const height = Math.round((12 + 7 * tireWidth) * 10) / 10;
  return { front: height, rear: height };
}

function calculate() {
  const frame = document.getElementById('frame').value;
  const size = document.getElementById('size').value;
  const tireWidth = parseFloat(document.getElementById('tireWidth').value);
  const brake = document.getElementById('brake').value;
  const yoke = document.getElementById('yoke').value;
  if (!frame || !size || !tireWidth || !brake || !yoke) {
    alert('Please fill out all fields.');
    return;
  }
  const result = findHeight(frame, size, tireWidth, brake, yoke);
  document.getElementById('result').textContent =
    `Front yoke height: ${result.front} mm\nRear yoke height: ${result.rear} mm`;
  updateDiagram(result.front);
}

document.getElementById('calcBtn').addEventListener('click', calculate);

// diagram logic
const diagram = document.getElementById('diagram');
const yokeMarker = document.getElementById('yokeMarker');
const line = document.getElementById('line');
const tireHeight = 60;
const diagramHeight = 200;
let isDragging = false;
let scale = 3; // pixels per mm

function updateDiagram(heightMm) {
  const offset = heightMm * scale;
  yokeMarker.style.bottom = `${tireHeight + offset}px`;
  line.style.bottom = `${tireHeight}px`;
  line.style.height = `${offset}px`;
}

function getHeightFromPosition(yPos) {
  const offset = yPos - tireHeight;
  return Math.max(offset / scale, 0);
}

yokeMarker.addEventListener('mousedown', () => {
  isDragging = true;
});
document.addEventListener('mouseup', () => {
  isDragging = false;
});

diagram.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const rect = diagram.getBoundingClientRect();
  let y = rect.bottom - e.clientY;
  y = Math.min(Math.max(y, tireHeight), diagramHeight);
  yokeMarker.style.bottom = `${y}px`;
  line.style.height = `${y - tireHeight}px`;
  const h = Math.round(getHeightFromPosition(y) * 10) / 10;
  document.getElementById('result').textContent = `Yoke height: ${h} mm`;
});


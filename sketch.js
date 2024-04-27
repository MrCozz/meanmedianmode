// p5.js simulation for exploring Mean, Median, Mode, and Range

let data = [];
let input, button, resetButton;
let results = { mean: null, median: null, mode: null, range: null };
let upButtons = [];
let downButtons = [];
let showInstructions = false;

function setup() {
  createCanvas(800, 400);
  textSize(15);

  // Input field setup
  input = createInput();
  input.position(10, 35);
  input.size(600);
  input.attribute('placeholder', 'Enter numbers separated by commas (e.g., 5, 3, 8, 12)');
  input.elt.onkeypress = function (e) {
    if (e.keyCode === 13) {  // 13 is the keycode for Enter
      processData();
    }
  };

  // Button setup for calculating
  button = createButton('Calculate');
  button.position(input.x + input.width + 10, 35);
  button.mousePressed(processData);

  // Reset button setup
  resetButton = createButton('Reset');
  resetButton.position(10, 370);  // Bottom left corner
  resetButton.mousePressed(resetSimulation);

  textAlign(LEFT);
}

function draw() {
  background(51);

  // Always visible data entry instructions
  fill(255);
  text("Enter numbers separated by commas (e.g., 5, 3, 8, 12) and press Calculate:", 10, 20);

  // Adjusted dataset manipulation instructions for better visibility
  if (showInstructions) {
    fill(255);
    text("Click on the arrows to adjust data values", 10, input.y + 55);  // Lowered position
  }

  // Draw the interactive data points and labels
  drawInteractiveData();

  // Display results continuously after calculation
  if (data.length > 0) {
    displayResults();
  }
}

function processData() {
  let values = input.value().split(',').map(num => parseFloat(num.trim()));
  data = values.filter(value => !isNaN(value));
  data.sort((a, b) => a - b); // Sort data in ascending order

  // Clear previous buttons to prevent overlap
  upButtons.forEach(button => button.remove());
  downButtons.forEach(button => button.remove());
  upButtons = [];
  downButtons = [];

  for (let i = 0; i < data.length; i++) {
    let x = map(i, 0, data.length - 1, 50, width - 50);
    let y = height / 2;

    let upButton = createButton('↑');
    upButton.position(x - 10, y - 70);
    upButton.mousePressed(() => adjustData(i, 1));

    let downButton = createButton('↓');
    downButton.position(x - 10, y + 60);
    downButton.mousePressed(() => adjustData(i, -1));

    upButtons.push(upButton);
    downButtons.push(downButton);
  }

  showInstructions = true;
  calculateStatistics();
}

function resetSimulation() {
  data = [];
  input.value('');
  results = { mean: null, median: null, mode: null, range: null };
  upButtons.forEach(button => button.remove());
  downButtons.forEach(button => button.remove());
  upButtons = [];
  downButtons = [];
  showInstructions = false;
}

function drawInteractiveData() {
  let minData = Math.min(...data);
  let maxData = Math.max(...data);

  for (let i = 0; i < data.length; i++) {
    let x = map(i, 0, data.length - 1, 50, width - 50);
    let y = height / 2;

    let size = map(data[i], minData, maxData, 10, 30); // Scale dot size based on data

    // Draw dot
    fill(255, 100, 100);
    ellipse(x, y, size, size);

    // Draw value
    fill(255);
    text(data[i], x, y + 40);
  }
}

function adjustData(index, change) {
  data[index] += change;
  calculateStatistics();
}

function displayResults() {
  let startY = height - 70;
  let widthSegment = width / 4;
  let boxHeight = 50; // Adjusted box height for consistency

  // Uniform box sizes and text alignment for all results
  fill(119, 158, 203); rect(0, startY, widthSegment, boxHeight);
  fill(0); text(`Mean: ${results.mean}`, 10, startY + 20, widthSegment - 10);

  fill(174, 198, 207); rect(widthSegment, startY, widthSegment, boxHeight);
  fill(0); text(`Median: ${results.median}`, widthSegment + 10, startY + 20, widthSegment - 10);

  fill(255, 223, 186); rect(widthSegment * 2, startY, widthSegment, boxHeight);
  fill(0); text(`Mode: ${results.mode}`, widthSegment * 2 + 10, startY + 20, widthSegment - 10);

  fill(255, 105, 97); rect(widthSegment * 3, startY, widthSegment, boxHeight);
  fill(0); text(`Range: ${results.range}`, widthSegment * 3 + 10, startY + 20, widthSegment - 10);
}

function calculateStatistics() {
  results.mean = calculateMean(data);
  results.median = calculateMedian(data);
  results.mode = calculateMode(data);
  results.range = calculateRange(data);
}

function calculateMean(arr) {
  let sum = arr.reduce((a, b) => a + b, 0);
  return (sum / arr.length).toFixed(2);
}

function calculateMedian(arr) {
  const mid = Math.floor(arr.length / 2), nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : ((nums[mid - 1] + nums[mid]) / 2).toFixed(2);
}

function calculateMode(arr) {
  let freq = {};
  arr.forEach(num => freq[num] = (freq[num] || 0) + 1);
  let maxFreq = Math.max(...Object.values(freq));
  let modes = Object.keys(freq).filter(key => freq[key] === maxFreq);
  return modes.join(', ');
}

function calculateRange(arr) {
  let max = Math.max(...arr);
  let min = Math.min(...arr);
  return (max - min).toFixed(2);
}

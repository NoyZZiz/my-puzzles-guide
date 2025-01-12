// Updated JavaScript Logic for Troop & Resource Calculator

// Function to switch between calculators
function showTroopCalculator() {
  hideAllCalculators();
  document.getElementById('troop-calculator').classList.add('active');
}

function showResourceNeededCalculator() {
  hideAllCalculators();
  document.getElementById('resource-needed-calculator').classList.add('active');
}

function showResourceProduceCalculator() {
  hideAllCalculators();
  document.getElementById('resource-produce-calculator').classList.add('active');
}

function showSpeedupCalculator() {
  hideAllCalculators();
  document.getElementById('speedup-calculator').classList.add('active');
}

function hideAllCalculators() {
  const sections = document.querySelectorAll('.calculator-section');
  sections.forEach(section => section.classList.remove('active'));
}

// Function to update the Training Speed Buff value display
function updateBuffValue() {
  const buffSlider = document.getElementById('buff-slider');
  document.getElementById('buff-value').textContent = `${buffSlider.value}%`;
}

// Function to update the Resource Buff value display
function updateResourceBuffValue() {
  const resourceBuffSlider = document.getElementById('resource-buff');
  document.getElementById('resource-buff-value').textContent = `${resourceBuffSlider.value}%`;
}

function updateProduceResourceBuffValue() {
  const produceResourceBuffSlider = document.getElementById('produce-resource-buff');
  document.getElementById('produce-resource-buff-value').textContent = `${produceResourceBuffSlider.value}%`;
}

// Function to calculate the number of troops that can be trained with given speed-ups
function calculateTroops() {
  const trainingCap = parseInt(document.getElementById('training-cap').value) || 0;
  const runTimeHours = parseInt(document.getElementById('run-time-hours').value) || 0;
  const runTimeMinutes = parseInt(document.getElementById('run-time-minutes').value) || 0;
  const buffPercent = parseInt(document.getElementById('buff-slider').value) || 0;
  const troopMight = parseInt(document.getElementById('troop-might').value) || 45;

  const totalRunTimeMinutes = runTimeHours * 60 + runTimeMinutes;
  const adjustedRunTime = totalRunTimeMinutes * (1 + buffPercent / 100);

  const oneHourSpeedUps = parseInt(document.getElementById('1hr-speedups').value) || 0;
  const thirtyMinSpeedUps = parseInt(document.getElementById('30min-speedups').value) || 0;
  const fifteenMinSpeedUps = parseInt(document.getElementById('15min-speedups').value) || 0;
  const tenMinSpeedUps = parseInt(document.getElementById('10min-speedups').value) || 0;
  const fiveMinSpeedUps = parseInt(document.getElementById('5min-speedups').value) || 0;

  const totalMinutesFromSpeedUps =
      oneHourSpeedUps * 60 +
      thirtyMinSpeedUps * 30 +
      fifteenMinSpeedUps * 15 +
      tenMinSpeedUps * 10 +
      fiveMinSpeedUps * 5;

  const troopsTrained = Math.floor((totalMinutesFromSpeedUps / adjustedRunTime) * trainingCap);
  const totalMight = troopsTrained * troopMight;

  document.getElementById('troop-result').innerHTML = `
      <strong>You can train approximately ${formatNumberWithCommas(troopsTrained)} troops.</strong><br>
      Total Might: ${formatNumberWithCommas(totalMight)}
  `;
}

// Function to calculate resources needed to train troops
function calculateResourcesNeeded() {
  const troopCount = parseInt(document.getElementById('troop-count').value) || 0;
  const foodCost = parseInt(document.getElementById('food-cost').value) || 0;
  const woodCost = parseInt(document.getElementById('wood-cost').value) || 0;
  const ironCost = parseInt(document.getElementById('iron-cost').value) || 0;
  const goldCost = parseInt(document.getElementById('gold-cost').value) || 0;
  const resourceBuff = parseInt(document.getElementById('resource-buff').value) || 0;

  const totalFood = Math.floor(troopCount * foodCost * (1 - resourceBuff / 100));
  const totalWood = Math.floor(troopCount * woodCost * (1 - resourceBuff / 100));
  const totalIron = Math.floor(troopCount * ironCost * (1 - resourceBuff / 100));
  const totalGold = Math.floor(troopCount * goldCost * (1 - resourceBuff / 100));

  document.getElementById('resource-needed-result').innerHTML = `
      <strong>Resources Needed to Train ${formatNumberWithCommas(troopCount)} Troops:</strong><br>
      Food: ${formatNumberWithCommas(totalFood)}<br>
      Wood: ${formatNumberWithCommas(totalWood)}<br>
      Iron: ${formatNumberWithCommas(totalIron)}<br>
      Gold: ${formatNumberWithCommas(totalGold)}
  `;
}

// Function to display "Coming Soon" placeholder message
function calculateTroopsFromResources() {
  document.getElementById('resource-produce-result').innerHTML = `
      <strong>This feature is coming soon! Stay tuned for updates.</strong>
  `;
}

// Updated Speed-Up Calculation Logic
function calculateSpeedUps() {
  const targetTroops = parseInt(document.getElementById('target-troop-count').value) || 0;
  const trainingCapacity = parseInt(document.getElementById('current-training-cap').value) || 0;
  const batchTimeHours = parseInt(document.getElementById('batch-time-hours').value) || 0;
  const batchTimeMinutes = parseInt(document.getElementById('batch-time-minutes').value) || 0;

  if (targetTroops <= 0 || trainingCapacity <= 0 || (batchTimeHours <= 0 && batchTimeMinutes <= 0)) {
    document.getElementById('speedup-result').innerHTML = 'Please enter valid numbers for all fields.';
    return;
  }

  // Calculate total time per batch in minutes
  const batchTimeInMinutes = batchTimeHours * 60 + batchTimeMinutes;

  // Calculate time per troop
  const timePerTroop = batchTimeInMinutes / trainingCapacity;

  // Calculate total time required in minutes
  const totalTimeInMinutes = targetTroops * timePerTroop;

  // Convert total time to hours and minutes
  const totalTimeInHours = Math.floor(totalTimeInMinutes / 60);
  const remainingMinutes = totalTimeInMinutes % 60;

  // Speed-up calculations
  const speedUps1Hour = totalTimeInHours;
  let remaining = remainingMinutes;

  const speedUps30Min = Math.floor(remaining / 30);
  remaining %= 30;

  const speedUps15Min = Math.floor(remaining / 15);
  remaining %= 15;

  const speedUps10Min = Math.floor(remaining / 10);
  remaining %= 10;

  const speedUps5Min = Math.floor(remaining / 5);
  remaining %= 5;

  const speedUps1Min = remaining;

  document.getElementById('speedup-result').innerHTML = `
    To train <strong>${targetTroops}</strong> troops, you need approximately:<br>
    <strong>${speedUps1Hour}</strong> x 1-Hour Speed-Ups<br>
    <strong>${speedUps30Min}</strong> x 30-Minute Speed-Ups<br>
    <strong>${speedUps15Min}</strong> x 15-Minute Speed-Ups<br>
    <strong>${speedUps10Min}</strong> x 10-Minute Speed-Ups<br>
    <strong>${speedUps5Min}</strong> x 5-Minute Speed-Ups<br>
    <strong>${speedUps1Min}</strong> x 1-Minute Speed-Ups
  `;
}

// Utility function to format numbers with commas
function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

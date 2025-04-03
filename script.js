const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store data in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve data from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Clear local storage
function clearStorage() {
  localStorage.clear();
}

// Generate SHA256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate SHA256 hash for a random number & store it
async function getSHA256Hash() {
  let cachedHash = retrieve('sha256');
  let cachedNumber = retrieve('originalNumber');

  if (cachedHash && cachedNumber) {
    return cachedHash;
  }

  const randomNum = getRandomArbitrary(MIN, MAX).toString();
  const hash = await sha256(randomNum);

  store('sha256', hash);
  store('originalNumber', randomNum); // Store the original number

  return hash;
}

// Display SHA256 hash
async function main() {
  sha256HashView.textContent = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.textContent = hash;
}

// Check user's input against stored hash
async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.textContent = '💡 Enter a 3-digit number';
    resultView.classList.remove('hidden');
    return;
  }

  const originalNumber = retrieve('originalNumber');

  if (pin === originalNumber) {
    resultView.textContent = '🎉 Success! You cracked the hash!';
    resultView.classList.add('success');
  } else {
    resultView.textContent = '❌ Failed! Try again.';
  }
  resultView.classList.remove('hidden');
}

// Ensure pinInput only accepts 3-digit numbers
pinInput.addEventListener('input', (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, '').slice(0, 3);
});

// Attach test function to the button
document.getElementById('check').addEventListener('click', test);

// Run main function to show SHA256 hash
main();
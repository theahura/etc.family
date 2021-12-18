// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDY__Yde45aRb0xNKxPdPLvpoKBf-Lhc0g',
  authDomain: 'etc-clock-2.firebaseapp.com',
  databaseURL: 'https://etc-clock-2-default-rtdb.firebaseio.com',
  projectId: 'etc-clock-2',
  storageBucket: 'etc-clock-2.appspot.com',
  messagingSenderId: '131379690038',
  appId: '1:131379690038:web:c2d180c02832b05370f697',
  measurementId: 'G-SLQD9MFGKJ',
};

firebase.initializeApp(config);
const database = firebase.database();

//Listener
let currentTimerId = null;
let listOfResets = [];

const updateResets = (resetList) => {
  if (!resetList) return;

  const ul = document.getElementById('PreviousResets');
  ul.innerHTML = '';
  for (const reset of resetList) {
    const li = document.createElement('li');
    li.innerText = reset;
    ul.appendChild(li);
  }
};

database.ref().on('value', function (snapshot) {
  const stamp = snapshot.val().startstamp;
  listOfResets = snapshot.val().resetList;

  console.log('Got timestamp: ', stamp);
  updateResets(listOfResets);

  // Update the count down every 1 second
  currentTimerId = setInterval(function () {
    // Find the distance between now and the count down date
    const distance = new Date().getTime() - stamp;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="Time".
    document.getElementById('Time').innerHTML =
      days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(currentTimerId);
      document.getElementById('Time').innerHTML = 'EXPIRED';
    }
  }, 1000);
});

$('#Reset').on('click', function () {
  const date = new Date();
  const newStamp = Date.now();
  const currentTimeLeft = document.getElementById('Time').innerText;
  console.log('Setting timestamp to: ', newStamp);
  clearInterval(currentTimerId);
  listOfResets = listOfResets ? listOfResets : [];
  listOfResets.unshift(`${date.toString()}: ${currentTimeLeft}`);
  database.ref().set({
    startstamp: newStamp,
    resetList: listOfResets,
  });
});

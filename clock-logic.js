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

// Core logic. Increase clock by one second in a settimeout. Track previous
// resets. Update reset counts on click.
//
// All state is global. Mostly we just care about the resets and the charts.
let currentTimerId = null;
let listOfResets = []; // Strings of format {data: count}
let charts = []; // [Chart.js charts, config gen fn]

const updateDom = () => {
  if (!listOfResets) return;

  const ul = document.getElementById('PreviousResets');
  ul.innerHTML = '';
  for (const reset of listOfResets) {
    const li = document.createElement('li');
    li.innerText = reset;
    ul.appendChild(li);
  }

  for (const [chart, configGen] of charts) {
    const config = configGen();
    chart.data = config.data;
    chart.update('none');
  }
};

database.ref().on('value', function (snapshot) {
  const stamp = snapshot.val().startstamp;
  listOfResets = snapshot.val().resetList;

  console.log('Got timestamp: ', stamp);
  clearInterval(currentTimerId);

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

    // Update the dom given the new list of resets.
    updateDom();
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

// Over time chart logic.
const getOverTimeConfig = () => {
  return {
    type: 'line',
    data: {
      labels: listOfResets.map((str) =>
        Date.parse(str.substring(0, str.lastIndexOf(':'))),
      ),
      datasets: [
        {
          label: 'Resets Over Time',
          data: listOfResets.map((str, i) => listOfResets.length - i),
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour',
          },
        },
      },
    },
  };
};

const ctx = document.getElementById('rateOverTime').getContext('2d');
charts.push([new Chart(ctx, getOverTimeConfig()), getOverTimeConfig]);

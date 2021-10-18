// Initialize Firebase. Ignore this config stuff.
const config = {
  apiKey: 'AIzaSyCgPq9lDCdVTgut6rUQwm2JDYRYSfyEezY',
  authDomain: 'etc-clock-916a3.firebaseapp.com',
  databaseURL: 'https://etc-clock-916a3-default-rtdb.firebaseio.com/',
  projectId: 'etc-clock-916a3',
  storageBucket: 'etc-clock-916a3.appspot.com',
  messagingSenderId: '550414492244',
  appId: '1:550414492244:web:86dfe88c3ad0df44bf43c1',
};

firebase.initializeApp(config);
const database = firebase.database();

// Whenever there is a new value from the server, update the numbers on screen.
database.ref().on('value', function (snapshot) {
  const teamOneCount = snapshot.val().teamOneCount
    ? snapshot.val().teamOneCount
    : 0;
  const teamTwoCount = snapshot.val().teamTwoCount
    ? snapshot.val().teamTwoCount
    : 0;

  document.getElementById('TeamOneCount').innerHTML = 'Count: ' + teamOneCount;
  document.getElementById('TeamTwoCount').innerHTML = 'Count: ' + teamTwoCount;
});

// When there is a click from the teamone button, send a message to the server.
$('#TeamOneButton').on('click', function () {
  database.ref('teamOneCount').set(firebase.database.ServerValue.increment(1));
});

// Ditto on the teamtwo button.
$('#TeamTwoButton').on('click', function () {
  database.ref('teamTwoCount').set(firebase.database.ServerValue.increment(1));
});

// Reset. Self explanatory.
$('#Reset').on('click', function () {
  database.ref('teamOneCount').set(0);
  database.ref('teamTwoCount').set(0);
});

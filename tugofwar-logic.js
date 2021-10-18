// Initialize Firebase
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
  const teamOneCount = snapshot.val().teamOneCount
    ? snapshot.val().teamOneCount
    : 0;
  const teamTwoCount = snapshot.val().teamTwoCount
    ? snapshot.val().teamTwoCount
    : 0;

  document.getElementById('TeamOneCount').innerHTML = 'Count: ' + teamOneCount;
  document.getElementById('TeamTwoCount').innerHTML = 'Count: ' + teamTwoCount;
});

$('#TeamOneButton').on('click', function () {
  database.ref('teamOneCount').set(firebase.database.ServerValue.increment(1));
});

$('#TeamTwoButton').on('click', function () {
  database.ref('teamTwoCount').set(firebase.database.ServerValue.increment(1));
});

$('#Reset').on('click', function () {
  database.ref('teamOneCount').set(0);
  database.ref('teamTwoCount').set(0);
});

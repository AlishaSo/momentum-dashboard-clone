import { UNSPLASH_API_KEY, OPEN_WEATHER_API_KEY } from './apikey.js';

const body = document.body;
const photographerP = document.querySelector('.photographer');
const weatherDiv = document.querySelector('.weather');
const timeEl = document.querySelector('.time');
const quoteP = document.querySelector('#quote');
const placeholderQuote = 'If you get shown a problem, but have no idea how to control it, then you just decide to get used to the problem.';
const placeholderQuoteSource = 'Sorry to Bother You (2018)';
const focusTaskDiv = document.querySelector('.focus-task-div');
const focusTaskKey = 'focus-task';
const focusTaskInput = document.querySelector('#focus-task');
const taskOptionsDiv = document.querySelector('.task-options');
const optionsBtn = document.createElement('button');
const newTaskBtn = document.querySelector('#new-task');
const editTaskTextBtn = document.querySelector('#edit-task');
const deleteTaskBtn = document.querySelector('#delete-task');
const startTimerBtn = document.querySelector('#start-timer');
const pomodoroDiv = document.createElement('div');
const timerLabel = document.createElement('p');
const startBtn = document.createElement('button');
const taskCheck = document.createElement('input');
const goBackBtn = document.createElement('button');
let clockInterval;
let timeout;

getCurrentTime();
resetInput();

focusTaskInput.addEventListener('keyup', e => getFocusTask(e, focusTaskInput.value));

newTaskBtn.addEventListener('click', () => {
  localStorage.removeItem('focus-task');
  createInputField();
  newTaskBtn.style.display = 'none';
  editTaskTextBtn.style.display = 'block';
});

editTaskTextBtn.addEventListener('click', editTaskText);

deleteTaskBtn.addEventListener('click', () => {
  deleteTask();
  newTaskBtn.style.display = 'none';
  editTaskTextBtn.style.display = 'block';
});

startTimerBtn.addEventListener('click', () => {
  goBackBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
  goBackBtn.classList.add('go-back-btn');
  goBackBtn.classList.add('btn');

  pomodoroDiv.classList.add('pomodoro-div');

  timerLabel.textContent = 'Focus time!';
  timerLabel.setAttribute('id', 'timer-label');

  startBtn.textContent = 'Start';
  startBtn.classList.add('btn');
  startBtn.classList.add('start-timer-btn');

  document.querySelector('main').appendChild(pomodoroDiv);
  document.querySelector('.pomodoro-div').appendChild(goBackBtn);
  document.querySelector('.pomodoro-div').appendChild(timerLabel);
  document.querySelector('.pomodoro-div').appendChild(startBtn);

  timeEl.textContent = '25:00';

  weatherDiv.style.visibility = 'hidden';
  quoteP.style.display = 'none';
  focusTaskDiv.style.display = 'none';
  taskOptionsDiv.classList.remove('show');
  
  clearInterval(clockInterval);
});

startBtn.addEventListener('click', startTimer);

goBackBtn.addEventListener('click', () => {
  clearInterval(timeout);
  document.querySelector('.pomodoro-div').removeChild(goBackBtn);
  document.querySelector('.pomodoro-div').removeChild(timerLabel);
  document.querySelector('.pomodoro-div').removeChild(startBtn);
  document.querySelector('main').removeChild(pomodoroDiv);
  weatherDiv.style.visibility = 'visible';
  quoteP.style.display = 'block';
  focusTaskDiv.style.display = 'block';

  getCurrentTime();
  clockInterval = setInterval(getCurrentTime, 1000);
});

//Access Unsplash API to get a random photo
fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=experimental&client_id=${UNSPLASH_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    if(!data.errors) {
    setBgImg(data.urls.full, data.user.username, data.user.name);
    }
    else {
      throw Error('There\'s been an error with the fetch request to the Unsplash API');
    }
  })
  .catch(() => {
    alert('A new image could not be retrieved at this time');
    setBgImg(placeholderImgUrl, placeholderImgPhotographerProfile, placeholderImgPhotographer);
  });

//Access Geolocation API to get user's coordinates
navigator.geolocation.getCurrentPosition(position => {
  //Access OpenWeather API to get the weather information
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`)
    .then(response => {
      if (!response.ok) { //Check if fetch response is successful
        throw Error("Weather data not available")
      }
      return response.json();
    })
    .then(data => {
      //Save the link to the icon image to a variable
      const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      //Add the icon for the current weather to the weather div
      weatherDiv.innerHTML = `
        <img id='weather-icon' src='${iconUrl}'/>
        <p class='weather-temp'>${Math.round(data.main.temp)}°</p>
        <p class='weather-city'>${data.name}</p>
      `;
    })
    .catch(error => console.error(error));
});

function getCurrentTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString("en-GB", {timeStyle: "short"});
}

clockInterval = setInterval(getCurrentTime, 1000);

//Access the Quotable API to get a random quote that is < 70 characters long
fetch('https://api.quotable.io/random?maxLength=100')
  .then(response => response.json())
  .then(data => {
    if(data.statusCode !== 404) { //Make sure that the fetch response was successful
      //Set the paragraph with the id of quote to the quote received from the API, along with the author's name
      setQuote(data.content, data.author);
    }
    else {
      //If the fetch response returned the error code 404, throw an error
      throw Error('There\'s been an error with the fetch request to the Quotable API');
    }
  })
  .catch(() => {
    alert('A new quote could not be retrieved at this time');  //If there was an error retreiving the quote, let the user know
    //Add this quote to the <p> instead
    setQuote(placeholderQuote, placeholderQuoteSource);
  });

function resetInput() {
  focusTaskInput.value = '';
}

function setBgImg(img, username, name) {
  body.style.backgroundImage = `url(${img})`; //set the background to the image
  photographerP.innerHTML = `By: <a href='https://unsplash.com/@${username}' target='_blank'>${name}</a> on <a href='https://unsplash.com/?utm_source=your_app_name&utm_medium=referral' target='_blank'>Unsplash</a>`;
}

function setQuote(quote, source) {
  quoteP.innerHTML = `"${quote}"
    <br>
    - ${source}
  `;
}

function displayFocusTask() {
  if(localStorage.getItem(focusTaskKey)) {
    optionsBtn.classList.add('options-btn');
    optionsBtn.classList.add('btn');
    optionsBtn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';

    taskCheck.setAttribute('type', 'checkbox');
    taskCheck.setAttribute('name', 'task-complete');
    taskCheck.setAttribute('id', 'focus-task-checkbox');

    focusTaskDiv.innerHTML = `
      <div class='focus-check'>
        <h2 id='today-focus'>TODAY</h2>
        <div class='focus-task-dropdown'>
          <label for='focus-task'>${localStorage.getItem(focusTaskKey)}</label>
        </div>
      </div>
    `;
    document.querySelector('.focus-task-dropdown').prepend(taskCheck);
    document.querySelector('.focus-task-dropdown').appendChild(optionsBtn);

    document.querySelector('#focus-task-checkbox').addEventListener('change', e => {
      if(e.currentTarget.checked) {
        newTaskBtn.style.display = 'block';
        editTaskTextBtn.style.display = 'none';
      }
      else {
        newTaskBtn.style.display = 'none';
        editTaskTextBtn.style.display = 'block';
      }
    });

    optionsBtn.addEventListener('click', toggleOptions);
  }
}


function getFocusTask(event, value) {
  if(event.key === 'Enter' || event.keyCode === 13) {
    localStorage.setItem('focus-task', value);
    displayFocusTask();
  }
}

function toggleOptions() {
  taskOptionsDiv.classList.toggle('show');
}

function editTaskText() {
  createInputField();
}

function deleteTask() {
  localStorage.removeItem(focusTaskKey);
  createInputField();
}

function createInputField() {
  taskOptionsDiv.classList.remove('show');
  focusTaskDiv.innerHTML = `
    <label for='focus-task'>Today's Most Important Task is:</label>
  `;
  const inputField = document.createElement('input');
  inputField.setAttribute('id', 'focus-task');
  inputField.type = 'text';
  inputField.name = 'focus-task';
  if(localStorage.getItem(focusTaskKey))
    inputField.value = localStorage.getItem(focusTaskKey);
  else
  inputField.value = '';
  inputField.addEventListener('keyup', e => getFocusTask(e, inputField.value));
  focusTaskDiv.appendChild(inputField);
}

function startTimer() {
  timeEl.textContent = '24:59';
  const countDownDate = new Date().getTime() + 25 * 60 * 1000;
  
  timeout = setInterval(() => {
    let now = new Date().getTime();
    let distance = countDownDate - now;
    let minutes = addLeadingZero(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    let seconds = addLeadingZero(Math.floor((distance % (1000 * 60)) / 1000));
    timeEl.textContent = minutes + ':' + seconds;
    
    if(distance <= 0) {
      clearInterval(timeout);
    }
  }, 1000);
}

function addLeadingZero(number) {
  if(number < 10) {
    number = "0" + number;
  }
    return number;
}

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
  displayFocusTask();
}
//once a focus task has been created, it'll display the task when you open a new tab
// chrome.tabs.onCreated.addListener(displayFocusTask());

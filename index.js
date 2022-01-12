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

getCurrentTime();
resetInput();

//Access Unsplash API to get a random photo
// fetch('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=experimental')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data)
//     if(!data.errors) {
//     setBgImg(data.urls.full, data.user.username, data.user.name);
//     }
//     else {
//       throw Error('There\'s been an error with the fetch request to the Unsplash API');
//     }
//   })
//   .catch(() => {
//     alert('A new image could not be retrieved at this time');
//     setBgImg(placeholderImgUrl, placeholderImgPhotographerProfile, placeholderImgPhotographer);
//   });

//Access Geolocation API to get user's coordinates
// navigator.geolocation.getCurrentPosition(position => {
//   //Access OpenWeather API to get the weather information
//   fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial`)
//     .then(response => {
//       if (!response.ok) { //Check if fetch response is successful
//         throw Error("Weather data not available")
//       }
//       return response.json();
//     })
//     .then(data => {
//       console.log(data)
//       //Save the link to the icon image to a variable
//       const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
//       //Add the icon for the current weather to the weather div
//       weatherDiv.innerHTML = `
//         <img id='weather-icon' src='${iconUrl}'/>
//         <p class='weather-temp'>${Math.round(data.main.temp)}°</p>
//         <p class='weather-city'>${data.name}</p>
//       `;
//     })
//     .catch(error => console.error(error));
// });

function getCurrentTime() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString("en-GB", {timeStyle: "short"});
}

setInterval(getCurrentTime, 1000);

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

  focusTaskInput.addEventListener('keyup', e => {
    if(e.key === 'Enter' || e.keyCode === 13) {
      localStorage.setItem('focus-task', focusTaskInput.value);
      focusTaskDiv.innerHTML = `
        <div class='focus-check'>
          <h2 id='today-focus'>TODAY</h2>
          <input type='checkbox' id='focus-task' name='task-complete'/> <label for='focus-task'>${focusTaskInput.value}</label>
        </div>
      `;
    }
    index++;
  });

  function resetInput() {
    focusTaskInput.value = '';
  }

  function setBgImg(img, username, name) {
    //body.style.backgroundImage = `url(${img})`; //set the background to the image
    //photographerP.innerHTML = `By: <a href='https://unsplash.com/@${username}' target='_blank'>${name}</a> on <a href='https://unsplash.com/?utm_source=your_app_name&utm_medium=referral' target='_blank'>Unsplash</a>`;
  }

  function setQuote(quote, source) {
    quoteP.innerHTML = `"${quote}"
    <br>
    - ${source}`;
  }

  function displayFocusTask() {
    if(localStorage.getItem(focusTaskKey)) {
      focusTaskDiv.innerHTML = `
        <div class='focus-check'>
          <h2 id='today-focus'>TODAY</h2>
          <input type='checkbox' id='focus-task' name='task-complete'/> <label for='focus-task'>${localStorage.getItem(focusTaskKey)}</label>
        </div>
      `;
    }
  }

  if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    displayFocusTask();
  }

  chrome.tabs.onCreated.addListener(displayFocusTask())
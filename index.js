const body = document.body;
const authorP = document.querySelector('#author');

//access Unsplash API to get a random photo
fetch('https://api.unsplash.com/photos/random?orientation=landscape&query=experimental&client_id=FngrTy9r1X_CbbUaxsie0ll_C4W_xqux07X6JxzHLQc&')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        body.style.backgroundImage = `url(${data.urls.full})`; //set the background to the image
        authorP.innerHTML = `By: ${data.user.name} on <a class='unsplash-attribution' href='https://unsplash.com/?utm_source=your_app_name&utm_medium=referral'>Unsplash</a>`;
      });
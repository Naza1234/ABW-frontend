const apiUrl = 'https://abw-server.onrender.com'
const winUrl="https://graice.space"

var userId = localStorage.getItem("GBWebUserId")


// Get the current URL
const currentURL = window.location.search;
// get url params
 const searchParams= new URLSearchParams(currentURL)
 const itemId=searchParams.get("id")



// Function to fetch first API
function fetchFirstAPI(itemId) {
  return fetch(apiUrl + `/post/post/${itemId}`)
    .then((res) => res.json())
    .then((data) => {
      return data; // Return the data for chaining promises if needed
    });
}

// Function to fetch second API
function fetchSecondAPI(itemId) {
  return fetch(apiUrl + `/mediaPhoto/mediaPhotos/${itemId}`)
    .then((res) => res.json())
    .then((data) => {
      return data; // Return the data for chaining promises if needed
    });
}

// Function to fetch third API
function fetchThirdAPI(itemId) {
  return fetch(apiUrl + `/mediaAudioVideo/mediaAudioVideo/${itemId}`)
    .then((res) => res.json())
    .then((data) => {
      
      return data; // Return the data for chaining promises if needed
    });
}

// Function to be called when all API calls are done
function allAPICallsDone() {
  console.log("Yes");
}

// Call the fetch functions and wait for all promises to resolve
Promise.all([
  fetchFirstAPI(itemId),
  fetchSecondAPI(itemId),
  fetchThirdAPI(itemId)
])
.then((responses) => {
 
  loadData(responses[0],responses[1],responses[2])
  document.getElementsByClassName("loader_in")[0].classList.add("hid")
  // Call the function indicating that all API calls are done
  allAPICallsDone();
})
.catch((error) => {
  console.error("Error occurred:", error);
});

function createMediaElement(encodedData) {
 var  mediaElement
  // Add appropriate content based on whether it's audio or video
  if (encodedData.startsWith('data:audio')) {
    
    mediaElement=`
    <div class="audio-container" id="audio-container">
        <input type="range" id="progress" class="progress"  min="0" value="0" step="1">
    
         <audio src="${encodedData}" id="audio"></audio>
   
         <div class="navigation">
           <button id="prev" class="action-btn">
             <i class="fas fa-backward"></i>
           </button>
           <button id="play" class="action-btn action-btn-big">
             <i class="fas fa-play"></i>
           </button>
           <button id="next" class="action-btn">
             <i class="fas fa-forward"></i>
           </button>
         </div>
       </div>

    `
    
  } else if (encodedData.startsWith('data:video')) {
     mediaElement=`
     <video src="${encodedData}" controls>

     </video> 
    
     
     `
  } else {
    // Unsupported media type
    console.error('Unsupported media type');
    return null;
  }

  return mediaElement;
}

  function loadData(postData,images,media){
     var container = document.getElementById("body")
     var html = `
     <h1>
     ${postData.Title}
     </h1>

 <section class="images_audio">
     <section class="scroll">
         <ul >
             <li class="img">
                 <img src="${images[0].MediaUrl}" alt="">
             </li>
             <li class="img">
                 <img src="${images[1].MediaUrl}" alt="">
             </li>
         </ul>
     </section>
     <div class="media img">
     
     ${media != null?createMediaElement(media.MediaUrl):""}
     </div>
 </section>

 <section class="text_comment">
     <section class="textarea">
     ${postData.WriteUp}
        </section>
     <section class="comment_section">
     <div class="icon">
     <img src="./assets/image/comment.png" alt="">
     <img src="./assets/image/heart (1).png" alt="" onclick="like()" class="like_img">
     <p class="like_no">
     -
     </p>
  </div>
         <section class="comment">
             <h1>
                 comments
             </h1>
             <ul class="comments_list">
               
             </ul>
             <form class="send_comment">
               <input type="text">
               <button>
                 <img src="./assets/image/send (1).png" alt="">
               </button>
             </form>
         </section>
     </section>
 </section>
     `

     container.innerHTML=html
  }

  function checkAudioAvailability() {
    // Check if the audio element is present in the DOM
    const audioElementExists = document.getElementById('audio') !== null;
  
    // Log "it is available" if the audio element is present
    if (audioElementExists) {
      loadMedia()
    }
  }
  
  // Run the check every 5 seconds
  setInterval(checkAudioAvailability, 5000);


function loadMedia(){
  const audioContainer = document.getElementById('audio-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');






/**
 * Play audio file
 */
function playFile(){
  audioContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  
  audio.play();
}
/**
 * Pauses audio file
 */
function pauseFile(){
  audioContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}


function rewind() {
    audio.currentTime -= 10; // Rewind by 10 seconds
  }
  
  function fastForward() {
    audio.currentTime += 10; // Fast-forward by 10 seconds
  }



  function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent;// Set the maximum value of the progress input to the audio duration
  }
  
  /**
   * Fast forward or rewind the audio to where the progress button was clicked
   */
  function handleProgressClick(event) {
    const clickedTime = event.offsetX / progress.offsetWidth * audio.duration;
    audio.currentTime = clickedTime;
  }
  
  // Set progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  }


/* Event Listeners */
playBtn.addEventListener('click', () => {
  (audioContainer.classList.contains('play')) 
    ? pauseFile() : playFile();
});

 

// previous and next audio files
prevBtn.addEventListener('click', rewind);
nextBtn.addEventListener('click', fastForward);


audio.addEventListener('timeupdate', updateProgress);
progress.addEventListener('click', setProgress);

document.body.addEventListener('keydown', function(event){
  if(event.code == 'Space'){
    (audioContainer.classList.contains('play')) 
      ? pauseFile() : playFile();
  }
});


}


function deleteItem(){
  fetch(`${apiUrl}/post/post/${itemId}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    // Add any additional headers if needed
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
   window.location=`${winUrl}/admineHome.html`
  })
  .catch(error => {
    console.error('Error during delete request:', error);
  });

}





var userId = localStorage.getItem("GBWebUserId")


fetch(`${apiUrl}/user/user/${userId}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (!data.isAdmin) {
      window.location=winUrl
    }
})
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
  });


if (!userId) {
    window.location=winUrl
}

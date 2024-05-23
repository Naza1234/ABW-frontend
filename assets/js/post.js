const apiUrl = 'https://abw-server.onrender.com'
const winUrl="https://graice.space"


var userId = localStorage.getItem("GBWebUserId")

// Get the current URL
const currentURL = window.location.search;
// get url params
 const searchParams= new URLSearchParams(currentURL)
 const itemId=searchParams.get("id")

 console.log(itemId);

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



// Call the fetch functions and wait for all promises to resolve
Promise.all([
  fetchFirstAPI(itemId),
  fetchSecondAPI(itemId),
  fetchThirdAPI(itemId)
])
.then((responses) => {
  loadData(responses[0],responses[1],responses[2])
  document.getElementsByClassName("loader_in")[0].classList.add("hid")

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
             <ul  class="comments_list">
                
             </ul>
             <form class="send_comment">
               <input type="text" required>
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











fetch(apiUrl + `/post/post`)
.then((res) => res.json())
.then((data) => {
    data.reverse()
  if (Array.isArray(data) && data.length >= 3) {
    // Get the most recent 3 posts
    const mostRecentPosts = data.slice(0, 3);
    for (let i = 0; i < mostRecentPosts.length; i++) {
        const element = mostRecentPosts[i];
        if (i===0) {
            document.getElementsByClassName("todays_post_list")[0].classList.add("has-1")
        }
        if (i===1) {
            document.getElementsByClassName("todays_post_list")[0].classList.add("has-2")
        }
        if (i===2) {
            document.getElementsByClassName("todays_post_list")[0].classList.add("has-3")
        }
        populateTodayPost(element)
    }
    // console.log(element);
  }
  
  seeDetails()
})
.catch((error) => {
  console.error('Error fetching recent posts:', error);
});

var images=[]
 
fetch(apiUrl + `/mediaPhoto/mediaPhotos`)
.then((res)=>res.json())
.then((data)=>{
    data.reverse()
    images=data
    runImage()
})

function runImage(){
    for (let i = 0; i < images.length; i++) {
     const element = images[i];
     loadImage(element)
    }
}

function loadImage(data){
    var items=document.querySelectorAll("ul.blog-post li")
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        var id=element.getElementsByClassName("hid")[0].innerHTML.trim()
        if (id === data.BlogId) {
            element.getElementsByClassName("cover")[0].src=data.MediaUrl
        }
    }
}


function formatDateTime(dateTimeString) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dateTime = new Date(dateTimeString);

    const dayOfWeek = days[dateTime.getUTCDay()];
    const dayOfMonth = dateTime.getUTCDate();
    const month = months[dateTime.getUTCMonth()];
    const year = dateTime.getUTCFullYear();

    return `${dayOfWeek} , ${dayOfMonth} ${month} ${year}`;
}

function extractAndSummarizeText(htmlContent) {
    // Extract text from HTML using regex
    const extractedText = htmlContent.replace(/<[^>]*>/g, '');

    // Log extracted text
    

    // Generate summary (first 100 characters)
    const summary = extractedText.substring(0, 2000) + '...';

    // Log and return summary
   
    return summary;
}

function populateTodayPost(data){
  var container = document.getElementsByClassName("todays_post_list")[0]
  var html=`
  <li class="item">
  <h6 class="hid">${data._id}</h6>
  <h6 class="hid">${data.Cart}</h6>
  <div class="img">
      <img src="" alt="" class="cover">
  </div>
  <div class="dit">
      <h5>${formatDateTime(data.createdAt)}</h5>
      <h2><strong>${data.Title}</strong><img src="./assets/image/Icon wrap.png" alt="" class="expand"></h2>
      <p> ${extractAndSummarizeText(data.WriteUp)}</p>
  </div>
  </li>
  `
  container.insertAdjacentHTML("beforeend",html)
}




function seeDetails(){
    var items = document.querySelectorAll(".blog-post li");
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        const elementId=element.getElementsByClassName("hid")[0].innerHTML.trim()
        element.getElementsByClassName("expand")[0].addEventListener("click",()=>{
            window.location=`${winUrl}/post.html?id=${elementId}`
        })
    }
}










fetch(`${apiUrl}/user/user/${userId}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data.isAdmin) {
        var html = '<a href="./admineHome.html"><li>Admin page</li></a>';
        document.getElementsByClassName("nav")[0].insertAdjacentHTML("beforeend", html);
    }
})
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
  });















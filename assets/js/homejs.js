console.log("we are in");

const apiUrl = 'https://abw-server.onrender.com'
const winUrl="https://graice.space"

const items= [];
var userId = localStorage.getItem("GBWebUserId")

fetch(apiUrl + `/post/post`)
.then((res) => res.json())
.then((data) => {
    data.reverse()
   for (let i = 0; i < data.length; i++) {
    const element = data[i];
    items.push(element)
    if (element.Cart==="true") {
        populateSponsoredPost(element)
    }
    if (i === data.length-1) {
        logEveryFour();
        console.log("yes");
        // console.log(items);
    }
   }


   document.getElementsByClassName("loader_in")[0].classList.add("hid")
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
  checkUser()
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



function populateSponsoredPost(data){
  var container = document.getElementsByClassName("sponsored-post-list")[0]
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


var pageNo = 6;  // Number of items per page
var pageNos = 0;
var pageStart = 0;
var pageEnd = pageNo;
// var items = [...];  // Assuming 'items' is an array of item objects

function logEveryFour() {
    const container = document.getElementsByClassName("page_numbers")[0];
    container.innerHTML = '';  // Clear existing page numbers

    for (let i = 1; i <= items.length; i++) {
        if (i % pageNo === 0 || i === items.length) {
            pageNos++;
            const html = `<p class="page">${pageNos}</p>`;
            container.insertAdjacentHTML("beforeend", html);
        }
    }

    loadItems();
    adjustPageNumbers();
    buttonClicked();
}

function adjustPageNumbers() {
    const pageNumbersContainer = document.querySelector('.page_numbers');
    const pageElements = pageNumbersContainer.querySelectorAll('.page');
    const pageCount = pageElements.length;

    if (pageCount > 4) {
        // Ensure the active element is within the first 3 displayed pages
        let activeIndex = -1;
        for (let i = 0; i < pageElements.length; i++) {
            if (pageElements[i].classList.contains("active")) {
                activeIndex = i;
                break;
            }
        }

        if (activeIndex > 2) {
            // Shift page numbers to the left
            for (let i = 0; i < activeIndex - 2; i++) {
                pageElements[i].remove();
            }

            // Add ellipsis if necessary
            if (pageCount - (activeIndex - 2) > 4) {
                const ellipsis = document.createElement('p');
                ellipsis.classList.add('page');
                ellipsis.textContent = '...';
                const thirdElement = pageElements[2];
                pageNumbersContainer.insertBefore(ellipsis, thirdElement.nextSibling);
            }
        }
    }
}

function buttonClicked() {
    const pageNumbersContainer = document.querySelector('.page_numbers');
    const pageElements = pageNumbersContainer.querySelectorAll('.page');

    if (pageElements.length > 0) {
        pageElements[0].classList.add("active");
    }

    pageElements.forEach((element, index) => {
        element.addEventListener("click", () => {
            const innerNo = parseInt(element.innerHTML.trim());
            if (isNaN(innerNo)) {
                return;
            }

            pageStart = (innerNo * pageNo) - pageNo;
            pageEnd = pageStart + pageNo;

            pageElements.forEach(el => el.classList.remove("active"));
            element.classList.add("active");
            loadItems();
        });
    });
}

function loadItems() {
    const container = document.getElementsByClassName("other-blog-post")[0];
    container.innerHTML = "";

    for (let i = pageStart; i < pageEnd && i < items.length; i++) {
        const element = items[i];
        const  html = `
        <li class="item">
            <h6 class="hid">${element._id}</h6>
            <h6 class="hid">${element.Cart}</h6>
            <div class="img">
                <img src="" alt="" class="cover">
            </div>
            <div class="dit">
                <h5>${formatDateTime(element.createdAt)}</h5>
                <h2><strong>${element.Title}</strong><img src="./assets/image/Icon wrap.png" alt="" class="expand"></h2>
                <p>${extractAndSummarizeText(element.WriteUp)}</p>
            </div>
        </li>`;
        container.insertAdjacentHTML("beforeend", html);
    }
}

function nextPage() {
    const pageNumbersContainer = document.querySelector('.page_numbers');
    const pageElements = pageNumbersContainer.querySelectorAll('.page');

    let activeIndex = -1;

    // Find the currently active element
    for (let i = 0; i < pageElements.length; i++) {
        if (pageElements[i].classList.contains("active")) {
            activeIndex = i;
            break;
        }
    }

    // If an active element is found and it's not the last one
    if (activeIndex !== -1 && activeIndex < pageElements.length - 1) {
        // Remove "active" class from all elements
        pageElements.forEach(element => element.classList.remove("active"));

        // Add "active" class to the next element
        pageElements[activeIndex + 1].classList.add("active");

        // Get the inner number of the new active element
        const innerNo = parseInt(pageElements[activeIndex + 1].innerHTML.trim());

        // Check if innerNo is a valid number
        if (!isNaN(innerNo)) {
            pageStart = (innerNo * pageNo) - pageNo;
            pageEnd = pageStart + pageNo;

            // Call the function to handle the button click action
            loadItems();
            // adjustPageNumbers();
        }
    }
}

function previousPage() {
    const pageNumbersContainer = document.querySelector('.page_numbers');
    const pageElements = pageNumbersContainer.querySelectorAll('.page');

    let activeIndex = -1;

    // Find the currently active element
    for (let i = 0; i < pageElements.length; i++) {
        if (pageElements[i].classList.contains("active")) {
            activeIndex = i;
            break;
        }
    }

    // If an active element is found and it's not the first one
    if (activeIndex > 0) {
        // Remove "active" class from all elements
        pageElements.forEach(element => element.classList.remove("active"));

        // Add "active" class to the previous element
        pageElements[activeIndex - 1].classList.add("active");

        // Get the inner number of the new active element
        const innerNo = parseInt(pageElements[activeIndex - 1].innerHTML.trim());

        // Check if innerNo is a valid number
        if (!isNaN(innerNo)) {
            pageStart = (innerNo * pageNo) - pageNo;
            pageEnd = pageStart + pageNo;

            // // Shift page numbers to the right if necessary
            // if (activeIndex >= 3) {
            //     // Remove ellipsis if it exists
            //     const ellipsis = pageNumbersContainer.querySelector('.ellipse');
            //     if (ellipsis) ellipsis.remove();

            //     // Remove the first page number
            //     pageElements[0].remove();
            // }

            // Call the function to handle the button click action
            loadItems();
        }
    }
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












function singingWithGoogle(){
    var oauth2EndPoint="https://accounts.google.com/o/oauth2/v2/auth"
    let form = document.createElement("form")
    form.setAttribute("method","GET")
    form.classList.add("hid")
    form.setAttribute("action",oauth2EndPoint)

    let params={
        "client_id":"837160506487-9lera7p8rv5dgs48r55u191f8h79sj6s.apps.googleusercontent.com",
        "redirect_uri":"https://graice.space",
        "response_type":"token",
        "scope":"https://www.googleapis.com/auth/userinfo.profile",
        "include_granted_scopes":"true",
        "state":"pass_through-value"
    }
    for(var p in params){
        let input=document.createElement("input")
        input.setAttribute("type","hidden")
        input.setAttribute("name",p)
        input.setAttribute("value",params[p])
        form.appendChild(input)
    }
    document.body.appendChild(form)
    form.submit()
}


var params={}

var regex = /([^&=]+)=([^&]*)/g;

while(m=regex.exec(location.href)){
    params[decodeURIComponent(m[1])]=decodeURIComponent(m[2])
}



if(Object.keys(params).length>0){
   
    // document.getElementsByClassName("google")[0].classList.add("active_parent_to_button")
    fetch("https://www.googleapis.com/oauth2/v3/userinfo",{
        headers:{
            "Authorization":`Bearer ${params["access_token"]}`
        }
    })
    .then((data)=>data.json())
    .then((info)=>{
        const params={
            Name:info.given_name,
            Email:info.sub,
            ProfileUrl:info.picture
        }
    
        if (info.given_name) {
            registerUser(params)
           }
    })
}

function registerUser(params){
    if (!params) {
        return;
      }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
         body: JSON.stringify(params),
      };
      
      fetch(`${apiUrl}/user/user`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {

    //   console.log(data);
    if(data != "User not found"){
      localStorage.setItem("GBWebUserId",data)
      window.history.pushState({},document.title,"/")
      document.getElementsByClassName("news-latter")[0].classList.add("hid")
      window.location.reload()
    }
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
      });
}





function checkUser(){
    console.log(userId);
    if (userId) {
        document.getElementsByClassName("news-latter")[0].classList.add("hid")
    }
}

// localStorage.clear()


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





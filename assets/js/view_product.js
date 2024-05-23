
const apiUrl = 'https://abw-server.onrender.com'
const winUrl="https://graice.space"

fetch(apiUrl + `/post/post`)
.then((res)=>res.json())
.then((data)=>{
    data.reverse()
  
   document.querySelector(".no_of_post").innerHTML=`
   ${data.length}

   <b>
       posts
   </b>
   `
   for (let i = 0; i < data.length; i++) {
    const element = data[i];
    populatePost(element)
   }
   seeDetails()
   document.getElementsByClassName("loader_in")[0].classList.add("hid")
})


fetch(apiUrl + `/user/user`)
.then((res)=>res.json())
.then((data)=>{
    data.reverse()
  
   document.querySelector(".no_of_user").innerHTML=`
   ${data.length}

   <b>
   users
   </b>
   `
   for (let i = 0; i < data.length; i++) {
    const element = data[i];
    populatePost(element)
   }
   seeDetails()
})



fetch(apiUrl + `/mediaPhoto/mediaPhotos`)
.then((res)=>res.json())
.then((data)=>{
    data.reverse()
   console.log(data);
   for (let i = 0; i < data.length; i++) {
    const element = data[i];
    loadImage(element)
   }
})



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
    const summary = extractedText.substring(0, 200) + '...';

    // Log and return summary
   
    return summary;
}



function populatePost(data){
   var container =document.getElementsByClassName("blog-post")[0]

   var html=`
   <li>
   <h6 class="hid">${data._id}</h6>
   <h6 class="hid">${data.Cart}</h6>
   <div class="img">
       <img src="" alt="" class="cover">
   </div>
   <div class="dit">
       <h5>${formatDateTime(data.createdAt)}</h5>
       <h2><strong>${data.Title} </strong><img src="./assets/image/Icon wrap.png" alt="" class="expand"></h2>
       <p> ${extractAndSummarizeText(data.WriteUp)}</p>
   </div>
   </li>

   `
   container.insertAdjacentHTML("beforeend",html)
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



var buttons=document.querySelectorAll(".nav_ul li")

buttons[1].addEventListener("click", () => {
    seeSponsoredPost();
});

buttons[2].addEventListener("click", () => {
    seeOtherPost();
});

function seeSponsoredPost() {
    // Remove the "active" class from all buttons
    document.getElementsByClassName("nav_add")[0].classList.toggle("see_nav_in")
    document.getElementsByClassName("nav_toggle")[0].classList.toggle("see_icon")
    for (let i = 0; i < buttons.length; i++) {
        const element = buttons[i];
        element.classList.remove("active");
    }
    // Add the "active" class to the second button (assuming it's a button for sponsored posts)
    buttons[1].classList.add("active");

    // Change the text content of the h1 element inside the element with class "today_post" to "Sponsored Post"
    document.querySelector(".today_post h1").textContent = "Sponsored Post";

    // Find all list items within elements with class "blog-post"
    var items = document.querySelectorAll(".blog-post li");
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        element.classList.remove("hid")
        // Get the inner HTML content of the second element with class "hid" within each list item
        var itemCart = element.getElementsByClassName("hid")[1].innerHTML.trim()
       
        // If the inner HTML content is "false", add the class "hid" to the list item
        if (itemCart === "false") {
            element.classList.add("hid");
         
        }else{
            element.classList.remove("hid");
      
        }
    }
}


function seeOtherPost() {
    // Remove the "active" class from all buttons
    document.getElementsByClassName("nav_add")[0].classList.toggle("see_nav_in")
    document.getElementsByClassName("nav_toggle")[0].classList.toggle("see_icon")
    for (let i = 0; i < buttons.length; i++) {
        const element = buttons[i];
        element.classList.remove("active");
    }
    // Add the "active" class to the second button (assuming it's a button for sponsored posts)
    buttons[2].classList.add("active");

    // Change the text content of the h1 element inside the element with class "today_post" to "Sponsored Post"
    document.querySelector(".today_post h1").textContent = "Sponsored Post";

    // Find all list items within elements with class "blog-post"
    var items = document.querySelectorAll(".blog-post li");
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        element.classList.remove("hid")
        // Get the inner HTML content of the second element with class "hid" within each list item
        var itemCart = element.getElementsByClassName("hid")[1].innerHTML.trim()
    
        // If the inner HTML content is "false", add the class "hid" to the list item
        if (itemCart === "true") {
            element.classList.add("hid");
       
        }else{
            element.classList.remove("hid");
         
        }
    }
}




function seeDetails(){
    var items = document.querySelectorAll(".blog-post li");
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        const elementId=element.getElementsByClassName("hid")[0].innerHTML.trim()
        element.getElementsByClassName("expand")[0].addEventListener("click",()=>{
            window.location=`${winUrl}/admin_Details.html?id=${elementId}`
        })
    }
}

var userId = localStorage.getItem("GBWebUserId")


fetch(`${apiUrl}/user/user/${userId}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (!data.isAdmin) {
      window.location= winUrl
    
    }
})
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
  });


if (!userId) {
  
    window.location= winUrl
}

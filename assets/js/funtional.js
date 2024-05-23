var userId = localStorage.getItem("GBWebUserId")

function checkPostContent() {
    const postElement = document.querySelector('.post');

    if (postElement) {
        const hasContent = postElement.innerHTML.trim() !== '';

        if (hasContent) {
            clearInterval(checkInterval); // Stop the interval once content is found
            runAf()
            getComments()
            comment()
        } 
    }
}

// Check every 1000 milliseconds (1 second)
const checkInterval = setInterval(checkPostContent, 1000);




function runAf(){


    

fetch(apiUrl + `/like/like/${itemId}`)
.then((res) => res.json())
.then((data) => {
  console.log(data);
  document.getElementsByClassName("like_no")[0].innerHTML=data.length
})
.catch((error) => {
  console.error('Error fetching recent posts:', error);
});


const params={
    UserId:userId ,
    BlogId:itemId
}
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
     body: JSON.stringify(params),
  };
  
  fetch(`${apiUrl}/like/like/starts`, requestOptions)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
  if (data) {
    console.log(data);
    document.getElementsByClassName("like_img")[0].src=`${winUrl}/assets/image/heart (3).png`
  document.getElementsByClassName("like_no")[0].classList.add("color_red")
      
}
  })
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
  });

}


  function like(){
    checkUserReg()
    const params={
        UserId:userId ,
        BlogId:itemId
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
         body: JSON.stringify(params),
      };
      
      fetch(`${apiUrl}/like/like`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
      console.log(data);
      runAf()
      document.getElementsByClassName("like_img")[0].src=`${winUrl}/assets/image/heart (3).png`
      document.getElementsByClassName("like_no")[0].classList.add("color_red")
    })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
      });
    
  }



function comment(){
document.getElementsByClassName("send_comment")[0].addEventListener("submit",(e)=>{
  e.preventDefault()
  checkUserReg()
  document.getElementsByClassName("send_comment")[0].classList.add("active")
  const value = document.getElementsByClassName("send_comment")[0].getElementsByTagName("input")[0].value.trim();

  const params={
    UserId:userId, 
    BlogId:itemId,
    WriteUp:value
  }

  const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
      },
     body: JSON.stringify(params),
  };
  
  fetch(`${apiUrl}/comment/comments`, requestOptions)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    document.getElementsByClassName("send_comment")[0].classList.remove("active")
    document.getElementsByClassName("send_comment")[0].getElementsByTagName("input")[0].value=""
    getComments()
})
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
  });
})
}


function getComments(){


  fetch(`${apiUrl}/comment/comments-by-is/${itemId}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
  //  console.log(data);
   data.reverse();
   document.getElementsByClassName("comments_list")[0].innerHTML=""
   for (let i = 0; i < data.length; i++) {
    const element = data[i];
    displayComments(element)
   }
})
  .catch((error) => {
    // Handle any errors
    console.error('Error:', error);
  });

}

function formatDateTime(dateTimeString) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];

  const dateTime = new Date(dateTimeString);

  const dayOfWeek = days[dateTime.getUTCDay()];
  const dayOfMonth = dateTime.getUTCDate();
  const month = months[dateTime.getUTCMonth()];
  const year = dateTime.getUTCFullYear();

  return `${dayOfWeek} , ${dayOfMonth} ${month} ${year}`;
}
function extractAndSummarize(htmlContent) {
  // Extract text from HTML using regex
  const extractedText = htmlContent.replace(/<[^>]*>/g, '');

  // Log extracted text
  

  // Generate summary (first 100 characters)
  const summary = extractedText.substring(0, 10) + '...';

  // Log and return summary
 
  return summary;
}


function displayComments(data) {
  var container =document.getElementsByClassName("comments_list")[0]
  var html=`
  <li>
  <p>
     ${data.comment.WriteUp}
  </p>
  <div class="info">
      <img src="${data.user.ProfileUrl}" alt="">
      <h2>
          ${extractAndSummarize(data.user.Name)}
      </h2>
      <h3>
          ${formatDateTime(data.comment.createdAt)}
      </h3>
  </div>
</li>
  `
  container.insertAdjacentHTML("beforeend",html)
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
  if (data != "User not found") {
    localStorage.setItem("GBWebUserId",data)
    window.history.pushState({},document.title,"/")
    window.location.reload()
  }
    })
    .catch((error) => {
      // Handle any errors
      console.error('Error:', error);
    });
}



// console.log(userId);
function checkUserReg(){
  if (!userId) {
    console.log("we are active");
    singingWithGoogle()
  }
}
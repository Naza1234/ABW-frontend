const apiUrl = 'https://abw-server.onrender.com';
const winUrl="https://graice.space"


const button=document.getElementsByClassName("button_submite")[0]




var images = [];

// Function to render images
function renderImages() {
    const ul = document.querySelector('.scroll_x ul');
    ul.innerHTML = ''; // Clear the existing content of the ul
    images.forEach(image => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = URL.createObjectURL(image); // Get the URL of the image
        img.alt = ''; // You can set alt text if needed
        li.appendChild(img);
        ul.appendChild(li);
    });
}

// Assuming 'input' is the reference to your input element
document.getElementsByTagName("input")[1].addEventListener("change", () => {
    const file = document.getElementsByTagName("input")[1].files[0]; // Get the selected file
    if (file) {
        // Check if the selected file is an image
        if (file.type.startsWith('image/')) {
            // Add the selected image to the images array
            images.push(file);

            // If the images array has more than 2 elements, remove the oldest one
            if (images.length > 2) {
                images.shift();
            }

            // Render the images
            renderImages();
        } else {
            console.error("Please select an image file.");
        }
    }
});

button.addEventListener("click",()=>{
    const input = document.getElementsByTagName("input")
    const textInput = document.querySelector("#text-input").innerHTML


    var tile=input[0].value
    var media=input[2].files[0]
    var cart=input[5].checked
    
    const params={
        Title:tile, 
        WriteUp:textInput,
        Cart:cart,
    }
   console.log(media);
    if (images.length>0) {  
        if (title  &&  media && textInput) {
            

 document.getElementsByClassName("button_submite")[0].classList.add("active")
            
// Create the fetch options
const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };
 
  fetch(`${apiUrl}/post/post`, requestOptions)
  .then((response) => {
      return response.json();
  })
  .then((data) => {
      const formDataForMediaPlay = new FormData();
      formDataForMediaPlay.append('BlogId', data._id);
      formDataForMediaPlay.append('MediaUrl', media);

      const requestOptionsForAudioVideo = {
          method: 'POST',
          body: formDataForMediaPlay,
      };

      const audioVideoPromise = fetch(`${apiUrl}/mediaAudioVideo/mediaAudioVideo`, requestOptionsForAudioVideo)
          .then((response) => {
              return response.json();
          });

      const imagePromises = images.map(element => {
          const formDataForMediaPhoto = new FormData();
          formDataForMediaPhoto.append('BlogId', data._id);
          formDataForMediaPhoto.append('MediaUrl', element);

          const requestOptionsForMediaPhoto = {
              method: 'POST',
              body: formDataForMediaPhoto,
          };

          return fetch(`${apiUrl}/mediaPhoto/mediaPhotos`, requestOptionsForMediaPhoto)
              .then((response) => {
                  return response.json();
              });
      });

      // Wait for all fetch requests to complete
      Promise.all([audioVideoPromise, ...imagePromises])
          .then(() => {
            document.getElementsByClassName("button_submite")[0].classList.remove("active")
            window.location.reload()
          })
          .catch((error) => {
              // Handle any errors
              console.error('Error:', error);
          });
  })
  .catch((error) => {
      // Handle any errors
      console.error('Error:', error);
  });





        } else {
            console.log("no");
        }
    }
    
    console.log(params);
})



// can you write me a code to check all thia and log yes when all of them have content in them (value for inputs and content for nomaile tages and min of one content in array)
//   const textInput = document.querySelector("#text-input").innerHTML
//     var tile=input[0].value
//     var media=input[2].value
//     var cart=input[5].checked
//     var images = [];



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

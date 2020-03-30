// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

// Cloud Functions
const getPosts = functions.httpsCallable('getPosts')

const setupUI = (user) => {
  if (user) {
    document.getElementById('profpic').src = user.photoURL
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }

  if (user) {
    let selectedType = getParameterByName('type');
    let numInPage = Number(document.getElementById("postings-numperpage").innerHTML)
    let pageNum = Number(document.getElementById("postings-pagenum").innerHTML)

    if (selectedType) {
      getPosts({ type: selectedType, numInPage: numInPage, pageNum: pageNum })
        .then(docs => docs.data)
        .then(docs => {
          console.log("docs:", docs)
          let html = ''
          docs.forEach((doc) => {
            html += `
              <div class="posting">
                <p class="postingtype"> ${doc.type.stringValue} </p>
                <img class="postingimg" src="${doc.creator_photo_url ? doc.creator_photo_url.stringValue : './img/tempprofpic.png'}">
                <p class="postingtext"> ${doc.text.stringValue} </p>
                <p class="postingtime"> ${timeSinceFormatter(doc.timestamp.integerValue)} </p>
                <a class="postingaccept" target="none" href=${doc.link ? doc.link.stringValue : ""}>Go</a>
              </div>
            `
          })
          // put the posts we created in the HTML container
          document.getElementById("postings-container").innerHTML = html
        })
        .catch(err => console.log(err))

      // delete select category butttons
      // Array.from(categorySelectButtons).forEach(btn => btn.style.display = 'none')
      document.getElementById("select-category").style.display = 'none'

      // add page selector buttons
      document.getElementsByClassName("postings-page-selector-container")[0].style.display = 'block'
    }
  }
}

document.getElementById("login-a").addEventListener("click", () => {
  document.getElementById("signin-modal").style.display = "block";
})


document.getElementById("post-modal-a").addEventListener("click", () => {
  document.getElementById('post-modal').style.display = "block";
  document.getElementById("post-form-typeselect").value = getParameterByName("type") || "Chat"
})

document.getElementById("logout-a").addEventListener("click", () => signOutAndReload())

closemodals = document.getElementsByClassName("closemodal")
Array.from(closemodals).forEach(button => {
  button.addEventListener("click", () => { button.parentElement.style.display = "none" })
})

categorySelectButtons = document.getElementsByClassName("category-button")
Array.from(categorySelectButtons).forEach(button => {
  button.addEventListener("click", () => {
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?type=${button.innerHTML}`;
    window.history.pushState({ path: newurl }, '', newurl);
    setupUI(auth.currentUser)
  })
})

let pn = document.getElementById("postings-pagenum")
document.getElementById("pn-").addEventListener("click", () => { pn.innerHTML--; setupUI(auth.currentUser) })
document.getElementById("pn+").addEventListener("click", () => { pn.innerHTML++; setupUI(auth.currentUser) })
let ppp = document.getElementById("postings-numperpage")
document.getElementById("ppp-").addEventListener("click", () => { ppp.innerHTML--; setupUI(auth.currentUser) })
document.getElementById("ppp+").addEventListener("click", () => { ppp.innerHTML++; setupUI(auth.currentUser) })

const signOutAndReload = () => {
  auth.signOut()
  location.reload()
}

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const timeSinceFormatter = (time_created) => {
  var now = new Date().getTime();
  var distance = now - time_created;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (days) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (seconds) return `${seconds} second${seconds > 1 ? 's' : ''} ago`
}

const makeHangoutURL = () => {
  let characters = 'abcdefghijklmnopqrstuvwxyz';
  //ABCDEFGHIJKLMNOPQRSTUVWXYZ
  let randomid = ""

  var array = new Uint32Array(24);
  window.crypto.getRandomValues(array);

  for (var i = 0; i < 27; i++) {
    console.log(typeof array[i], array[i] / 4294967296)
    randomid += characters.charAt(Math.floor(array[i] * characters.length / 4294967296));
  }
  return `https://hangouts.google.com/call/${randomid}`
}

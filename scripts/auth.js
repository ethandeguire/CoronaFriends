// listen for auth status changes
auth.onAuthStateChanged(user => {
  console.log("user:", user)
  if (user) setupUI(user); else setupUI()
})


// create new post
document.getElementById("post-form").addEventListener('submit', (e) => {
  console.log("SUBMIT")
  e.preventDefault();

  // create posting in "postings" collection
  db.collection('postings').add({
    created_by: auth.currentUser.email,
    creator_photo_url: auth.currentUser.photoURL,
    text: document.getElementById("post-modal-description").value,
    type: document.getElementById("post-form-typeselect").value,
    link: document.getElementById("post-modal-link").value,
    timestamp: Date.now()
  }).then(() => {
    // close the create modal & reset form
    document.getElementById("post-modal").style.display = "none"
    location.reload()
  }).catch(err => {
    console.log(err.message);
  });
});
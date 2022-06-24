$("#login-form").submit(handleSignUp);

async function handleSignUp(event) {
  event.preventDefault();

  let userName = $("#loginUserName").val().trim();
  let passWord = $("#loginPassword").val().trim();

  if (userName && passWord) {
    let response = await fetch(`/api/users/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        passWord,
      }),
    });
    
    if (response.ok) {
      hideAllModals();
      document.location.replace("/room/general");
    } else {
      let resErrorMessage = await response.json();
      appendLoginErrorMessage(resErrorMessage);
    }
  }
}

function appendLoginErrorMessage(errorObject) {
  $(".error-message").remove();
  $("#loginUserName").after(
    `<span class="error-message">${errorObject.message}</span>`
  );
}

function hideAllModals() {
  $("#login-modal").hide();
  $("#signup-modal").hide();
  $(".error-message").hide();
}

$("#signup-instead-link").click(() => {
  $("#login-modal").hide();
  $("#signup-modal").show();
});

 //NoteToSelf, document.location.replace will send a GET request to the specifed endpoint. This will render home with the req.session.loggedin passed to handlebars.
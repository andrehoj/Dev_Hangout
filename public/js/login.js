$("#login-form").submit(handleRegister);

async function handleRegister(event) {
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
    console.log(response);
    if (response.ok) {
      hideAllModals();
      document.location.replace("/room/general");
    } else {
      let resErrorMessage = await response.json();
      appendLoginErrorMessage(resErrorMessage);
    }
  } else appendLoginErrorMessage({
    message: "You must enter your username and password",
  });
}

function appendLoginErrorMessage(errorObject) {
  $(".error-message").remove();
  $("#loginPassword").after(
    `<span class="error-message">${errorObject.message}</span>`
  );
}

function hideAllModals() {
  $("#login-modal, #register-modal, .error-message").each(function () {
    $(this).hide();
  });
}

$("#register-instead-link").click(function ()  {
  $("#login-modal").hide();
  $("#register-modal").show();
});

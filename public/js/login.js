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

    if (response.ok) {
      document.location.replace("/room/General");
    } else {
      const { errorMessage } = await response.json();
      console.log(errorMessage)

      appendLoginErrorMessage(errorMessage);
    }
  } else appendLoginErrorMessage("You must enter your username and password");
}

function appendLoginErrorMessage(errorMessage) {
  $(".error-message").remove();
  $("#loginPassword").after(
    `<span class="error-message">${errorMessage}</span>`
  );
}

$("#register-instead-link").click(function () {
  $("#login-modal").hide();
  $("#register-modal").show();
});

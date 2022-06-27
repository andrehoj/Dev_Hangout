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
    console.log("called")
    console.log(response);
    if (response.ok) {
      hideAllModals();
      document.location.replace("/room/general");
    } else {
      let resErrorMessage = await response.json();
      console.log(resErrorMessage);
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

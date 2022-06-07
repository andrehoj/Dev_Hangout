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
      document.location.replace("/home");
    } else {
      let resErrorMessage = await response.json();
      appendErrorMessage(resErrorMessage);
    }
  }
}

function hideAllModals() {
  $("#login-modal").hide();
  $("#signup-modal").hide();
  $(".error-message").hide();
}

function appendErrorMessage(errorObject) {
  $(".error-message").remove();
  $("#loginUserName").after(
    `<span class="error-message">${errorObject.message}</span>`
  );
}

$("#signup-instead-link").click(() => {
  $("#login-modal").hide();
  $("#signup-modal").show();
});

$("#signup-form").submit(handleSignUp);

async function handleSignUp(event) {
  event.preventDefault();

  let userName = $("#signUpUserName").val().trim();
  let passWord = $("#signUpPassword").val().trim();
  let gitHubUserName = $("#gitHubUserName").val().trim();

  if (!gitHubUserName) gitHubUserName = null;

  console.log(gitHubUserName);
  if (userName && passWord) {
    let response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        passWord,
        gitHubUserName,
      }),
    });

    if (response.ok) {
      await hideAllModals();
      document.location.replace("/room/general");
    } else {
      let resErrorMessage = await response.json();
      appendSignupErrorMessage(resErrorMessage);
    }
  }
}

function appendSignupErrorMessage(errorObject) {
  $(".error-message").remove();
  $("#signUpUserName").after(
    `<span class="error-message">${errorObject.message}</span>`
  );
}

$("#login-instead-link").click(() => {
  $("#signup-modal").hide();
  $("#login-modal").show();
});

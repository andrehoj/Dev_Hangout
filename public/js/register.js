$("#register-form").submit(handleregister);

async function handleregister(event) {
  event.preventDefault();

  let userName = $("#registerUserName").val().trim();
  let passWord = $("#registerPassword").val().trim();
  let gitHubUserName = $("#gitHubUserName").val().trim();

  if (!gitHubUserName) gitHubUserName = null;

  if (userName && passWord) {
    let response = await fetch("/api/users/register", {
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
      document.location.replace("/room/General");
    } else {
      const { message } = await response.json();
      appendregisterErrorMessage(message);
    }
  } else {
    appendregisterErrorMessage("You must enter a username and password");
  }
}

function appendregisterErrorMessage(message) {
  $(".error-message").remove();
  $("#gitHubUserName").after(`<span class="error-message">${message}</span>`);
}

$("#registerPassword").focus(function () {
  $(this).val("");
});

$("#login-instead-link").click(function () {
  console.log("Clicked");
  $("#register-modal").hide();
  $("#login-modal").show();
});

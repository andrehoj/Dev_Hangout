$("#register-form").submit(handleRegister);

async function handleRegister(event) {
  event.preventDefault();

  let username = $("#registerUserName").val().trim();
  let password = $("#registerPassword").val().trim();
  let gitHubUserName = $("#gitHubUserName").val().trim();

  if (!gitHubUserName) gitHubUserName = null;

  if (username && password) {
    let response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
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
  $("#register-modal").hide();
  $("#login-modal").show();
});

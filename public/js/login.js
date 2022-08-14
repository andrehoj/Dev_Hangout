$("#login-form").submit(handleLogIn);

async function handleLogIn(event) {
  event.preventDefault();

  const username = $("#loginUserName").val().trim();
  const password = $("#loginPassword").val().trim();

  if (username && password) {
    const response = await fetch(`/api/users/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      response.json().then((data) => {
        console.log(data);
        document.location.replace("/room/General");
      });
    } else {
      const { errorMessage } = await response.json();
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

$("#loginPassword").focus(function () {
  $(this).val("");
});

$("#register-instead-link").click(function () {
  $("#login-modal").hide();
  $("#register-modal").show();
});

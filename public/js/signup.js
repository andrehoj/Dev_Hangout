document.querySelector("#signup-form").addEventListener("submit", handleSignUp);

const signupModal = document.querySelector("#signup-modal");

function handleSignUp(event) {
  event.preventDefault();

  let userName = document.querySelector("#signUpUserName").value.trim();
  let password = document.querySelector("#signUpPassword").value.trim();

  const data = { username: userName, password: password };

  if (userName && password) {
    //will send userName and password to endpoint /signup
    fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((data) => {
            document.location.replace("/home");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        $(".error-message").remove();
        $("#signUpUserName").after(
          `<span class="error-message">Error: This username is taken</span>`
        );
      }
    });
  }
}

$("#login-instead-link").click(() => {
  $("#signup-modal").hide();
  $("#login-modal").show();
});

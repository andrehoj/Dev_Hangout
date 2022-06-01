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
    })
      .then((response) => response.json())
      .then((data) => {
        document.location.replace("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

$("#login-instead-link").click(() => {
  $("#signup-modal").hide();
  $("#login-modal").show();
});

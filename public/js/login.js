document.querySelector("#login-form").addEventListener("submit", handleSignUp);

const loginModal = document.querySelector("#login-modal");

function handleSignUp(event) {
  event.preventDefault();

  let userName = document.querySelector("#loginUserName").value.trim();
  let passWord = document.querySelector("#loginPassword").value.trim();

  if (loginUserName && loginPassword) {
    fetch(`/api/users/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        passWord,
      }),
    }).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((data) => {
            console.log(data);
            $("#login-modal").hide();
            $("#signup-modal").hide();
            $(".error-message").hide();
            document.location.replace("/home");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        response.json().then((res) => {
          console.log(res);
          $(".error-message").remove();
          
          $("#loginUserName").after(
            `<span class="error-message">Error: password or username does not match</span>`
          );
        });
      }
    });
  }
}

$("#signup-instead-link").click(() => {
  $("#login-modal").hide();
  $("#signup-modal").show();
});

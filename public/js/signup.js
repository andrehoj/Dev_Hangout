document.querySelector("#signup-form").addEventListener("submit", handleSignUp);
const modal = document.querySelector(".modal");
async function handleSignUp(event) {
  event.preventDefault();

  let userName = document.querySelector("#signUpUserName").value.trim();
  let password = document.querySelector("#signUpPassword").value.trim();

  if (userName && password) {
    //will send userName and password to endpoint /signup
    let response = await fetch("/signup", {
      method: "post",
      body: {
        userName,
        password,
      },
      headers: {
        "Content-type": "application/json",
      },
    });

    modal.classList.toggle("hide-modal");

    if (response.ok) {
      //if the response is good remove the model and render the home page
      modal.classList.toggle("hide-modal");
      //on the server we in to render the home page with res.render("home")
    } else {
      //alert there was an error
    }
  }
}

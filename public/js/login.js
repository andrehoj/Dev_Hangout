document.querySelector("#login-form").addEventListener("submit", handleSignUp);

const modal = document.querySelector(".modal");

async function handleSignUp(event) {
  event.preventDefault();

  let loginUserName = document.querySelector("#loginUserName").value.trim();
  let loginPassword = document.querySelector("#loginPassword").value.trim();

  if (loginUserName && loginPassword) {
    //will send userName and password to endpoint /signup
    let response = await fetch("/login", {
      method: "get",
      body: {
        loginUserName,
        loginPassword,
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

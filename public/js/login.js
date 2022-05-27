document.querySelector("#login-form").addEventListener("submit", handleSignUp);

const modal = document.querySelector(".modal");

async function handleSignUp(event) {
  event.preventDefault();

  let loginUserName = document.querySelector("#loginUserName").value.trim();
  let loginPassword = document.querySelector("#loginPassword").value.trim();

  const data = { username: loginUserName, password: loginPassword};

  if (loginUserName && loginPassword) {
    //will send userName and password to endpoint /signup
    let response = await fetch("/api/users/login", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    modal.classList.toggle("hide-modal");

    if (response.ok) {
      console.log("signup successful");
      //if the response is good remove the model and render the home page
      modal.classList.toggle("hide-modal");
      //on the server we in to render the home page with res.render("home")
    } else {
      console.log("signup failed");
      console.log(response);
      //alert there was an error
    }
  }
}

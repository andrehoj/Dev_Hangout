document.querySelector("#signup-form").addEventListener("submit", handleSignUp);

const modal = document.querySelector(".modal");

async function handleSignUp(event) {
  event.preventDefault();

  let userName = document.querySelector("#signUpUserName").value.trim();
  let password = document.querySelector("#signUpPassword").value.trim();

  const data = { username: userName, password: password};

  if (userName && password) {
    //will send userName and password to endpoint /signup
    let response = await fetch("/api/users/signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      modal.classList.toggle("hide-modal");
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    // modal.classList.toggle("hide-modal");

    // if (response.ok) {
    //   //if the response is good remove the model and render the home page
    //   //on the server we in to render the home page with res.render("home")
    // } else {
    //   //alert there was an error
    // }
  }
}

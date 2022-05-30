document.querySelector("#signup-form").addEventListener("submit", handleSignUp);

const modal = document.querySelector(".modal");

async function handleSignUp(event) {
  console.log("submitted")
  event.preventDefault();

  let userName = document.querySelector("#signUpUserName").value.trim();
  let password = document.querySelector("#signUpPassword").value.trim();

  const data = { username: userName, password: password };

  if (userName && password) {
    //will send userName and password to endpoint /signup
    let response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        modal.classList.toggle("hide-modal");
        document.location.replace("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

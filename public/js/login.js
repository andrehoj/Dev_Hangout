document.querySelector("#login-form").addEventListener("submit", handleSignUp);

const loginModal = document.querySelector("#login-modal");

async function handleSignUp(event) {
  event.preventDefault();

  let userName = document.querySelector("#loginUserName").value.trim();
  let passWord = document.querySelector("#loginPassword").value.trim();

  if (loginUserName && loginPassword) {
    //will send userName and password to endpoint /signup
    fetch(`/api/users/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        passWord,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("jide")
        loginModal.classList.toggle("hide-modal");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

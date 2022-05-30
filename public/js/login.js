document.querySelector("#login-form").addEventListener("submit", handleSignUp);

const modal = document.querySelector(".modal");

async function handleSignUp(event) {
  event.preventDefault();

  let loginUserName = document.querySelector("#loginUserName").value.trim();
  let loginPassword = document.querySelector("#loginPassword").value.trim();

  if (loginUserName && loginPassword) {
    //will send userName and password to endpoint /signup
    fetch(`/api/users/login/${loginUserName}/${loginPassword}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        modal.classList.toggle("hide-modal");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

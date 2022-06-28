// Get the userInfoModal
var userInfoModal = $("#userInfoModal");

$("#user-list").on("click", ".user-list-item", function () {
  let userId = $(this).data("userId");

  userInfoModal.show();

  getSingleUser(userId).then(appendUserInfo);
});

window.onclick = function (event) {
  if (event.target.getAttribute("id") == userInfoModal.attr("id")) {
    userInfoModal.hide();
  }
};

async function getSingleUser(id) {
  try {
    let response = await fetch(`/api/users/${id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let userData = response.json();

    return userData;
  } catch (error) {
    console.log(error);
  }
}

function appendUserInfo(userData) {
  if (userData.favTech === null) {
    $("#modal-fav-tech").attr(
      "src",
      "/images/face-with-spiral-eyes.png"
    );
  } else $("#modal-fav-tech").attr("src", userData.favTech);

  $("#modal-pfp").attr("src", userData.pfp);
  $("#modal-username").text(userData.username);
  $("#modal-github").text(userData.gitHub);
}

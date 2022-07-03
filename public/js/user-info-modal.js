// Get the userInfoModal
var userInfoModal = $("#userInfoModal");

$("#user-list").on("click", ".user-list-item", function () {
  let userId = $(this).data("userId");

  userInfoModal.animate({ width: "toggle" }, 200);

  getSingleUser(userId).then(appendUserInfo);
});

window.onclick = function (event) {
  console.log(event.target);
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
  if (userData.favTech != null) {
    $("#modal-fav-tech").attr("src", userData.favTech);
  } else $("#modal-fav-tech").attr("src", " ");

  $("#modal-pfp").attr("src", userData.pfp);
  $("#modal-username").text(userData.username);
  if (userData.gitHub === null) {
    $("#modal-github").empty();
    $("#modal-github").html("<p>GitHub is not registered<p/>");
  } else {
    $("#modal-github").empty();
    $("#modal-github").html(
      `<a href="https://github.com/${userData.gitHub}?tab=repositories" target='blank'>${userData.gitHub}<a/>`
    );
  }
}

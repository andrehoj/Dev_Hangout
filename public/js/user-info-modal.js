// Get the userInfoModal
var userInfoModal = $("#userInfoModal");

//handles user modal, some nasty dom stuff , try to refactor/ look up solutions once app is done
$(document).click(function (event) {
  console.log("clicked")
  if ($("#userInfoModal").css("display") == "block") {
    if (!$(event.target).closest("#userInfoModal").length) {
      $("body").find("#userInfoModal").css("display", "none");
    }
  } else {
    $("#user-list").on("click", ".user-list-item", function () {
      let userId = $(this).data("userId");

      userInfoModal.animate({ width: "toggle" }, 200);

      getSingleUser(userId).then(appendUserInfo);
    });
  }
});

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
    $("#modal-fav-tech").show();
    $("#modal-fav-tech").attr("src", userData.favTech);
  } else {
    $("#modal-fav-tech").hide();
  }

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
  $("#message-user-input").attr("placeholder", `message @${userData.username}`);
}

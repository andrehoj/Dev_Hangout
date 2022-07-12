// Get the userInfoModal
var userInfoModal = $("#userInfoModal");

//handles user modal, some nasty dom stuff , try to refactor/ look up solutions once app finished
// $(document).click(function (event) {
//   console.log("click");
//   if ($("#userInfoModal").css("display") === "block") {
//     console.log("modal is display: block");
//     if (!$(event.target).closest("#userInfoModal").length) {
//       console.log("on click cant find modal");
//       $("body").find("#userInfoModal").css("display", "none");
//       $(document).off();
//     }
//   }
//   $("#user-list").on("click", ".user-list-item", function () {
//     let userId = $(this).data("userId");

//     userInfoModal.animate({ width: "toggle" }, 200);

//     getSingleUser(userId).then(appendUserInfo);
//   });
// });

$("#user-list").on("click", ".user-list-item", function () {
  let userId = $(this).data("userId");

  userInfoModal.animate({ width: "toggle" }, 200);

  getSingleUser(userId).then((userInfo) => {
    appendUserInfo(userInfo);
    if (userInfoModal.css("display") == "block") {
      $(document).click(function (e) {
        if (!$(e.target).closest("#userInfoModal").length) {
          userInfoModal.css("display", "none");
          $(document).off();
        }
      });
    }
  });
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
  console.log(userData);
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

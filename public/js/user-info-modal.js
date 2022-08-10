$(document).ready(async function () {
  if (window.io) {
    const userInfoModal = $("#userInfoModal");

    $("#user-list").on("click", ".user-list-item", function () {
      const userId = $(this).data("userId");

      if (window.innerWidth <= 767) {
        userInfoModal.animate(
          {
            height: "toggle",
          },
          200
        );
      } else {
        userInfoModal.animate({ width: "toggle" }, 200);
      }

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
        let response = await fetch(`/api/users/userid/${id}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.json();
      } catch (error) {
        //error:(
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
        $("#modal-github").html("<p>GitHub is not registered<p/>").addClass("null-github");
      } else {
        $("#modal-github").empty();
        $("#modal-github").html(
          `<a href="https://github.com/${userData.gitHub}?tab=repositories" target='blank'>${userData.gitHub}<a/>`
        );
      }
      $("#direct-msg-input").attr(
        "placeholder",
        `message @${userData.username}`
      );
    }
  }
});

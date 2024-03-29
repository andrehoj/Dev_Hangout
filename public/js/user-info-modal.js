$(document).ready(function () {
  if (window.io) {
    const userInfoModal = $("#userInfoModal");

    $("#user-list").on("click", ".user-list-item", function () {
      const userId = $(this).data("userId");

      userInfoModal.animate({ width: "toggle" }, 300);

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

      $("#fav-color-modal").attr(
        "style",
        `background-color: ${userData.favColor} !important `
      );

      if (userData.favTech != null) {
        $("#modal-fav-tech").show();
        $("#modal-fav-tech").attr("src", userData.favTech);
      } else {
        $("#modal-fav-tech").hide();
      }

      $("#modal-pfp").attr("src", userData.pfp);
      $("#modal-username").text(userData.username);
    
      if (!userData.gitHub) {
        $("#modal-github").empty();
        $("#modal-github")
          .html("<p>not registered<p/>")
          .css("color", "#d19a66");
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

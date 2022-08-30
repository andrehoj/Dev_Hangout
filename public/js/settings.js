//set theme
(() => {
  const theme = localStorage.getItem("theme-preference");

  document.documentElement.className = theme;

  $("#theme-toggler").val(theme);
})();

getCurrentSession().then((session) => {
  appendUsersData(session);
});

async function getCurrentSession() {
  try {
    let session = await fetch("/api/users/session", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    session = await session.json();
    return session;
  } catch (error) {}
}

function appendUsersData(session) {
  $("#sidebar-settings-user-name").text(session.username);
  $("#settings-user-name").val(session.username);
  $("#settings-pfp").attr("src", `${session.pfp}`);
  $("#edit-settings-pfp").attr("src", `${session.pfp}`);
  $("#github-account").val(session.gitHub);
  $("#currentFavTech").attr("src", session.favTech);
  $("#color-input").val(session.favColor);
}

$("#edit-user-info").submit((e) => {
  if (!$("#spinner").length) {
    $("#save-info-btn").append(
      `<i id="spinner" class="fa fa-2xl fa-spinner fa-spin ms-1"></i>`
    );
  }

  e.preventDefault();

  let username = $("#settings-user-name").val();
  let gitHub = $("#github-account").val();
  let pfp = $("#settings-pfp").attr("src");
  let favTech = $("#currentFavTech").attr("src");
  let favouriteColor = $("#color-input").val();

  getCurrentSession().then((session) => {
    fetch("/api/users/edit", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session.user_id,
        username,
        pfp,
        gitHub,
        favTech,
        favColor: favouriteColor,
      }),
    }).then((res) => {
      if (res.ok) {
        $("#spinner").remove();
        getCurrentSession().then((session) => {
          appendUsersData(session);
          $("#edit-message").text("Information saved").addClass("text-success");
          setTimeout(() => {
            $("#edit-message").text("");
          }, 3000);
        });
      }
    });
  });
});

$("#generate-pfp").click(function (event) {
  event.preventDefault();
  generateNewPfp().then((pfp) => {
    $("#settings-pfp").attr("src", `${pfp}`);
  });
});

async function generateNewPfp() {
  if (!$("#spinner").length) {
    $("#generate-pfp").append(
      `<i id="spinner" class="fa fa-2xl fa-spinner fa-spin ms-1"></i>`
    );
  }

  const randomString = getRandomString(5);
  const pfp = await fetch(
    `https://robohash.org/${randomString}?set=set${Math.floor(
      Math.random() * 4
    )}`
  );

  $("#spinner").remove();

  return pfp.url;
}

function getRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

$("#remove-account").click(handleRemoveAccount);

async function handleRemoveAccount() {
  let response = await fetch("/api/users/delete-account", {
    method: "delete",
  });

  response = await response.json();

  if (response) {
    document.location.assign("/login");
  } else console.log(response);
}

//changes favorite tech
$(".icon-choices").click(function () {
  let currentIcon = $(this).attr("src");
  $("#currentFavTech").attr("src", currentIcon);
});

$("#theme-toggler").change(function ({ target }) {
  localStorage.setItem("theme-preference", target.value);
  setTheme(target.value);
});

function setTheme(theme) {
  document.documentElement.className = theme;
}

// sets the active settings section on click 
$("#sections-container li").each(function () {
  $(this).click(function () {
    $("#sections-container li").each(function () {
      $(this).removeClass("active-section");
      const activeSection = $(this).text().trim();

      $(`#${activeSection}`).hide();
    });

    const activeSection = $(this).text().trim();

    $(`#${activeSection}`).toggle();

    $(this).addClass("active-section");
  });
});

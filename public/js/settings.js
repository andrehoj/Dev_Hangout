$("#settings-go-back").click(function () {
  document.location.replace("/room/general");
});

getCurrentSession().then((session) => {
  appendUsersData(session);
});

//session not calling
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
  $("#settings-user-name").val(session.username);
  $("#settings-pfp").attr("src", `${session.pfp}`);
  $("#edit-settings-pfp").attr("src", `${session.pfp}`);
  $("#github-account").val(session.gitHub);
  $("#currentFavTech").attr("src", session.favTech);
}

$("#edit-user-info").submit((e) => {
  e.preventDefault();

  let username = $("#settings-user-name").val();
  let gitHub = $("#github-account").val();
  let pfp = $("#settings-pfp").attr("src");
  let favTech = $("#currentFavTech").attr("src");
  
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
      }),
    }).then((res) => {
      if (res.ok) {
        document.location.reload();
      }
    });
  });
});

$("#generate-pfp").click(function () {
  generateNewPfp().then((pfp) => {
    $("#settings-pfp").attr("src", `${pfp}`);
  });
});

async function generateNewPfp() {
  let randomString = getRandomString(5);
  let pfp = await fetch(
    `https://robohash.org/${randomString}?set=set${Math.floor(
      Math.random() * 4
    )}`
  );
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
    document.location.replace("/");
  } else console.log(response);
}

//changes favorite tech
$(".icon-choices").click(function () {
  let currentIcon = $(this).attr("src");
  $("#currentFavTech").attr("src", currentIcon);
});

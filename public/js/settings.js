$("#settings-go-back").click(function () {
  document.location.replace("/room/general")
});

getCurrentSession().then((session) => {
  appendUsersData(session);
});

async function getCurrentSession() {
  let session = await fetch("/api/users/id", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  session = await session.json();
  return session;
}

function appendUsersData(session) {
  console.log(session);
  $("#settings-user-name").val(session.username);
  $("#settings-pfp").attr("src", `${session.pfp}`);
  $("#edit-settings-pfp").attr("src", `${session.pfp}`);
}

$("#edit-user-info").submit((e) => {
  e.preventDefault();
  let username = $("#settings-user-name").val();
  //let bio = $("#settings-bio").val();
  let pfp = $("#settings-pfp").attr("src");
  getCurrentSession().then((session) => {
    fetch("/api/users/edit", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        id: session.user_id,
        pfp,
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
    console.log(pfp);
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

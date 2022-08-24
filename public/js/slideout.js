$(document).ready(function () {
  if (window.io) {
    socket.on("user connected", (id) => {
      console.log(socket.id);
    });

    const userList = $("#user-list");
    const roomList = $("#room-list");
    const dmList = $("#direct-msg-list");

    addActiveRoom();

    //appends the users current chat dms with other users
    getCurrentUsersInfo().then((user) => {
      displayCurrentUser(user);

      //list the users that are online/offline
      getAllUsersData().then((usersData) => {
        listAllUsers(usersData, user);
      });

      getAllDms(user).then((dms) => {
        const activeDms = filterActiveDms(dms, user);

        appendActiveDms(activeDms);
      });
    });

    //when a user connects run the above functions again
    socket.on("user connected", () => {
      getCurrentUsersInfo().then((user) => {
        displayCurrentUser(user);

        getAllUsersData().then((usersData) => {
          listAllUsers(usersData, user);
        });

        getAllDms(user).then((dms) => {
          const activeDms = filterActiveDms(dms, user);

          appendActiveDms(activeDms);
        });
      });
    });

    //when a user disconnnects repeat the above again
    socket.on("user disconnected", async () => {
      getCurrentUsersInfo().then((user) => {
        getAllUsersData().then((usersData) => {
          listAllUsers(usersData, user);
        });

        getAllDms(user).then((dms) => {
          const activeDms = filterActiveDms(dms, user);

          appendActiveDms(activeDms);
        });
      });
    });

    socket.on("dm started", async () => {
      getCurrentUsersInfo().then((user) => {
        getAllDms(user).then((dms) => {
          const activeDms = filterActiveDms(dms, user);

          appendActiveDms(activeDms);
        });
      });
    });

    //handles room change on click of room list item
    roomList.click(function (event) {
      const room = $(event.target).text().replace("#", "").trim();
      console.log(room.length);
      loadRoom(room);

      socket.emit("join room", { username: currentUser.username, room: room });
    });

    //handles starting dms when sent through modal
    $("#direct-msg-form").submit(async function (event) {
      event.preventDefault();

      const directMsg = $("#direct-msg-input").val().trim();
      const receiver = $("#modal-username").text().trim();

      if (directMsg && receiver) {
        const receiverData = await getReceiverUsername(receiver);
        const user = await getCurrentUsersInfo();
        const res = await saveDm(directMsg, receiverData, user);

        if (res) {
          socket.emit("dm started", {
            directMsg,
            receiver,
          });

          $("#userInfoModal").hide();
          $("#direct-msg-input").val("");

          const dms = await getAllDms(user);
          const userDmList = filterActiveDms(dms, user);
          appendActiveDms(userDmList);
        }
      } else {
        //error :(
      }
    });

    // const currentUser = await getCurrentUsersInfo();
    // const usersData = await getAllUsersData();
    // const dms = await getAllDms(currentUser);
    // const activeDms = filterActiveDms(dms, currentUser);

    // socket.on("user connected", async () => {
    //   const usersData = await getAllUsersData();
    //   const dms = await getAllDms(currentUser);
    //   const activeDms = filterActiveDms(dms, currentUser);
    //   appendActiveDms(activeDms);
    //   listAllUsers(usersData);
    // });

    // socket.on("user disconnected", async () => {
    //   socket.emit("this", { currentUser });
    //   const usersData = await getAllUsersData();
    //   listAllUsers(usersData);
    //   const dms = await getAllDms(currentUser);
    //   const activeDms = filterActiveDms(dms, currentUser);
    //   appendActiveDms(activeDms);
    //   listAllUsers(usersData);
    // });

    // socket.on("dm started", async (directMsg, receiver) => {
    //   const dms = await getAllDms(currentUser);
    //   const activeDms = filterActiveDms(dms, currentUser);
    //   appendActiveDms(activeDms);
    // });

    // listAllUsers(usersData);
    // displayCurrentUser(currentUser);

    // appendActiveDms(activeDms);

    // addActiveRoom();

    function listAllUsers(usersData, { username }) {
      userList.empty();
      usersData.forEach((user) => {
        if (user.username === username) return;

        if (user.favTech) {
          userList.append(
            `<li class="list-group-item user-list-item" data-user-id="${
              user.id
            }">
            <div class="d-flex justify-content-center group-user">
              <div class="position-relative">
                <img class="border rounded-circle" height="50px" src="${
                  user.pfp
                }" alt="users profile">
                <span class="position-absolute online-status translate-middle badge border border-light rounded-circle ${checkIfActive(
                  user.isActive
                )} p-2"><span class="visually-hidden">online status</span></span>
                
                <div class="d-flex gap-1">
                  <p>${user.username}</p>
                  <img height="20px"
                    src="${user.favTech}"
                    alt="language icon" />
                </div>
              </div>
            </div>
          </li>`
          );
        } else {
          userList.append(
            `<li class="list-group-item user-list-item" data-user-id="${
              user.id
            }">
            <div class="d-flex justify-content-center group-user">
              <div class="position-relative">
                <img class="border rounded-circle" height="50px" src="${
                  user.pfp
                }" alt="users profile">
                <span class="position-absolute online-status translate-middle badge border border-light rounded-circle ${checkIfActive(
                  user.isActive
                )} p-2"><span class="visually-hidden">online status</span></span>
                
                <div class="d-flex gap-1">
                  <p>${user.username}</p>
                </div>
              </div>
            </div>
          </li>`
          );
        }
        // userList.append(
        //   `<li data-user-id="${user.id}" class="user-list-item" >
        //         <img class='active-list-pfp' src='${user.pfp}'></img>
        //         <span>${user.username} <span class="${checkIfActive(
        //     user.isActive
        //   )}">●</span></li>`
        // );
      });

      if ($("#user-list").length < 1) {
        const noUsers = $(
          "<p class='m-0 text-center'>Your the only one! So lonely...</p>"
        );
        userList.append(noUsers);
      }
    }

    function displayCurrentUser({ username, pfp }) {
      $("#current-user-pfp").attr("src", `${pfp}`);
      $("#slideout-username").text(username);
    }

    async function getAllUsersData() {
      try {
        const response = await fetch("/api/users", {
          method: "get",
          "Content-type": "application/json",
        });
        return response.json();
      } catch (error) {
        //error:(
      }
    }

    function checkIfActive(isActive) {
      if (isActive) return "logged-in";
      return "logged-out";
    }

    async function getCurrentUsersInfo() {
      try {
        const userInfo = await fetch("/api/users/session");
        return userInfo.json();
      } catch (error) {
        //error:(
      }
    }

    function addActiveRoom() {
      const inRoom = $(".room-title").text().replace("#", "").trim();

      roomList.children().each(function () {
        if ($(this).text().replace("#", "").trim() === inRoom) {
          console.log(inRoom);
          $(this).addClass("active-room");
        } else $(this).removeClass("active-room");
      });
    }

    async function getAllDms({ user_id }) {
      try {
        const response = await fetch(`/api/dm/get-all-dms/${user_id}`, {
          method: "get",
          headers: { "Content-Type": "application/json" },
        });
        return response.json();
      } catch (error) {
        //error:(
      }
    }

    //gets a list of usernames to show active dms
    function filterActiveDms(dms, currentUser) {
      const userNames = [];

      dms.forEach((dm) => {
        userNames.push(dm.receiver);
        userNames.push(dm.sender);
      });

      let activeDms = userNames.filter((user) => {
        return user.username != currentUser.username;
      });

      activeDms = activeDms.filter(
        (user, index, self) =>
          index ===
          self.findIndex(
            (key) => key.username === user.username && key.name === user.name
          )
      );

      return activeDms;
    }

    function appendActiveDms(users) {
      dmList.empty();
      if (!users.length) {
        dmList.append(
          "<li class='list-group-item empty-dms'>You have no dms, to start a dm click on a users name</ li>"
        );
        return;
      }
      users.forEach((user) => {
        if (user.favTech) {
          dmList.append(
            `<li class="list-group-item user-list-item" data-username="${
              user.username
            }">
            <div class="d-flex justify-content-center group-user">
              <div class="position-relative">
                <img class="border rounded-circle" height="50px" src="${
                  user.pfp
                }" alt="users profile">
                <span class="position-absolute online-status translate-middle badge border border-light rounded-circle ${checkIfActive(
                  user.isActive
                )} p-2"><span class="visually-hidden">online status</span></span>
                
                <div class="d-flex gap-1">
                  <p>${user.username}</p>
                  <img height="20px"
                    src="${user.favTech}"
                    alt="language icon" />
                </div>
              </div>
            </div>
          </li>`
          );
        } else {
          dmList.append(
            `<li class="list-group-item user-list-item" data-username="${
              user.username
            }">
            <div class="d-flex justify-content-center group-user">
              <div class="position-relative">
                <img class="border rounded-circle" height="50px" src="${
                  user.pfp
                }" alt="users profile">
                <span class="position-absolute online-status translate-middle badge border border-light rounded-circle ${checkIfActive(
                  user.isActive
                )} p-2"><span class="visually-hidden">online status</span></span>
                
                <div class="d-flex gap-1">
                  <p>${user.username}</p>
                </div>
              </div>
            </div>
          </li>`
          );
        }
      });
    }

    function loadRoom(room) {
      document.location.href = `/room/${room}`;
    }

    async function saveDm(directMsg, receiverData, user) {
      try {
        const response = await fetch("/api/dm/save-dm-message", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: directMsg,
            receiver: receiverData,
            sender: user,
          }),
        });
        return response;
      } catch (error) {
        //error:(
      }
    }

    async function getReceiverUsername(receiverUsername) {
      try {
        const res = await fetch(`/api/users/user-id/${receiverUsername}`, {
          method: "get",
        });
        return res.json();
      } catch (error) {
        //error:(
      }
    }

    function loadDmRoom(username) {
      document.location.href = `/directmessages/${username}`;
    }

    //on click on dms list load the dm chat room
    $("#direct-msg-list").on("click", "li", async function () {
      const username = $(this).data().username;

      loadDmRoom(username);
    });

    $("body").on("click", "#account-btn", function () {
      $("#explore-slide").toggleClass("active");
      $(".hamburger-menu").toggleClass("is-active");
    });

    $("body").on("click", ".accordion-heading", function () {
      $(".list-container, .accordion-heading").each(function () {
        $(this).removeClass("active");
      });
      $(this).addClass("active");
      $(this).next(".list-container").addClass("active");
    });
  }
});

const express = require("express");
const app = express();

const path = require("path");

const session = require("express-session");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const bcrypt = require("bcrypt");

const PORT = process.env.PORT || 3001;

const sess = {
  secret: "secret that no one knows",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

const routes = require("./routes");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

const server = require("http").createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    socket.on("chat message", ({ msg, username, userId }) => {
      console.log("\nthis is the room:" + room);
      io.to(room).emit("chat message", { msg, username, userId });
    });

    socket.on("disconnect", (socket) => {
      io.emit("user disconnect");
    });
  });
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("listening on *:3001");
  });
});

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const sequelize = require("./config/connection");
const User = require("./models/User");
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
  io.emit("user connected");
  console.log(
    `\n A User has signed or logged in. Their socket id is ${socket.id} \n`
  );

  socket.on("chat message", ({ msg, username, userId }) => {
    io.emit("chat message", { msg, username, userId });
  });

  //disconnect fires when a user exits the localhost server
  socket.on("disconnect", (socket) => {
    console.log("\n A user has disconnected. \n");
    io.emit("user disconnect");
  });

  socket.on("join second room", (sessionData) => {
    console.log(sessionData);
  });
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("listening on *:3001");
  });
});

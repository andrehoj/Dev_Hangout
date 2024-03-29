require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const routes = require("./routes");
const { engine } = require("express-handlebars");

const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {});
});

io.on("connection", (socket) => {
  socket.broadcast.emit("user connected", socket.id);

  socket.on("join room", ({ room }) => {
    socket.join(room);
  });

  socket.on(
    "chat message",
    ({ message, username, pfp, room, favColor, isCodeBlock }) => {
      io.to(room).emit("chat message", {
        message,
        username,
        pfp,
        favColor,
        isCodeBlock,
      });
    }
  );

  socket.on(
    "direct message",
    ({ message, receiver, sender, timeOfMessage, isCodeBlock }) => {
      socket.join(receiver.socketId);

      io.to(receiver.socketId).emit("direct message", {
        message,
        receiver,
        sender,
        timeOfMessage,
        isCodeBlock,
      });
    }
  );

  socket.on("disconnect", (socket) => {
    io.emit("user disconnected");
  });

  socket.on("dm started", (directMsg, receiver) => {
    io.emit("dm started", { directMsg, receiver });
  });
});

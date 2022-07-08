const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bcrypt = require("bcrypt");
const routes = require("./routes");

const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SECRET,
  name: "__sessIden",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));
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
  socket.broadcast.emit("user connected");

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    socket.on("chat message", ({ msg, username, userId, pfp }) => {
      io.to(room).emit("chat message", { msg, username, userId, pfp });
    });

    socket.on("disconnect", (socket) => {
      io.emit("user disconnect");
    });
  });

  //socket.to(socketId).emit()
});

sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log("🚀 live on localhost:3001");
  });
});

//res.redirect

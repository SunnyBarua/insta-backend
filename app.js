const express = require("express");
const app = express();
const cors=require('cors')
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require("./keys");
app.use(cors())

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("connected to mongo!!!");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting!!", err);
});

const User = require("./models/user");
const Post = require("./models/post");

const auth = require("./routes/auth");
const post = require("./routes/post");
const user = require("./routes/user");

app.use(express.json());

app.use(auth);
app.use(post);
app.use(user);

app.listen(PORT, () => {
  console.log("server is running on ", PORT);
});

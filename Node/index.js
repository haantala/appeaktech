const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const paths = require("path");
const bodyParser = require("body-parser");
const { PORT, NODE_ENV, USERNAME, ROLE, PASSWORD, EMAIL } = require("./config");
const app = express();
const env = NODE_ENV;
const path = require("path");
const fs = require("fs");
const fileupload = require("express-fileupload");
const webPush = require("web-push");
const {
  createSuperAdminUserService,
} = require("./module/authentication/authentication.service");
sequelize.sync();
app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(express.static("files"));

const folder = path.join(__dirname, `./media`);
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}
app.use("/media", express.static(path.join(__dirname, "media")));

app.use(bodyParser.json({ limit: "1024mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "2048mb",
    extended: true,
    parameterLimit: 102400000,
  })
);

// Importing routes
const routes = [
  require("./module/authentication/authentication.routes"),
  require("./module/media/media.routes"),
];

routes.forEach((route) => app.use(route));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// // Server setup
const server = app.listen(PORT, function () {
  createSuperAdminUserService({
    role: ROLE,
    email: EMAIL,
    username: USERNAME,
    password: PASSWORD,
  });
  console.log("=================================");
  console.log(`========== ENV: ${env} ===========`);
  console.log(`🚀 App listening on the port ${PORT}`);
  console.log("=================================");
});

const {
  LoginController,
  RegistrationController,
} = require("./authentication.controller");

const router = require("express").Router();

router.post("/login", LoginController);
router.post("/registration", RegistrationController);

module.exports = router;

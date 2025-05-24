const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  LoginService,
  RegistrationService,
} = require("./authentication.service");

const RegistrationController = async (req, res) => {
  try {
    const registrationData = req.body;
    console.log("====================================");
    console.log(registrationData);
    console.log("====================================");
    const data = await RegistrationService(registrationData);
    if (data.status === 1) {
      ResponseHelpers.success(res, data.data, data.description);
    } else if (data.status === 2) {
      ResponseHelpers.error(res, data.description);
    } else if (data.status === 3) {
      ResponseHelpers.badRequest(res, data.description);
    } else if (data.status === 4) {
      ResponseHelpers.InternalServerError(res, data.description);
    }
  } catch (error) {
    console.log(
      "====================== ERROR FROM LoginController CONTROLLER ======================"
    );
    console.log(error);
    ResponseHelpers.InternalServerError(
      res,
      "Something Went Wrong, Please Try Again..."
    );
  }
};

const LoginController = async (req, res) => {
  try {
    const logindata = req.body;
    const data = await LoginService(logindata);
    if (data.status === 1) {
      ResponseHelpers.success(res, data.data, data.description);
    } else if (data.status === 2) {
      ResponseHelpers.error(res, data.description);
    } else if (data.status === 3) {
      ResponseHelpers.badRequest(res, data.description);
    } else if (data.status === 4) {
      ResponseHelpers.InternalServerError(res, data.description);
    }
  } catch (error) {
    console.log(
      "====================== ERROR FROM LoginController CONTROLLER ======================"
    );
    console.log(error);
    ResponseHelpers.InternalServerError(
      res,
      "Something Went Wrong, Please Try Again..."
    );
  }
};

module.exports = {
  LoginController,
  RegistrationController,
};

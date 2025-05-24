const ResponseHelpers = require("../../Helper/ResponseHelper");
const { UserModel } = require("../../models");
const md5 = require("md5");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");

const RegistrationService = async (data) => {
  try {
    const { email, password, role, username } = data;
    const userData = await UserModel.findOne({
      where: {
        email: email,
      },
    });
    if (userData === null) {
      const registrationData = await UserModel.create({
        username: username,
        role: role,
        email: email,
        password: md5(password),
      });
      if (registrationData !== null) {
        return ResponseHelpers.serviceToController(
          1,
          registrationData.dataValues,
          "Registation Successfully."
        );
      } else {
        return ResponseHelpers.serviceToController(
          3,
          [],
          "Registation Not Successfully."
        );
      }
    } else {
      return ResponseHelpers.serviceToController(
        0,
        [],
        "Email id is Already Registered."
      );
    }
  } catch (error) {
    console.log("==========ERROR FROM Authentication SERVICE ============ ");
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM Authentication SERVICE CATCH"
    );
  }
};

const LoginService = async (logindata) => {
  try {
    console.log("====================================");
    console.log(logindata);
    console.log("====================================");
    const { email, password } = logindata;
    const payload = {
      email: logindata.email,
      password: logindata.password,
      timestamp: moment().format("DD-MM-YYYYHH:mm:ss.SSS"),
    };
    const token = jwt.sign(payload, SECRET_KEY);
    const data = await UserModel.update(
      {
        token: token,
      },
      {
        where: {
          email: email,
        },
      }
    );
    if (data[0] !== 0) {
      const UpdateUserAuthToken = await UserModel.findOne({
        where: {
          email: email,
          password: md5(password),
        },
      });
      if (UpdateUserAuthToken !== null) {
        return ResponseHelpers.serviceToController(
          1,
          UpdateUserAuthToken,
          "Login Successfully."
        );
      }
    } else {
      return ResponseHelpers.serviceToController(
        2,
        "User Name or Password are Invalid"
      );
    }
  } catch (error) {
    console.log("==========ERROR FROM Authentication SERVICE ============ ");
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM Authentication SERVICE CATCH"
    );
  }
};

const createSuperAdminUserService = async (data) => {
  try {
    const { username, role, email, password } = data;
    const getSuperUser = await UserModel.findOne({
      where: {
        role: "admin",
      },
    });
    if (getSuperUser === null) {
      const insertUser = await UserModel.create({
        username: username,
        email: email,
        password: md5(password),
        role: role,
      });
      if (insertUser !== null) {
        return ResponseHelpers.serviceToController(
          1,
          insertUser.dataValues,
          "Super User Added Successfully"
        );
      } else {
        return ResponseHelpers.serviceToController(2, [], "User Not Added");
      }
    } else {
      console.log("====================================");
      console.log("SuperAdmin Already Exist");
      console.log("====================================");
    }
  } catch (error) {
    console.log(
      "==========ERROR FROM createSuperAdminUserService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM createSuperAdminUserService SERVICE CATCH"
    );
  }
};

module.exports = {
  LoginService,
  createSuperAdminUserService,
  RegistrationService,
};

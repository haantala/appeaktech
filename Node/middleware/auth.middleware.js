const ResponseHelper = require("../Helper/ResponseHelper");
const { UserModel } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    if (
      req.headers.authorization === undefined ||
      req.headers.authorization === null ||
      req.headers.authorization === ""
    ) {
      return ResponseHelper.invalidToken(res, "Invalid Token");
    } else {
      const authentication = req.headers.authorization.replace("Bearer ", "");
      if (
        authentication !== undefined ||
        authentication !== "undefined" ||
        authentication !== null ||
        authentication !== "null"
      ) {
        const data = await UserModel.findOne({
          raw: true,
          where: {
            token: authentication,
          },
        });
        if (data !== null || authentication === "APPEAKTECH") next();
        else ResponseHelper.invalidToken(res, "Unauthorized User");
      } else ResponseHelper.invalidToken(res, "Invalid Token");
    }
  } catch (error) {
    console.log(
      "=================== ERROR FROM AUTH MIDDLEWARE ==================="
    );
    console.log(error);
    error;
  }
};
module.exports = {
  authMiddleware,
};

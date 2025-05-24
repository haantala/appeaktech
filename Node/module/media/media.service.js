const { Op } = require("sequelize");
const ResponseHelpers = require("../../Helper/ResponseHelper");
const { MediaModel } = require("../../models");
const { fileUploadFunction } = require("../common/fileupload");
const path = require("path");

const uploadMediaService = async (data) => {
  try {
    const { title, file, expiryTime } = data;
    let userProfileImage;
    const fileUploadData = fileUploadFunction(file);
    userProfileImage = fileUploadData.data;
    const uploadmedia = await MediaModel.create({
      title: title,
      media_name: userProfileImage.name,
      media_type: userProfileImage.mimetype,
      media_url: `http://localhost:5003/media/${userProfileImage.name}`,
      media_expiration: expiryTime,
      media_size: userProfileImage.size.toString(),
    });
    if (uploadmedia !== null) {
      return ResponseHelpers.serviceToController(
        1,
        uploadmedia.dataValues,
        "Media Uploaded Successfully."
      );
    } else {
      return ResponseHelpers.serviceToController(
        3,
        [],
        "Media Not Uploaded Successfully."
      );
    }
  } catch (error) {
    console.log(
      "==========ERROR FROM uploadMediaService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM uploadMediaService SERVICE CATCH"
    );
  }
};

const getActiveMediaService = async (data) => {
  try {
    const getMedia = await MediaModel.findAll({
      where: {
        media_expiration: {
          [Op.gt]: new Date(),
        },
      },
    });
    if (getMedia !== null) {
      return ResponseHelpers.serviceToController(
        1,
        getMedia,
        "Active Media Found."
      );
    } else {
      return ResponseHelpers.serviceToController(3, [], "Media Not Found.");
    }
  } catch (error) {
    console.log("==========ERROR FROM getMediaService SERVICE ============ ");
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM getMediaService SERVICE CATCH"
    );
  }
};

const getExpiredMediaService = async (data) => {
  try {
    const getMedia = await MediaModel.findAll({
      where: {
        media_expiration: {
          [Op.lt]: new Date(),
        },
      },
    });
    if (getMedia !== null) {
      return ResponseHelpers.serviceToController(
        1,
        getMedia,
        "Expired Media Found."
      );
    } else {
      return ResponseHelpers.serviceToController(3, [], "Media Not Found.");
    }
  } catch (error) {
    console.log(
      "==========ERROR FROM getExpiredMediaService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM getExpiredMediaService SERVICE CATCH"
    );
  }
};

const getMediabyIdService = async (data, res) => {
  try {
    const getMedia = await MediaModel.findOne({
      where: {
        media_id: data,
      },
    });
    if (getMedia !== null) {
      // Construct the dynamic file path
      return ResponseHelpers.serviceToController(
        1,
        getMedia.dataValues,
        "Media Found."
      );
    } else {
      return ResponseHelpers.serviceToController(3, [], "Media Not Found.");
    }
  } catch (error) {
    console.log("==========ERROR FROM getMediabyId SERVICE ============ ");
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM getMediabyId SERVICE CATCH"
    );
  }
};

const deleteMediaService = async (data, res) => {
  try {
    const getMedia = await MediaModel.destroy({
      where: {
        media_id: data,
      },
    });
    if (getMedia !== null) {
      // Construct the dynamic file path
      return ResponseHelpers.serviceToController(
        1,
        getMedia.dataValues,
        "Media Deleted."
      );
    } else {
      return ResponseHelpers.serviceToController(3, [], "Media Not Deleted");
    }
  } catch (error) {
    console.log(
      "==========ERROR FROM deleteMediaService SERVICE ============ "
    );
    console.log(error);
    return ResponseHelpers.serviceToController(
      4,
      [],
      "ERROR FROM deleteMediaService SERVICE CATCH"
    );
  }
};

module.exports = {
  uploadMediaService,
  getActiveMediaService,
  getExpiredMediaService,
  getMediabyIdService,
  deleteMediaService,
};

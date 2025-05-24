const ResponseHelpers = require("../../Helper/ResponseHelper");
const {
  uploadMediaService,
  getActiveMediaService,
  getExpiredMediaService,
  getMediabyIdService,
  deleteMediaService,
} = require("./media.service");

const uploadMediaController = async (req, res) => {
  try {
    const mediaData = { ...req.body, ...req.files };
    const data = await uploadMediaService(mediaData);
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
      "====================== ERROR FROM uploadMediaController CONTROLLER ======================"
    );
    console.log(error);
    ResponseHelpers.InternalServerError(
      res,
      "Something Went Wrong, Please Try Again..."
    );
  }
};

const getActiveMediaController = async (req, res) => {
  try {
    const data = await getActiveMediaService();
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
      "====================== ERROR FROM getActiveMediaController CONTROLLER ======================"
    );
    console.log(error);
    ResponseHelpers.InternalServerError(
      res,
      "Something Went Wrong, Please Try Again..."
    );
  }
};

const getExpiredMediaController = async (req, res) => {
  try {
    const data = await getExpiredMediaService();
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
      "====================== ERROR FROM getExpiredMediaController CONTROLLER ======================"
    );
    console.log(error);
    ResponseHelpers.InternalServerError(
      res,
      "Something Went Wrong, Please Try Again..."
    );
  }
};

const getMediabyIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getMediabyIdService(id);
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
      "====================== ERROR FROM getExpiredMediaController CONTROLLER ======================"
    );
    console.log(error);
    ResponseHelpers.InternalServerError(
      res,
      "Something Went Wrong, Please Try Again..."
    );
  }
};

const deleteMediaController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deleteMediaService(id);
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
      "====================== ERROR FROM deleteMediaController CONTROLLER ======================"
    );
    console.log(error);
    ResponseHelpers.InternalServerError(
      res,
      "Something Went Wrong, Please Try Again..."
    );
  }
};

module.exports = {
  uploadMediaController,
  getActiveMediaController,
  getExpiredMediaController,
  getMediabyIdController,
  deleteMediaController,
};

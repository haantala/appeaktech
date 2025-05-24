const {
  uploadMediaController,
  getActiveMediaController,
  getExpiredMediaController,
  getMediabyIdController,
  deleteMediaController,
} = require("./media.controller");

const router = require("express").Router();

router.post("/uploadmedia", uploadMediaController);
router.get("/getactivemedia", getActiveMediaController);
router.get("/getexpiredmedia", getExpiredMediaController);
router.get("/getmediabyid/:id", getMediabyIdController);
router.delete("/deletemedia/:id", deleteMediaController);

module.exports = router;

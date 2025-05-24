const { authMiddleware } = require("../../middleware/auth.middleware");
const {
  uploadMediaController,
  getActiveMediaController,
  getExpiredMediaController,
  getMediabyIdController,
  deleteMediaController,
} = require("./media.controller");

const router = require("express").Router();

router.post("/uploadmedia", authMiddleware, uploadMediaController);
router.get("/getactivemedia", authMiddleware, getActiveMediaController);
router.get("/getexpiredmedia", authMiddleware, getExpiredMediaController);
router.get("/getmediabyid/:id", authMiddleware, getMediabyIdController);
router.delete("/deletemedia/:id", authMiddleware, deleteMediaController);

module.exports = router;

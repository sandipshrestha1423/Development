const express = require("express");
const router = express.Router();

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
} = require("../controllers/serviceController");

const auth = require("../middleware/auth");

router.get("/", getAllServices);

router.get("/my", auth, getMyServices);

router.get("/:id", getServiceById);

router.post("/", auth, createService);

router.put("/:id", auth, updateService);

router.delete("/:id", auth, deleteService);

module.exports = router;
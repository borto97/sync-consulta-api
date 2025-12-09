const express = require("express");
const router = express.Router();

const controller = require("../controllers/recordController");

router.put("/:recordId", controller.updateRecord);
router.delete("/:recordId", controller.deleteRecord);

module.exports = router;

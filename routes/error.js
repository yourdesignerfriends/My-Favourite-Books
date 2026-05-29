const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Ruta para probar un error intencional
router.get("/test-error", errorController.triggerError);

module.exports = router;
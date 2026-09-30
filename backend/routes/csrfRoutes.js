const express = require("express");
const { getCsrfTokenHandler } = require("../controllers/csrfController");

const router = express.Router();

router.get("/csrf-token", getCsrfTokenHandler);

module.exports = router;
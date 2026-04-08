const express = require("express");
const config = require("../config/env");

function createHealthRouter() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json({
      ok: true,
      dataMode: config.dataMode,
    });
  });

  return router;
}

module.exports = {
  createHealthRouter,
};

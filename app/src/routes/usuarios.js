const express = require("express");
const {
  requireInteger,
  requireString,
} = require("../services/validators");

function createUsuariosRouter(crudService) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const data = await crudService.listUsuarios();
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:idu", async (req, res, next) => {
    try {
      const data = await crudService.getUsuario(
        requireInteger(req.params.idu, "idu")
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = {
        idu: requireInteger(req.body.idu, "idu"),
        nombre: requireString(req.body.nombre, "nombre"),
      };
      const created = await crudService.createUsuario(payload);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:idu", async (req, res, next) => {
    try {
      const updated = await crudService.updateUsuario(
        requireInteger(req.params.idu, "idu"),
        {
          idu: requireInteger(req.body.idu, "idu"),
          nombre: requireString(req.body.nombre, "nombre"),
        }
      );
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:idu", async (req, res, next) => {
    try {
      const result = await crudService.deleteUsuario(
        requireInteger(req.params.idu, "idu")
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = {
  createUsuariosRouter,
};

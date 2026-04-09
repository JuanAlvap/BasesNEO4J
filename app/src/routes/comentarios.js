const express = require("express");
const {
  requireString,
  requireInteger,
  normalizeLikeNotLike,
  requireIsoDate,
} = require("../services/validators");

function createComentariosRouter(crudService) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const data = await crudService.listComentarios();
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:idp/:consec", async (req, res, next) => {
    try {
      const data = await crudService.getComentarioById(
        requireInteger(req.params.idp, "idp"),
        requireInteger(req.params.consec, "consec")
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:consec", async (req, res, next) => {
    try {
      const data = await crudService.getComentarioByConsec(
        requireInteger(req.params.consec, "consec")
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = {
        idp: requireInteger(req.body.idp, "idp"),
        consec: requireInteger(req.body.consec, "consec"),
        fechorCom: requireIsoDate(req.body.fechorCom, "fechorCom"),
        contenidoCom: requireString(req.body.contenidoCom, "contenidoCom"),
        fechorAut: requireIsoDate(req.body.fechorAut, "fechorAut"),
        likeNotLike: normalizeLikeNotLike(req.body.likeNotLike),
        iduAutor: requireInteger(req.body.iduAutor, "iduAutor"),
        iduAutorizador: requireInteger(req.body.iduAutorizador, "iduAutorizador"),
      };

      const created = await crudService.createComentario(payload);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:idp/:consec", async (req, res, next) => {
    try {
      const updated = await crudService.updateComentario(
        requireInteger(req.params.idp, "idp"),
        requireInteger(req.params.consec, "consec"),
        {
          consec: requireInteger(req.body.consec, "consec"),
          idp: requireInteger(req.body.idp, "idp"),
          fechorCom: requireIsoDate(req.body.fechorCom, "fechorCom"),
          contenidoCom: requireString(req.body.contenidoCom, "contenidoCom"),
          fechorAut: requireIsoDate(req.body.fechorAut, "fechorAut"),
          likeNotLike: normalizeLikeNotLike(req.body.likeNotLike),
          iduAutor: requireInteger(req.body.iduAutor, "iduAutor"),
          iduAutorizador: requireInteger(req.body.iduAutorizador, "iduAutorizador"),
        }
      );
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:idp/:consec", async (req, res, next) => {
    try {
      const result = await crudService.deleteComentario(
        requireInteger(req.params.idp, "idp"),
        requireInteger(req.params.consec, "consec")
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = {
  createComentariosRouter,
};

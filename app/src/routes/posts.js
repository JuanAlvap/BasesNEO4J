const express = require("express");
const {
  requireInteger,
  requireString,
} = require("../services/validators");

function createPostsRouter(crudService) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const data = await crudService.listPosts();
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:idp", async (req, res, next) => {
    try {
      const data = await crudService.getPost(
        requireInteger(req.params.idp, "idp")
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
        contenido: requireString(req.body.contenido, "contenido"),
        iduAutor: requireInteger(req.body.iduAutor, "iduAutor"),
      };
      const created = await crudService.createPost(payload);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:idp", async (req, res, next) => {
    try {
      const updated = await crudService.updatePost(
        requireInteger(req.params.idp, "idp"),
        {
          idp: requireInteger(req.body.idp, "idp"),
          contenido: requireString(req.body.contenido, "contenido"),
          iduAutor: requireInteger(req.body.iduAutor, "iduAutor"),
        }
      );
      res.json(updated);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:idp", async (req, res, next) => {
    try {
      const result = await crudService.deletePost(
        requireInteger(req.params.idp, "idp")
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = {
  createPostsRouter,
};

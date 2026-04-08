function createConsultasRouter(crudService) {
  const express = require("express");
  const router = express.Router();

  // CONSULTA 1: Posts de un usuario específico
  router.get("/posts-por-usuario/:idu", async (req, res, next) => {
    try {
      const idu = parseInt(req.params.idu, 10);
      if (isNaN(idu)) {
        return res.status(400).json({ message: "El idu debe ser un número" });
      }

      const posts = await crudService.getPostsByUsuario(idu);
      res.json({
        statusOk: true,
        status: 200,
        data: posts,
        message: posts.length === 0 ? "El usuario no tiene posts" : undefined,
      });
    } catch (error) {
      next(error);
    }
  });

  // CONSULTA 2: Comentarios de un post
  router.get("/comentarios-por-post/:idp", async (req, res, next) => {
    try {
      const idp = parseInt(req.params.idp, 10);
      if (isNaN(idp)) {
        return res.status(400).json({ message: "El idp debe ser un número" });
      }

      const post = await crudService.getComentariosByPost(idp);
      const postDetails = await crudService.getPost(idp);

      res.json({
        statusOk: true,
        status: 200,
        post: postDetails,
        comentarios: post,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = {
  createConsultasRouter,
};

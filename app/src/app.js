const path = require("path");
const express = require("express");
const { createRepositories } = require("./services/repositoryFactory");
const { createCrudService } = require("./services/crudService");
const { createUsuariosRouter } = require("./routes/usuarios");
const { createPostsRouter } = require("./routes/posts");
const { createComentariosRouter } = require("./routes/comentarios");
const { createConsultasRouter } = require("./routes/consultas");
const { createHealthRouter } = require("./routes/health");
const { AppError } = require("./services/errors");

const app = express();

app.use(express.json());

const repos = createRepositories();
const crudService = createCrudService(repos);

app.use("/api/health", createHealthRouter());
app.use("/api/usuarios", createUsuariosRouter(crudService));
app.use("/api/posts", createPostsRouter(crudService));
app.use("/api/comentarios", createComentariosRouter(crudService));
app.use("/api/consultas", createConsultasRouter(crudService));

app.use(express.static(path.resolve(process.cwd(), "public")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "index.html"));
});

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Error interno del servidor." });
});

module.exports = app;

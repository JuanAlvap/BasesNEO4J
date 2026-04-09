const { AppError } = require("./errors");

function createCrudService(repos) {
  const { usuariosRepo, postsRepo, comentariosRepo } = repos;

  return {
    async createUsuario(payload) {
      const existing = await usuariosRepo.getById(payload.idu);
      if (existing) {
        throw new AppError(409, `Ya existe USUARIO con idu ${payload.idu}.`);
      }
      return usuariosRepo.create(payload);
    },

    listUsuarios() {
      return usuariosRepo.list();
    },

    async getUsuario(idu) {
      const usuario = await usuariosRepo.getById(idu);
      if (!usuario) {
        throw new AppError(404, "USUARIO no encontrado.");
      }
      return usuario;
    },

    async updateUsuario(idu, payload) {
      const existing = await usuariosRepo.getById(idu);
      if (!existing) {
        throw new AppError(404, "USUARIO no encontrado.");
      }

      // Validar que el nuevo idu no exista ya (si cambió)
      if (payload.idu !== idu) {
        const duplicado = await usuariosRepo.getById(payload.idu);
        if (duplicado) {
          throw new AppError(409, `Ya existe USUARIO con idu ${payload.idu}.`);
        }
      }

      return usuariosRepo.update(idu, payload);
    },

    async deleteUsuario(idu) {
      const existing = await usuariosRepo.getById(idu);
      if (!existing) {
        throw new AppError(404, "USUARIO no encontrado.");
      }

      const hasPosts = await postsRepo.existsByAuthor(idu);
      const hasComentarios = await comentariosRepo.existsByAuthorOrAuthorizer(idu);

      if (hasPosts || hasComentarios) {
        throw new AppError(
          409,
          "No se puede borrar USUARIO con POST o COMENTARIO asociado."
        );
      }

      await usuariosRepo.remove(idu);
      return { deleted: true };
    },

    async createPost(payload) {
      const existingPost = await postsRepo.getById(payload.idp);
      if (existingPost) {
        throw new AppError(409, `Ya existe POST con idp ${payload.idp}.`);
      }

      const author = await usuariosRepo.getById(payload.iduAutor);
      if (!author) {
        throw new AppError(400, "El USUARIO autor no existe.");
      }

      return postsRepo.create(payload);
    },

    listPosts() {
      return postsRepo.list();
    },

    async getPost(idp) {
      const post = await postsRepo.getById(idp);
      if (!post) {
        throw new AppError(404, "POST no encontrado.");
      }
      return post;
    },

    async updatePost(idp, payload) {
      const existing = await postsRepo.getById(idp);
      if (!existing) {
        throw new AppError(404, "POST no encontrado.");
      }

      // Validar que el nuevo autor existe si cambió
      if (payload.iduAutor !== existing.iduAutor) {
        const autor = await usuariosRepo.getById(payload.iduAutor);
        if (!autor) {
          throw new AppError(400, "El USUARIO autor del post no existe.");
        }
      }

      return postsRepo.update(idp, payload);
    },

    async deletePost(idp) {
      const existing = await postsRepo.getById(idp);
      if (!existing) {
        throw new AppError(404, "POST no encontrado.");
      }
      await comentariosRepo.removeByPost(idp);
      await postsRepo.remove(idp);
      return { deleted: true };
    },

    async createComentario(payload) {
      const post = await postsRepo.getById(payload.idp);
      if (!post) {
        throw new AppError(400, "El POST no existe.");
      }

      const author = await usuariosRepo.getById(payload.iduAutor);
      if (!author) {
        throw new AppError(400, "El USUARIO autor del comentario no existe.");
      }

      const existing = await comentariosRepo.getById(payload.idp, payload.consec);
      if (existing) {
        throw new AppError(
          409,
          `Ya existe COMENTARIO con idp ${payload.idp} y consec ${payload.consec}.`
        );
      }

      return comentariosRepo.create(payload);
    },

    listComentarios() {
      return comentariosRepo.list();
    },



    async updateComentario(idp, consec, payload) {
      const existing = await comentariosRepo.getById(idp, consec);
      if (!existing) {
        throw new AppError(404, "COMENTARIO no encontrado.");
      }

      // Validar que la nueva combinación no existe ya (si cambió)
      if (payload.idp !== idp || payload.consec !== consec) {
        const duplicado = await comentariosRepo.getById(payload.idp, payload.consec);
        if (duplicado) {
          throw new AppError(
            409,
            `Ya existe COMENTARIO con idp ${payload.idp} y consec ${payload.consec}.`
          );
        }
      }

      // Validar que el post existe si cambió
      if (payload.idp !== existing.idp) {
        const post = await postsRepo.getById(payload.idp);
        if (!post) {
          throw new AppError(400, "El POST no existe.");
        }
      }

      // Validar que el autor existe si cambió
      if (payload.iduAutor !== existing.iduAutor) {
        const autor = await usuariosRepo.getById(payload.iduAutor);
        if (!autor) {
          throw new AppError(400, "El USUARIO autor del comentario no existe.");
        }
      }

      // Validar que el autorizador existe si cambió y es diferente de null
      if (payload.iduAutorizador && payload.iduAutorizador !== existing.iduAutorizador) {
        const autorizador = await usuariosRepo.getById(payload.iduAutorizador);
        if (!autorizador) {
          throw new AppError(400, "El USUARIO autorizador del comentario no existe.");
        }
      }

      return comentariosRepo.update(idp, consec, payload);
    },

    async deleteComentario(idp, consec) {
      const existing = await comentariosRepo.getById(idp, consec);
      if (!existing) {
        throw new AppError(404, "COMENTARIO no encontrado.");
      }

      await comentariosRepo.remove(idp, consec);
      return { deleted: true };
    },

    async getComentarioById(idp, consec) {
      const comentario = await comentariosRepo.getById(idp, consec);
      if (!comentario) {
        throw new AppError(404, "COMENTARIO no encontrado.");
      }
      return comentario;
    },

    async getComentarioByConsec(consec) {
      const comentario = await comentariosRepo.getByConsec(consec);
      if (!comentario) {
        throw new AppError(404, "COMENTARIO no encontrado.");
      }
      return comentario;
    },

    async getPostsByUsuario(idu) {
      const usuario = await usuariosRepo.getById(idu);
      if (!usuario) {
        throw new AppError(404, "USUARIO no encontrado.");
      }
      
      // Validar que no sea MANAGER (idu 999) ni ANONIMO
      if (usuario.idu === 999) {
        throw new AppError(400, "No se pueden consultar posts del usuario MANAGER.");
      }
      if (usuario.nombre && usuario.nombre.toUpperCase().includes("ANONIMO")) {
        throw new AppError(400, "No se pueden consultar posts de usuarios ANONIMO.");
      }
      
      return postsRepo.getByAuthor(idu);
    },

    async getComentariosByPost(idp) {
      const post = await postsRepo.getById(idp);
      if (!post) {
        throw new AppError(404, "POST no encontrado.");
      }
      return comentariosRepo.getByPost(idp);
    },
  };
}

module.exports = {
  createCrudService,
};

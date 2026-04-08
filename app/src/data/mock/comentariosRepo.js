const store = require("./store");

function createMockComentariosRepo() {
  return {
    async create(payload) {
      const comentario = {
        idp: payload.idp,
        consec: payload.consec,
        fechorCom: payload.fechorCom,
        contenidoCom: payload.contenidoCom,
        fechorAut: payload.fechorAut,
        likeNotLike: payload.likeNotLike,
        iduAutor: payload.iduAutor,
      };
      store.comentarios.push(comentario);
      return comentario;
    },

    async list() {
      return [...store.comentarios];
    },

    async getById(idp, consec) {
      return (
        store.comentarios.find(
          (c) => Number(c.idp) === Number(idp) && Number(c.consec) === Number(consec)
        ) || null
      );
    },

    async getByConsec(consec) {
      return (
        store.comentarios.find((c) => Number(c.consec) === Number(consec)) || null
      );
    },

    async update(consec, payload) {
      const idx = store.comentarios.findIndex(
        (c) => Number(c.consec) === Number(consec)
      );

      if (idx === -1) {
        return null;
      }

      store.comentarios[idx] = { ...store.comentarios[idx], ...payload };
      return store.comentarios[idx];
    },

    async remove(consec) {
      const idx = store.comentarios.findIndex(
        (c) => Number(c.consec) === Number(consec)
      );
      if (idx !== -1) {
        store.comentarios.splice(idx, 1);
      }
      return true;
    },

    async removeByPost(idp) {
      store.comentarios = store.comentarios.filter(
        (c) => Number(c.idp) !== Number(idp)
      );
      return true;
    },

    async existsByAuthor(idu) {
      return store.comentarios.some(
        (c) => Number(c.iduAutor) === Number(idu)
      );
    },

    async getByPost(idp) {
      return store.comentarios.filter((c) => Number(c.idp) === Number(idp));
    },
  };
}

module.exports = {
  createMockComentariosRepo,
};

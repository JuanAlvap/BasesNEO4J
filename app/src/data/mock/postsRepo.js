const store = require("./store");

function createMockPostsRepo() {
  return {
    async create(payload) {
      const post = {
        idp: payload.idp,
        contenido: payload.contenido,
        iduAutor: payload.iduAutor,
      };
      store.posts.push(post);
      return post;
    },

    async list() {
      return [...store.posts];
    },

    async getById(idp) {
      return store.posts.find((p) => Number(p.idp) === Number(idp)) || null;
    },

    async update(idp, payload) {
      const idx = store.posts.findIndex((p) => Number(p.idp) === Number(idp));
      if (idx === -1) {
        return null;
      }
      store.posts[idx] = { ...store.posts[idx], ...payload };
      return store.posts[idx];
    },

    async remove(idp) {
      const idx = store.posts.findIndex((p) => Number(p.idp) === Number(idp));
      if (idx !== -1) {
        store.posts.splice(idx, 1);
      }
      return true;
    },

    async existsByAuthor(idu) {
      return store.posts.some((p) => Number(p.iduAutor) === Number(idu));
    },

    async getByAuthor(idu) {
      return store.posts.filter((p) => Number(p.iduAutor) === Number(idu));
    },
  };
}

module.exports = {
  createMockPostsRepo,
};

const store = require("./store");

function createMockUsuariosRepo() {
  return {
    async create(payload) {
      const usuario = { idu: payload.idu, nombre: payload.nombre };
      store.usuarios.push(usuario);
      return usuario;
    },

    async list() {
      return [...store.usuarios];
    },

    async getById(idu) {
      return store.usuarios.find((u) => Number(u.idu) === Number(idu)) || null;
    },

    async update(idu, payload) {
      const idx = store.usuarios.findIndex(
        (u) => Number(u.idu) === Number(idu)
      );
      if (idx === -1) {
        return null;
      }
      store.usuarios[idx] = { ...store.usuarios[idx], ...payload };
      return store.usuarios[idx];
    },

    async remove(idu) {
      const idx = store.usuarios.findIndex(
        (u) => Number(u.idu) === Number(idu)
      );
      if (idx !== -1) {
        store.usuarios.splice(idx, 1);
      }
      return true;
    },
  };
}

module.exports = {
  createMockUsuariosRepo,
};

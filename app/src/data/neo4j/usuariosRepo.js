const { runRead, runWrite } = require("./utils");

function createNeo4jUsuariosRepo() {
  return {
    async create(payload) {
      const rows = await runWrite(
        `
        CREATE (u:Usuario {idu: $idu, nombre: $nombre})
        RETURN u.idu AS idu, u.nombre AS nombre
        `,
        payload
      );
      return rows[0] || null;
    },

    async list() {
      return runRead(
        `
        MATCH (u:Usuario)
        RETURN u.idu AS idu, u.nombre AS nombre
        ORDER BY u.idu
        `
      );
    },

    async getById(idu) {
      const rows = await runRead(
        `
        MATCH (u:Usuario {idu: $idu})
        RETURN u.idu AS idu, u.nombre AS nombre
        LIMIT 1
        `,
        { idu }
      );
      return rows[0] || null;
    },

    async update(idu, payload) {
      const rows = await runWrite(
        `
        MATCH (u:Usuario {idu: $idu})
        SET u.nombre = $nombre
        RETURN u.idu AS idu, u.nombre AS nombre
        `,
        { idu, nombre: payload.nombre }
      );
      return rows[0] || null;
    },

    async remove(idu) {
      await runWrite(
        `
        MATCH (u:Usuario {idu: $idu})
        DETACH DELETE u
        `,
        { idu }
      );
      return true;
    },
  };
}

module.exports = {
  createNeo4jUsuariosRepo,
};

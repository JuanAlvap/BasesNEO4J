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
        
        // Actualizar el usuario
        SET u.idu = $newIdu, u.nombre = $nombre
        
        // Actualizar todos los posts creados por este usuario
        WITH u
        MATCH (u)-[:publica]->(p:Post)
        SET p.iduAutor = $newIdu
        
        // Actualizar todos los comentarios hechos por este usuario
        WITH u
        MATCH (u)-[:hace]->(c:Comentario)
        SET c.iduAutor = $newIdu
        
        // Actualizar todos los comentarios autorizados por este usuario
        WITH u
        MATCH (u)-[:autoriza]->(c:Comentario)
        SET c.iduAutorizador = $newIdu
        
        // Retornar el usuario actualizado
        WITH u
        RETURN u.idu AS idu, u.nombre AS nombre
        `,
        { idu, newIdu: payload.idu, nombre: payload.nombre }
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

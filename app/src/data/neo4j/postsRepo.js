const { runRead, runWrite } = require("./utils");

function createNeo4jPostsRepo() {
  return {
    async create(payload) {
      const rows = await runWrite(
        `
        MATCH (u:Usuario {idu: $iduAutor})
        CREATE (p:Post {idp: $idp, contenido: $contenido})
        CREATE (u)-[:publica]->(p)
        RETURN p.idp AS idp, p.contenido AS contenido, u.idu AS iduAutor
        `,
        payload
      );

      return rows[0] || null;
    },

    async list() {
      return runRead(
        `
        MATCH (u:Usuario)-[:publica]->(p:Post)
        RETURN p.idp AS idp, p.contenido AS contenido, u.idu AS iduAutor
        ORDER BY p.idp
        `
      );
    },

    async getById(idp) {
      const rows = await runRead(
        `
        MATCH (u:Usuario)-[:publica]->(p:Post {idp: $idp})
        RETURN p.idp AS idp, p.contenido AS contenido, u.idu AS iduAutor
        LIMIT 1
        `,
        { idp }
      );
      return rows[0] || null;
    },

    async update(idp, payload) {
      const rows = await runWrite(
        `
        MATCH (u:Usuario)-[:publica]->(p:Post {idp: $idp})
        SET p.contenido = $contenido
        RETURN p.idp AS idp, p.contenido AS contenido, u.idu AS iduAutor
        `,
        { idp, contenido: payload.contenido }
      );
      return rows[0] || null;
    },

    async remove(idp) {
      await runWrite(
        `
        MATCH (p:Post {idp: $idp})
        OPTIONAL MATCH (p)-[:tiene]->(c:Comentario)
        DETACH DELETE c, p
        `,
        { idp }
      );
      return true;
    },

    async existsByAuthor(idu) {
      const rows = await runRead(
        `
        MATCH (:Usuario {idu: $idu})-[:publica]->(p:Post)
        RETURN count(p) > 0 AS hasPosts
        `,
        { idu }
      );
      return Boolean(rows[0] && rows[0].hasPosts);
    },

    async getByAuthor(idu) {
      return runRead(
        `
        MATCH (u:Usuario {idu: $idu})-[:publica]->(p:Post)
        RETURN p.idp AS idp, p.contenido AS contenido, u.idu AS iduAutor
        ORDER BY p.idp
        `,
        { idu }
      );
    },
  };
}

module.exports = {
  createNeo4jPostsRepo,
};

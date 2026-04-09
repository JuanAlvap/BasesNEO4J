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
        
        WITH p, u, $newIduAutor AS newIduAutor
        
        // Actualizar propiedades del post
        SET p.idp = $newIdp, p.contenido = $contenido
        
        // Si el autor cambió, actualizar la relación
        WITH p, u, newIduAutor
        WHERE u.idu <> newIduAutor
        
        MATCH (newUsuario:Usuario {idu: newIduAutor})
        MATCH (u)-[relPublica:publica]->(p)
        DELETE relPublica
        CREATE (newUsuario)-[:publica]->(p)
        
        RETURN p.idp AS idp, p.contenido AS contenido, newUsuario.idu AS iduAutor
        
        UNION
        
        MATCH (u:Usuario)-[:publica]->(p:Post {idp: $idp})
        
        SET p.idp = $newIdp, p.contenido = $contenido
        
        WITH p, u, $newIduAutor AS newIduAutor
        WHERE u.idu = newIduAutor
        
        RETURN p.idp AS idp, p.contenido AS contenido, u.idu AS iduAutor
        `,
        { 
          idp, 
          newIdp: payload.idp, 
          contenido: payload.contenido,
          newIduAutor: payload.iduAutor
        }
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

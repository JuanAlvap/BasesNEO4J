const { runRead, runWrite } = require("./utils");

function createNeo4jComentariosRepo() {
  return {
    async create(payload) {
      const rows = await runWrite(
        `
        MATCH (p:Post {idp: $idp})
        MATCH (ua:Usuario {idu: $iduAutor})
        MATCH (uz:Usuario {idu: $iduAutorizador})
        CREATE (c:Comentario {
          consec: $consec,
          fechorCom: datetime($fechorCom),
          contenidoCom: $contenidoCom,
          fechorAut: datetime($fechorAut),
          likeNotLike: $likeNotLike
        })
        CREATE (ua)-[:hace]->(c)
        CREATE (uz)-[:autoriza]->(c)
        CREATE (p)-[:tiene]->(c)
        RETURN p.idp AS idp,
               c.consec AS consec,
               c.fechorCom AS fechorCom,
               c.contenidoCom AS contenidoCom,
               c.fechorAut AS fechorAut,
               c.likeNotLike AS likeNotLike,
               ua.idu AS iduAutor,
               uz.idu AS iduAutorizador
        `,
        payload
      );

      return rows[0] || null;
    },

    async list() {
      return runRead(
        `
        MATCH (p:Post)-[:tiene]->(c:Comentario)
        OPTIONAL MATCH (ua:Usuario)-[:hace]->(c)
        OPTIONAL MATCH (uz:Usuario)-[:autoriza]->(c)
        RETURN p.idp AS idp,
               c.consec AS consec,
               c.fechorCom AS fechorCom,
               c.contenidoCom AS contenidoCom,
               c.fechorAut AS fechorAut,
               c.likeNotLike AS likeNotLike,
               ua.idu AS iduAutor,
               uz.idu AS iduAutorizador
        ORDER BY p.idp, c.consec
        `
      );
    },

    async getById(idp, consec) {
      const rows = await runRead(
        `
        MATCH (p:Post {idp: $idp})-[:tiene]->(c:Comentario {consec: $consec})
        OPTIONAL MATCH (ua:Usuario)-[:hace]->(c)
        OPTIONAL MATCH (uz:Usuario)-[:autoriza]->(c)
        RETURN p.idp AS idp,
               c.consec AS consec,
               c.fechorCom AS fechorCom,
               c.contenidoCom AS contenidoCom,
               c.fechorAut AS fechorAut,
               c.likeNotLike AS likeNotLike,
               ua.idu AS iduAutor,
               uz.idu AS iduAutorizador
        LIMIT 1
        `,
        { idp, consec: Number(consec) }
      );
      return rows[0] || null;
    },

    async getByConsec(consec) {
      const rows = await runRead(
        `
        MATCH (p:Post)-[:tiene]->(c:Comentario {consec: $consec})
        OPTIONAL MATCH (ua:Usuario)-[:hace]->(c)
        OPTIONAL MATCH (uz:Usuario)-[:autoriza]->(c)
        RETURN p.idp AS idp,
               c.consec AS consec,
               c.fechorCom AS fechorCom,
               c.contenidoCom AS contenidoCom,
               c.fechorAut AS fechorAut,
               c.likeNotLike AS likeNotLike,
               ua.idu AS iduAutor,
               uz.idu AS iduAutorizador
        LIMIT 1
        `,
        { consec: Number(consec) }
      );
      return rows[0] || null;
    },

    async update(consec, payload) {
      const rows = await runWrite(
        `
        MATCH (c:Comentario {consec: $consec})
        MATCH (p:Post {idp: $idp})
        MATCH (ua:Usuario {idu: $iduAutor})
        MATCH (uz:Usuario {idu: $iduAutorizador})
        
        // Update comentario properties (solo las que existen en el nodo)
        SET c.consec = $newConsec,
            c.fechorCom = datetime($fechorCom),
            c.contenidoCom = $contenidoCom,
            c.fechorAut = datetime($fechorAut),
            c.likeNotLike = $likeNotLike
        
        // Update relationships if post changed
        WITH c, p, ua, uz
        OPTIONAL MATCH (oldPost:Post)-[rel:tiene]->(c)
        DELETE rel
        CREATE (p)-[:tiene]->(c)
        
        // Update author relationships
        WITH c, ua, uz
        OPTIONAL MATCH (oldUA:Usuario)-[rel:hace]->(c)
        DELETE rel
        CREATE (ua)-[:hace]->(c)
        
        // Update authorizer relationships
        WITH c, uz
        OPTIONAL MATCH (oldUZ:Usuario)-[rel:autoriza]->(c)
        DELETE rel
        CREATE (uz)-[:autoriza]->(c)
        
        WITH c
        MATCH (p:Post)-[:tiene]->(c)
        OPTIONAL MATCH (ua:Usuario)-[:hace]->(c)
        OPTIONAL MATCH (uz:Usuario)-[:autoriza]->(c)
        RETURN p.idp AS idp,
               c.consec AS consec,
               c.fechorCom AS fechorCom,
               c.contenidoCom AS contenidoCom,
               c.fechorAut AS fechorAut,
               c.likeNotLike AS likeNotLike,
               ua.idu AS iduAutor,
               uz.idu AS iduAutorizador
        `,
        {
          consec: Number(consec),
          newConsec: Number(payload.consec),
          idp: payload.idp,
          fechorCom: payload.fechorCom,
          contenidoCom: payload.contenidoCom,
          fechorAut: payload.fechorAut,
          likeNotLike: payload.likeNotLike,
          iduAutor: payload.iduAutor,
          iduAutorizador: payload.iduAutorizador,
        }
      );
      return rows[0] || null;
    },

    async remove(consec) {
      await runWrite(
        `
        MATCH (c:Comentario {consec: $consec})
        DETACH DELETE c
        `,
        { consec: Number(consec) }
      );
      return true;
    },

    async removeByPost(idp) {
      await runWrite(
        `
        MATCH (:Post {idp: $idp})-[:tiene]->(c:Comentario)
        DETACH DELETE c
        `,
        { idp }
      );
      return true;
    },

    async existsByAuthor(idu) {
      const rows = await runRead(
        `
        MATCH (u:Usuario {idu: $idu})
        OPTIONAL MATCH (u)-[:hace]->(c:Comentario)
        RETURN count(c) > 0 AS hasComentarios
        `,
        { idu }
      );
      return Boolean(rows[0] && rows[0].hasComentarios);
    },

    async existsByAuthorOrAuthorizer(idu) {
      const rows = await runRead(
        `
        MATCH (u:Usuario {idu: $idu})
        OPTIONAL MATCH (u)-[:hace]->(c:Comentario)
        OPTIONAL MATCH (u)-[:autoriza]->(c2:Comentario)
        RETURN count(c) > 0 OR count(c2) > 0 AS hasComentarios
        `,
        { idu }
      );
      return Boolean(rows[0] && rows[0].hasComentarios);
    },

    async getByPost(idp) {
      return runRead(
        `
        MATCH (p:Post {idp: $idp})-[:tiene]->(c:Comentario)
        OPTIONAL MATCH (ua:Usuario)-[:hace]->(c)
        OPTIONAL MATCH (uz:Usuario)-[:autoriza]->(c)
        RETURN p.idp AS idp,
               c.consec AS consec,
               c.fechorCom AS fechorCom,
               c.contenidoCom AS contenidoCom,
               c.fechorAut AS fechorAut,
               c.likeNotLike AS likeNotLike,
               ua.idu AS iduAutor,
               ua.nombre AS nombreAutor,
               uz.idu AS iduAutorizador,
               uz.nombre AS nombreAutorizador
        ORDER BY c.consec
        `,
        { idp }
      );
    },
  };
}

module.exports = {
  createNeo4jComentariosRepo,
};

// Script temporal para pruebas CRUD en modo neo4j
// Limpieza (usar solo en entorno de prueba)
MATCH (n) DETACH DELETE n;

CREATE (u1:Usuario {idu: 1, nombre: "CARLOS"});
CREATE (u2:Usuario {idu: 2, nombre: "LAURA"});

CREATE (p1:Post {idp: 1, contenido: "Primer post"});
CREATE (u1)-[:publica]->(p1);

CREATE (c1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-01T10:00:00"),
  contenidoCom: "Buen contenido",
  fechorAut: datetime("2026-04-01T10:05:00"),
  likeNotLike: true
});
CREATE (u2)-[:hace]->(c1);
CREATE (u1)-[:autoriza]->(c1);
CREATE (p1)-[:tiene]->(c1);

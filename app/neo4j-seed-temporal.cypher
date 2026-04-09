// Script temporal para pruebas CRUD en modo neo4j
// Limpieza: Ejecutar primero en Neo4j Browser
// MATCH (n) DETACH DELETE n;

// ===== USUARIOS =====
CREATE (u1:Usuario {idu: 1, nombre: "Juan"});
CREATE (u2:Usuario {idu: 4, nombre: "Carlitos"});
CREATE (u3:Usuario {idu: 5, nombre: "Ana"});
CREATE (u4:Usuario {idu: 10, nombre: "Maria"});
CREATE (manager:Usuario {idu: 999, nombre: "MANAGER"});

// ===== POSTS =====
// Post 1 por Juan
CREATE (p1:Post {idp: 1, contenido: "Hola mundo"});
CREATE (u1)-[:publica]->(p1);

// Post 2 por Maria
CREATE (p2:Post {idp: 2, contenido: "Mi segundo post"});
CREATE (u4)-[:publica]->(p2);

// Post 3 por Carlitos
CREATE (p3:Post {idp: 3, contenido: "Aprendiendo Neo4j"});
CREATE (u2)-[:publica]->(p3);

// Post 4 por Ana
CREATE (p4:Post {idp: 4, contenido: "Base de datos grafos"});
CREATE (u3)-[:publica]->(p4);

// Post 5 por Juan
CREATE (p5:Post {idp: 5, contenido: "Otro post"});
CREATE (u1)-[:publica]->(p5);

// Post 6 por Maria
CREATE (p6:Post {idp: 6, contenido: "Post interesante"});
CREATE (u4)-[:publica]->(p6);

// Post 7 por Carlitos
CREATE (p7:Post {idp: 7, contenido: "Grafos avanzados"});
CREATE (u2)-[:publica]->(p7);

// Post 8 por Ana
CREATE (p8:Post {idp: 8, contenido: "Cypher básico"});
CREATE (u3)-[:publica]->(p8);

// Post 9 por Juan
CREATE (p9:Post {idp: 9, contenido: "Consultas Neo4j"});
CREATE (u1)-[:publica]->(p9);

// Post 10 por Maria
CREATE (p10:Post {idp: 10, contenido: "Proyecto final"});
CREATE (u4)-[:publica]->(p10);

// ===== COMENTARIOS POST 1 =====
CREATE (c1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-01T10:00:00"),
  contenidoCom: "Excelente post",
  fechorAut: datetime("2026-04-01T10:30:00"),
  likeNotLike: true
});
CREATE (u2)-[:hace]->(c1);
CREATE (manager)-[:autoriza]->(c1);
CREATE (p1)-[:tiene]->(c1);

CREATE (c2:Comentario {
  consec: 2,
  fechorCom: datetime("2026-04-01T11:00:00"),
  contenidoCom: "Buen contenido",
  fechorAut: datetime("2026-04-01T11:20:00"),
  likeNotLike: true
});
CREATE (u3)-[:hace]->(c2);
CREATE (manager)-[:autoriza]->(c2);
CREATE (p1)-[:tiene]->(c2);

CREATE (c3:Comentario {
  consec: 3,
  fechorCom: datetime("2026-04-01T12:00:00"),
  contenidoCom: "Muy util",
  fechorAut: datetime("2026-04-01T12:15:00"),
  likeNotLike: true
});
CREATE (u4)-[:hace]->(c3);
CREATE (manager)-[:autoriza]->(c3);
CREATE (p1)-[:tiene]->(c3);

// ===== COMENTARIOS POST 2 =====
CREATE (c4:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-02T09:00:00"),
  contenidoCom: "Muy bueno",
  fechorAut: datetime("2026-04-02T09:25:00"),
  likeNotLike: true
});
CREATE (u1)-[:hace]->(c4);
CREATE (manager)-[:autoriza]->(c4);
CREATE (p2)-[:tiene]->(c4);

CREATE (c5:Comentario {
  consec: 2,
  fechorCom: datetime("2026-04-02T10:00:00"),
  contenidoCom: "Interesante tema",
  fechorAut: datetime("2026-04-02T10:35:00"),
  likeNotLike: true
});
CREATE (u2)-[:hace]->(c5);
CREATE (manager)-[:autoriza]->(c5);
CREATE (p2)-[:tiene]->(c5);

// ===== COMENTARIOS POST 5 =====
CREATE (c6:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-03T08:00:00"),
  contenidoCom: "Genial aporte",
  fechorAut: datetime("2026-04-03T08:40:00"),
  likeNotLike: true
});
CREATE (u3)-[:hace]->(c6);
CREATE (manager)-[:autoriza]->(c6);
CREATE (p5)-[:tiene]->(c6);

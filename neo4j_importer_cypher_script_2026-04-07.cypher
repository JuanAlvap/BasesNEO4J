// ============================================
// SCRIPT PRINCIPAL - Neo4j CRUD Application
// Sin CSV - Todo dentro del script
// ============================================

// PASO 1: LIMPIAR LA BD (ejecutar primero)
MATCH (n) DETACH DELETE n;

// PASO 2: CREAR CONSTRAINTS
CREATE CONSTRAINT `idu_Usuario_uniq` IF NOT EXISTS
FOR (n: `Usuario`)
REQUIRE (n.`idu`) IS UNIQUE;

CREATE CONSTRAINT `idp_Post_uniq` IF NOT EXISTS
FOR (n: `Post`)
REQUIRE (n.`idp`) IS UNIQUE;

// PASO 3: CREAR USUARIOS
CREATE (u1:Usuario {idu: 1, nombre: "Juan"});
CREATE (u2:Usuario {idu: 4, nombre: "Carlitos"});
CREATE (u3:Usuario {idu: 5, nombre: "Ana"});
CREATE (u4:Usuario {idu: 10, nombre: "Maria"});
CREATE (u5:Usuario {idu: 999, nombre: "MANAGER"});

// Usuarios ANONIMOS para testing
CREATE (u6:Usuario {idu: 2, nombre: "ANONIMO_1"});
CREATE (u7:Usuario {idu: 3, nombre: "ANONIMO_2"});
CREATE (u8:Usuario {idu: 6, nombre: "ANONIMO_3"});
CREATE (u9:Usuario {idu: 7, nombre: "ANONIMO_4"});

// PASO 4: CREAR POSTS
CREATE (p1:Post {idp: 1, contenido: "Hola mundo"});
CREATE (p2:Post {idp: 2, contenido: "Mi segundo post"});
CREATE (p3:Post {idp: 3, contenido: "Aprendiendo Neo4j"});
CREATE (p4:Post {idp: 4, contenido: "Base de datos grafos"});
CREATE (p5:Post {idp: 5, contenido: "Otro post"});
CREATE (p6:Post {idp: 6, contenido: "Post interesante"});
CREATE (p7:Post {idp: 7, contenido: "Grafos avanzados"});
CREATE (p8:Post {idp: 8, contenido: "Cypher básico"});
CREATE (p9:Post {idp: 9, contenido: "Consultas Neo4j"});
CREATE (p10:Post {idp: 10, contenido: "Proyecto final"});

// Posts de ANONIMOS
CREATE (p11:Post {idp: 11, contenido: "Primer post anonimo"});
CREATE (p12:Post {idp: 12, contenido: "Segundo anonimo"});
CREATE (p13:Post {idp: 13, contenido: "Otro contenido anonimo"});
CREATE (p14:Post {idp: 14, contenido: "Mas posts anonimos"});

// Posts del MANAGER
CREATE (p15:Post {idp: 15, contenido: "Comunicado oficial del MANAGER"});

// PASO 5: CREAR RELACIONES PUBLICA (Usuario -> Post)
MATCH (u:Usuario {idu: 1}), (p:Post {idp: 1}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 10}), (p:Post {idp: 2}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 4}), (p:Post {idp: 3}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 5}), (p:Post {idp: 4}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 1}), (p:Post {idp: 5}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 10}), (p:Post {idp: 6}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 4}), (p:Post {idp: 7}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 5}), (p:Post {idp: 8}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 1}), (p:Post {idp: 9}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 10}), (p:Post {idp: 10}) CREATE (u)-[:publica]->(p);

// Posts de ANONIMOS
MATCH (u:Usuario {idu: 2}), (p:Post {idp: 11}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 3}), (p:Post {idp: 12}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 6}), (p:Post {idp: 13}) CREATE (u)-[:publica]->(p);
MATCH (u:Usuario {idu: 7}), (p:Post {idp: 14}) CREATE (u)-[:publica]->(p);

// Posts del MANAGER
MATCH (u:Usuario {idu: 999}), (p:Post {idp: 15}) CREATE (u)-[:publica]->(p);

// ============================================
// COMENTARIOS - POST 1
// ============================================
CREATE (c1_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-01T10:00:00"),
  contenidoCom: "Excelente post",
  fechorAut: datetime("2026-04-01T10:30:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 4}), (c:Comentario {consec: 1, contenidoCom: "Excelente post"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Excelente post"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 1}), (c:Comentario {consec: 1, contenidoCom: "Excelente post"})
CREATE (p)-[:tiene]->(c);

CREATE (c1_2:Comentario {
  consec: 2,
  fechorCom: datetime("2026-04-01T11:00:00"),
  contenidoCom: "Buen contenido",
  fechorAut: datetime("2026-04-01T11:20:00"),
  likeNotLike: false
});
MATCH (u:Usuario {idu: 5}), (c:Comentario {consec: 2, contenidoCom: "Buen contenido"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 2, contenidoCom: "Buen contenido"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 1}), (c:Comentario {consec: 2, contenidoCom: "Buen contenido"})
CREATE (p)-[:tiene]->(c);

CREATE (c1_3:Comentario {
  consec: 3,
  fechorCom: datetime("2026-04-01T12:00:00"),
  contenidoCom: "Muy util",
  fechorAut: datetime("2026-04-01T12:15:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 10}), (c:Comentario {consec: 3, contenidoCom: "Muy util"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 3, contenidoCom: "Muy util"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 1}), (c:Comentario {consec: 3, contenidoCom: "Muy util"})
CREATE (p)-[:tiene]->(c);

// ============================================
// COMENTARIOS - POST 2
// ============================================
CREATE (c2_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-02T09:00:00"),
  contenidoCom: "Muy bueno",
  fechorAut: datetime("2026-04-02T09:25:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 1}), (c:Comentario {consec: 1, contenidoCom: "Muy bueno"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Muy bueno"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 2}), (c:Comentario {consec: 1, contenidoCom: "Muy bueno"})
CREATE (p)-[:tiene]->(c);

CREATE (c2_2:Comentario {
  consec: 2,
  fechorCom: datetime("2026-04-02T10:00:00"),
  contenidoCom: "Interesante tema",
  fechorAut: datetime("2026-04-02T10:35:00"),
  likeNotLike: false
});
MATCH (u:Usuario {idu: 4}), (c:Comentario {consec: 2, contenidoCom: "Interesante tema"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 2, contenidoCom: "Interesante tema"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 2}), (c:Comentario {consec: 2, contenidoCom: "Interesante tema"})
CREATE (p)-[:tiene]->(c);

// ============================================
// COMENTARIOS - POST 5
// ============================================
CREATE (c5_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-03T08:00:00"),
  contenidoCom: "Genial aporte",
  fechorAut: datetime("2026-04-03T08:40:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 5}), (c:Comentario {consec: 1, contenidoCom: "Genial aporte"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Genial aporte"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 5}), (c:Comentario {consec: 1, contenidoCom: "Genial aporte"})
CREATE (p)-[:tiene]->(c);

// ============================================
// COMENTARIOS - POST 6
// ============================================
CREATE (c6_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-04T14:00:00"),
  contenidoCom: "Excelente información",
  fechorAut: datetime("2026-04-04T14:45:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 1}), (c:Comentario {consec: 1, contenidoCom: "Excelente información"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Excelente información"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 6}), (c:Comentario {consec: 1, contenidoCom: "Excelente información"})
CREATE (p)-[:tiene]->(c);

CREATE (c6_2:Comentario {
  consec: 2,
  fechorCom: datetime("2026-04-04T15:00:00"),
  contenidoCom: "Muy instructivo",
  fechorAut: datetime("2026-04-04T15:30:00"),
  likeNotLike: false
});
MATCH (u:Usuario {idu: 5}), (c:Comentario {consec: 2, contenidoCom: "Muy instructivo"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 2, contenidoCom: "Muy instructivo"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 6}), (c:Comentario {consec: 2, contenidoCom: "Muy instructivo"})
CREATE (p)-[:tiene]->(c);

// ============================================
// COMENTARIOS - POST 4 (con ANONIMOS)
// ============================================
CREATE (c4_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-05T09:00:00"),
  contenidoCom: "Comentario anonimo 1",
  fechorAut: datetime("2026-04-05T09:15:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 2}), (c:Comentario {consec: 1, contenidoCom: "Comentario anonimo 1"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Comentario anonimo 1"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 4}), (c:Comentario {consec: 1, contenidoCom: "Comentario anonimo 1"})
CREATE (p)-[:tiene]->(c);

CREATE (c4_2:Comentario {
  consec: 2,
  fechorCom: datetime("2026-04-05T10:00:00"),
  contenidoCom: "Otro comentario de anonimo",
  fechorAut: datetime("2026-04-05T10:25:00"),
  likeNotLike: false
});
MATCH (u:Usuario {idu: 3}), (c:Comentario {consec: 2, contenidoCom: "Otro comentario de anonimo"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 2, contenidoCom: "Otro comentario de anonimo"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 4}), (c:Comentario {consec: 2, contenidoCom: "Otro comentario de anonimo"})
CREATE (p)-[:tiene]->(c);

// ============================================
// COMENTARIOS - POST 3 (con ANONIMOS)
// ============================================
CREATE (c3_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-05T11:00:00"),
  contenidoCom: "Anonimo comenta aqui",
  fechorAut: datetime("2026-04-05T11:30:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 6}), (c:Comentario {consec: 1, contenidoCom: "Anonimo comenta aqui"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Anonimo comenta aqui"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 3}), (c:Comentario {consec: 1, contenidoCom: "Anonimo comenta aqui"})
CREATE (p)-[:tiene]->(c);

// ============================================
// COMENTARIOS - POST 7 (del MANAGER)
// ============================================
CREATE (c7_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-05T13:00:00"),
  contenidoCom: "Comentario del MANAGER",
  fechorAut: datetime("2026-04-05T13:10:00"),
  likeNotLike: true
});
MATCH (u:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Comentario del MANAGER"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Comentario del MANAGER"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 7}), (c:Comentario {consec: 1, contenidoCom: "Comentario del MANAGER"})
CREATE (p)-[:tiene]->(c);

// ============================================
// COMENTARIOS - POST 8 (mixtos: ANONIMO y MANAGER)
// ============================================
CREATE (c8_1:Comentario {
  consec: 1,
  fechorCom: datetime("2026-04-05T14:00:00"),
  contenidoCom: "Anonimo en post 8",
  fechorAut: datetime("2026-04-05T14:20:00"),
  likeNotLike: false
});
MATCH (u:Usuario {idu: 7}), (c:Comentario {consec: 1, contenidoCom: "Anonimo en post 8"})
CREATE (u)-[:hace]->(c);
MATCH (u5:Usuario {idu: 999}), (c:Comentario {consec: 1, contenidoCom: "Anonimo en post 8"})
CREATE (u5)-[:autoriza]->(c);
MATCH (p:Post {idp: 8}), (c:Comentario {consec: 1, contenidoCom: "Anonimo en post 8"})
CREATE (p)-[:tiene]->(c);

// ============================================
// SCRIPT COMPLETADO EXITOSAMENTE
// ============================================

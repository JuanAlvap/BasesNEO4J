const store = {
  usuarios: [
    { idu: 1, nombre: "CARLOS" },
    { idu: 2, nombre: "LAURA" },
  ],
  posts: [
    { idp: 1, contenido: "Primer post", iduAutor: 1 },
  ],
  comentarios: [
    {
      idp: 1,
      consec: 1,
      fechorCom: "2026-04-01T10:00:00",
      contenidoCom: "Buen contenido",
      fechorAut: "2026-04-01T10:05:00",
      likeNotLike: true,
      iduAutor: 2,
    },
  ],
};

module.exports = store;

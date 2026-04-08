const config = require("../config/env");
const { createMockUsuariosRepo } = require("../data/mock/usuariosRepo");
const { createMockPostsRepo } = require("../data/mock/postsRepo");
const { createMockComentariosRepo } = require("../data/mock/comentariosRepo");
const { createNeo4jUsuariosRepo } = require("../data/neo4j/usuariosRepo");
const { createNeo4jPostsRepo } = require("../data/neo4j/postsRepo");
const { createNeo4jComentariosRepo } = require("../data/neo4j/comentariosRepo");

function createRepositories() {
  if (config.dataMode === "neo4j") {
    return {
      usuariosRepo: createNeo4jUsuariosRepo(),
      postsRepo: createNeo4jPostsRepo(),
      comentariosRepo: createNeo4jComentariosRepo(),
    };
  }

  return {
    usuariosRepo: createMockUsuariosRepo(),
    postsRepo: createMockPostsRepo(),
    comentariosRepo: createMockComentariosRepo(),
  };
}

module.exports = {
  createRepositories,
};

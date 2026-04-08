const app = require("./app");
const config = require("./config/env");
const { closeNeo4jDriver } = require("./config/neo4j");

const server = app.listen(config.port, () => {
  console.log(`Servidor corriendo en http://localhost:${config.port}`);
  console.log(`Modo de datos activo: ${config.dataMode}`);
});

async function shutdown() {
  server.close(async () => {
    try {
      await closeNeo4jDriver();
    } catch (error) {
      console.error("Error cerrando conexion Neo4j:", error.message);
    }
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

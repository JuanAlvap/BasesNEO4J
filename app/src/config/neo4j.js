const neo4j = require("neo4j-driver");
const config = require("./env");

let driver;

function getNeo4jDriver() {
  if (driver) {
    return driver;
  }

  const { uri, user, password } = config.neo4j;

  if (!uri || !user || !password) {
    throw new Error("Faltan variables NEO4J_URI, NEO4J_USER o NEO4J_PASSWORD.");
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  return driver;
}

async function closeNeo4jDriver() {
  if (driver) {
    await driver.close();
    driver = undefined;
  }
}

module.exports = {
  getNeo4jDriver,
  closeNeo4jDriver,
};

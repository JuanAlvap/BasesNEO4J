// NOTE: The following script syntax is valid for database version 5.0 and above.

:param {
  // Define the file path root and the individual file names required for loading.
  // https://neo4j.com/docs/operations-manual/current/configuration/file-locations/
  file_path_root: 'file:///', // Change this to the folder your script can access the files at.
  file_0: 'general_simple_neo4j_consec.csv'
};

// CONSTRAINT creation
// -------------------
//
// Create node constraints, ensuring no duplicates for the given node label and ID property exist in the database. This also ensures no duplicates are introduced in future.
//
CREATE CONSTRAINT `idu_Usuario_uniq` IF NOT EXISTS
FOR (n: `Usuario`)
REQUIRE (n.`idu`) IS UNIQUE;
CREATE CONSTRAINT `idp_Post_uniq` IF NOT EXISTS
FOR (n: `Post`)
REQUIRE (n.`idp`) IS UNIQUE;
CREATE CONSTRAINT `consec_Comentario_uniq` IF NOT EXISTS
FOR (n: `Comentario`)
REQUIRE (n.`consec`) IS UNIQUE;

:param {
  idsToSkip: []
};

// NODE load
// ---------
//
// Load nodes in batches, one node label at a time. Nodes will be created using a MERGE statement to ensure a node with the same label and ID property remains unique. Pre-existing nodes found by a MERGE statement will have their other properties set to the latest values encountered in a load file.
//
// NOTE: Any nodes with IDs in the 'idsToSkip' list parameter will not be loaded.
LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row
WHERE NOT row.`idu` IN $idsToSkip AND NOT toInteger(trim(row.`idu`)) IS NULL
CALL (row) {
  MERGE (n: `Usuario` { `idu`: toInteger(trim(row.`idu`)) })
  SET n.`idu` = toInteger(trim(row.`idu`))
  SET n.`nombre` = row.`nombre`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row
WHERE NOT row.`idp` IN $idsToSkip AND NOT toInteger(trim(row.`idp`)) IS NULL
CALL (row) {
  MERGE (n: `Post` { `idp`: toInteger(trim(row.`idp`)) })
  SET n.`idp` = toInteger(trim(row.`idp`))
  SET n.`contenido` = row.`contenido`
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row
WHERE NOT row.`consec` IN $idsToSkip AND NOT toInteger(trim(row.`consec`)) IS NULL
CALL (row) {
  MERGE (n: `Comentario` { `consec`: toInteger(trim(row.`consec`)) })
  SET n.`consec` = toInteger(trim(row.`consec`))
  // Your script contains the datetime datatype. Our app attempts to convert dates to ISO 8601 date format before passing them to the Cypher function.
  // This conversion cannot be done in a Cypher script load. Please ensure that your CSV file columns are in ISO 8601 date format to ensure equivalent loads.
  SET n.`fechorCom` = datetime(row.`fechorCom`)
  // Your script contains the datetime datatype. Our app attempts to convert dates to ISO 8601 date format before passing them to the Cypher function.
  // This conversion cannot be done in a Cypher script load. Please ensure that your CSV file columns are in ISO 8601 date format to ensure equivalent loads.
  SET n.`fechorAut` = datetime(row.`fechorAut`)
  SET n.`likeNotLike` = toLower(trim(row.`likeNotLike`)) IN ['1','true','yes']
  SET n.`contenidoCom` = row.`contenidoCom`
} IN TRANSACTIONS OF 10000 ROWS;


// RELATIONSHIP load
// -----------------
//
// Load relationships in batches, one relationship type at a time. Relationships are created using a MERGE statement, meaning only one relationship of a given type will ever be created between a pair of nodes.
LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row 
CALL (row) {
  MATCH (source: `Usuario` { `idu`: toInteger(trim(row.`idu`)) })
  MATCH (target: `Post` { `idp`: toInteger(trim(row.`idp`)) })
  MERGE (source)-[r: `publica`]->(target)
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row 
CALL (row) {
  MATCH (source: `Post` { `idp`: toInteger(trim(row.`idp`)) })
  MATCH (target: `Comentario` { `consec`: toInteger(trim(row.`consec`)) })
  MERGE (source)-[r: `tiene`]->(target)
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row 
CALL (row) {
  MATCH (source: `Usuario` { `idu`: toInteger(trim(row.`idu`)) })
  MATCH (target: `Comentario` { `consec`: toInteger(trim(row.`consec`)) })
  MERGE (source)-[r: `hace`]->(target)
} IN TRANSACTIONS OF 10000 ROWS;

LOAD CSV WITH HEADERS FROM ($file_path_root + $file_0) AS row
WITH row 
CALL (row) {
  MATCH (source: `Usuario` { `idu`: toInteger(trim(row.`idu`)) })
  MATCH (target: `Comentario` { `consec`: toInteger(trim(row.`consec`)) })
  MERGE (source)-[r: `autoriza`]->(target)
} IN TRANSACTIONS OF 10000 ROWS;

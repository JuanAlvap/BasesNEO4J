const neo4j = require("neo4j-driver");
const { getNeo4jDriver } = require("../../config/neo4j");

function normalizeValue(value) {
  if (neo4j.isInt(value)) {
    return value.toNumber();
  }
  
  // Handle BigInt
  if (typeof value === 'bigint') {
    return Number(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === "object") {
    if (typeof value.toString === "function" && value.constructor?.name === "DateTime") {
      // Convert Neo4j DateTime to ISO 8601 string properly
      // Neo4j DateTime objects have: year, month, day, hour, minute, second, nanosecond, timeZoneOffsetSeconds
      const { year, month, day, hour, minute, second, nanosecond, timeZoneOffsetSeconds } = value;
      
      // Create a date string without timezone conversion issues
      const pad = (n) => String(n).padStart(2, '0');
      const dateStr = `${year}-${pad(month)}-${pad(day)}`;
      const timeStr = `${pad(hour)}:${pad(minute)}:${pad(second)}`;
      
      // Return ISO format with timezone info
      let isoString = `${dateStr}T${timeStr}`;
      if (nanosecond && nanosecond > 0) {
        isoString += `.${String(nanosecond).padStart(9, '0').slice(0, 3)}`;
      }
      
      // Add timezone offset if available
      if (timeZoneOffsetSeconds !== undefined && timeZoneOffsetSeconds !== null) {
        let offsetSecondsNum;
        try {
          offsetSecondsNum = BigInt(timeZoneOffsetSeconds) instanceof BigInt 
            ? Number(BigInt(timeZoneOffsetSeconds))
            : Number(timeZoneOffsetSeconds);
        } catch (e) {
          offsetSecondsNum = 0;
        }
        const offsetHours = Math.floor(Math.abs(offsetSecondsNum) / 3600);
        const offsetMinutes = Math.floor((Math.abs(offsetSecondsNum) % 3600) / 60);
        const sign = offsetSecondsNum >= 0 ? '+' : '-';
        isoString += `${sign}${pad(offsetHours)}:${pad(offsetMinutes)}`;
      } else {
        isoString += 'Z'; // Default to UTC if no timezone info
      }
      
      return isoString;
    }

    const out = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      out[key] = normalizeValue(nestedValue);
    }
    return out;
  }

  return value;
}

function toObject(record) {
  return normalizeValue(record.toObject());
}

async function runRead(query, params = {}) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result.records.map(toObject);
  } finally {
    await session.close();
  }
}

async function runWrite(query, params = {}) {
  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result.records.map(toObject);
  } finally {
    await session.close();
  }
}

module.exports = {
  runRead,
  runWrite,
};

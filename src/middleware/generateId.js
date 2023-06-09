const pool = require('../db/pool')

const generateOperatorId = async function() {
  // Retrieve the current highest sequence number from the database
  const query = 'SELECT MAX(SUBSTRING_INDEX(unique_id, "-", 1)) AS max_sequence FROM users WHERE role = "operator";'
  const [result] = await pool.query(query)
  const maxSequence = parseInt(result[0].max_sequence) || 0
  
  // Increment the sequence number by one
  const newSequence = maxSequence + 1
  
  // Generate the new ID string
  const id = `${String(newSequence).padStart(3, '0')}-OP-BG`
  
  return id;
}


const generateAdminId = async function() {
  // Retrieve the current highest sequence number from the database
  const query = 'SELECT MAX(SUBSTRING_INDEX(unique_id, "-", 1)) AS max_sequence FROM users WHERE role = "admin";'
  const [result] = await pool.query(query)
  const maxSequence = parseInt(result[0].max_sequence) || 0
  
  // Increment the sequence number by one
  const newSequence = maxSequence + 1
  
  // Generate the new ID string
  const id = `${String(newSequence).padStart(3, '0')}-A-BG`
  
  return id;
}

const generateMemberId = async function() {
  // Retrieve the current highest sequence number from the database
  const query = 'SELECT MAX(SUBSTRING_INDEX(unique_id, "-", 1)) AS max_sequence FROM users WHERE role = "member";'
  const [result] = await pool.query(query)
  const maxSequence = parseInt(result[0].max_sequence) || 0
  
  // Increment the sequence number by one
  const newSequence = maxSequence + 1
  
  // Generate the new ID string
  const id = `${String(newSequence).padStart(3, '0')}-M-BG`
  
  return id;
}

const generateFOsId = async function() {
  // Retrieve the current highest sequence number from the database
  const query = 'SELECT MAX(SUBSTRING_INDEX(fo_id, "-", 1)) AS max_sequence FROM fos_profile;'
  const [result] = await pool.query(query)
  const maxSequence = parseInt(result[0].max_sequence) || 0
  
  // Increment the sequence number by one
  const newSequence = maxSequence + 1
  
  // Generate the new ID string
  const id = `${String(newSequence).padStart(3, '0')}-FO-BG`
  
  return id;
}

const generateTGLsId = async function() {
  // Retrieve the current highest sequence number from the database
  const query = 'SELECT MAX(SUBSTRING_INDEX(unique_id, "-", 1)) AS max_sequence FROM users WHERE role = "TGL";'
  const [result] = await pool.query(query)
  const maxSequence = parseInt(result[0].max_sequence) || 0
  
  // Increment the sequence number by one
  const newSequence = maxSequence + 1
  
  // Generate the new ID string
  const id = `${String(newSequence).padStart(3, '0')}-TGL-BG`
  
  return id;
}

module.exports = {generateOperatorId, generateAdminId, generateFOsId, generateMemberId, generateTGLsId};

const axios = require('axios');
const XLSX = require('xlsx');

async function parseSpreadsheet(spreadsheetUrl) {
  try {
    const response = await axios.get(spreadsheetUrl, { responseType: 'arraybuffer' });
    const workbook = XLSX.read(response.data, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData =  XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return jsonData;
  } catch (error) {
    throw new Error('Error parsing spreadsheet');
  }
}

module.exports = {
  parseSpreadsheet,
};

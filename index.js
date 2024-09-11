// // server.js
// const express = require('express');
// const multer = require('multer');
// const XLSX = require('xlsx');
// const cors = require('cors');
// const app = express();
// const upload = multer({ dest: 'uploads/' });

// app.use(cors());
// app.use(express.json());

// app.post('/upload', upload.single('file'), (req, res) => {
//   const workbook = XLSX.readFile(req.file.path);
//   const sheetNames = workbook.SheetNames;
//   const sheet = workbook.Sheets[sheetNames[0]];
//   const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
//   // Extract column names from the first row
//   const columns = data[0];
//   res.json({ columns });
// });

// app.post('/process', (req, res) => {
//   const { columns } = req.body;
//   // Process data based on selected columns
//   console.log('Selected Columns:', columns);
//   res.json({ success: true });
// });

// app.listen(3001, () => {
//   console.log('Server running on port 3001');
// });

const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheetNames = workbook.SheetNames;
  const sheet = workbook.Sheets[sheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  // Extract column names from the first row
  const columns = Object.keys(data[0] || {});
  
  res.json({ columns, data });
});

app.post('/save', (req, res) => {
  const { data } = req.body;

  // Save the selected data to a new file or database
  const filePath = path.join(__dirname, 'savedData.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ success: true, message: 'Data saved successfully.' });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

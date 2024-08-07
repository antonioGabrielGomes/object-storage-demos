// app.js
const express = require('express');
const multer = require('multer');
const fileController = require('./fileController');

const app = express();
const port = 3000;

const upload = multer({ dest: 'tmp/' });

// Rotas
app.get('/', (req, res) => {
  return res.send('ok')
})
app.post('/upload', upload.single('file'), fileController.uploadFile);
app.get('/download/:fileId', fileController.downloadFile);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

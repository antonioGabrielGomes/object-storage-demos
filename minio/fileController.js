// fileController.js
const minioClient = require('./client');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const bucketName = 'uploads';

// Função para fazer upload de arquivos
const uploadFile = async (req, res) => {
  try {
    // Verifica se o bucket existe, senão cria
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
    }

    // Gera um nome único para o arquivo
    const fileId = uuidv4();
    console.log(fileId)
    const filePath = req.file.path;
    const metaData = {
      'Content-Type': req.file.mimetype
    };

    // Faz upload do arquivo para o MinIO
    await minioClient.fPutObject(bucketName, fileId, filePath, metaData);

    // Remove o arquivo temporário do servidor
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'File uploaded successfully', fileId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file' });
  }
};

// Função para fazer download de arquivos
const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Busca o arquivo no MinIO
    const fileStream = await minioClient.getObject(bucketName, fileId);


    // Define o tipo de conteúdo para a resposta
    fileStream.on('data', function (chunk) {
      res.write(chunk);
    });
    fileStream.on('end', function () {
      res.end();
    });
    fileStream.on('error', function (err) {
      console.error(err);
      res.status(500).json({ error: 'Error downloading file' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error downloading file' });
  }
};

module.exports = {
  uploadFile,
  downloadFile
};

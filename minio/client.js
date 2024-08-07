// minioClient.js
const Minio = require('minio');

// Configurar o cliente MinIO
const minioClient = new Minio.Client({
  endPoint: '192.168.1.13',
  port: 9000,
  useSSL: false,
  accessKey: 'apidev',
  secretKey: 'apidev123'
});

module.exports = minioClient;

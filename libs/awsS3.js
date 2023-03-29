const fs = require('fs')

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3')

require('dotenv').config()

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

//Returns a Promise
const uploadFile = (fileMulterObject, fileName) => {
  const fileStream = fs.createReadStream(fileMulterObject.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: fileName,
    ContentType: fileMulterObject.mimetype,
  }

  return s3Client.send(new PutObjectCommand(uploadParams))
}

//Returns a Promise
const deleteFile = (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams))
}

module.exports = {
  uploadFile,
  deleteFile,
}

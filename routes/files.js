const express = require('express');
const authorization = require('../middleware/authorization');
const dotenv = require('dotenv');
dotenv.config();
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fileRouter = express.Router();
const multer = require('multer');

// multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

fileRouter.post('/files/upload', upload.single('file'), authorization, async (req, res) => {
  const { folderId, userId } = req.body;
  const file = req.file;

  try {
    const fileName = uuidv4()+"-"+file.originalname; // Use a unique name for the file
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
    };

    const s3Response = await s3.upload(params).promise();

    const dbFile = await prisma.file.create({
      data: {
        name: fileName,
        filePath: s3Response.Location,
        folderId,
        userId,
      },
    });

    res.json(dbFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

fileRouter.put('/files/:fileId/rename', authorization, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { newName } = req.body;

    const file = await prisma.file.update({
      where: { id: parseInt(fileId, 10) },
      data: { name: newName },
    });

    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Move a file to another folder
fileRouter.put('/files/:fileId/move', authorization, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { newFolderId } = req.body;

    const file = await prisma.file.update({
      where: { id: parseInt(fileId, 10) },
      data: { folderId: newFolderId },
    });

    res.json(file);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a file
fileRouter.delete('/files/:fileId', authorization, async (req, res) => {
  try {
    const { fileId } = req.params;

    await prisma.file.delete({
      where: { id: parseInt(fileId, 10) },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = fileRouter;

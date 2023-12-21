const express = require('express');
const authorization = require('../middleware/authorization');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const folderRouter = express.Router();

// Create Parent Folder API
folderRouter.post('/newfolder/create', authorization,  async (req, res) => {
  const { folderKey, userId } = req.body;


  try {

    const existingFolder = await prisma.folder.findFirst({
      where: {
        folderKey,
        userId: parseInt(userId),
      }
    })

    if (existingFolder) {
      return res.status(409).send('Folder already exists');
    }
    // Save parent folder information to the database using Prisma
    const createdFolder = await prisma.folder.create({
      data: {
        folderKey,
        userId: parseInt(userId), // Assuming userId is a string and needs to be converted to an integer
      },
    });

    res.json(createdFolder);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create Subfolder API
folderRouter.post('/:parentFolderId/newfolder/create', authorization, async (req, res) => {
  const { folderKey, userId } = req.body;
  const { parentFolderId } = req.params;

  try {
    const existingFolder = await prisma.folder.findUnique({
      where: {
        folderKey,
        userId: parseInt(userId),
        parentFolderId: parseInt(parentFolderId),
      }
    })

    if (existingFolder) {
      return res.status(409).send('Folder already exists');
    }
    // Save subfolder information to the database using Prisma
    const createdSubfolder = await prisma.folder.create({
      data: {
        folderKey,
        userId: parseInt(userId),           // Assuming userId is a string and needs to be converted to an integer
        parentFolderId: parseInt(parentFolderId), // Assuming parentFolderId is a string and needs to be converted to an integer
      },
    });

    res.json(createdSubfolder);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = folderRouter;

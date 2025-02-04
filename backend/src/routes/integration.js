const express = require('express');
const router = express.Router();
const multer = require('multer');
const { google } = require('googleapis');
const { auth, authorize } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Initialize Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const googleAuth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../config/credentials.json'),
  scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth: googleAuth });

// Upload file to local storage
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload file to Google Drive
router.post('/upload-drive', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileMetadata = {
      name: req.file.filename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path)
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    // Clean up local file
    fs.unlinkSync(req.file.path);

    res.json({
      fileId: file.data.id,
      webViewLink: file.data.webViewLink
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Get file from Google Drive
router.get('/file/:fileId', auth, async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, webViewLink, mimeType'
    });

    res.json(file.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file from Google Drive
router.delete('/file/:fileId', [auth, authorize(['admin'])], async (req, res) => {
  try {
    const fileId = req.params.fileId;
    await drive.files.delete({
      fileId: fileId
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
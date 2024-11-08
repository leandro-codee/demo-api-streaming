const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../middleware/multer.middleware');

router.post('/multer', upload.single('file'), uploadController.uploadWithMulter);
router.post('/busboy', uploadController.uploadWithBusboy);

module.exports = router;
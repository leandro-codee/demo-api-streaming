const uploadService = require('../services/upload.service');
const busboy = require('busboy');
const MemoryTracker = require('../utils/memory-tracker');
const { MAX_FILE_SIZE } = require('../config/constants');

class UploadController {
    async uploadWithMulter(req, res) {
        const memoryTracker = new MemoryTracker();
        memoryTracker.start();

        try {
            const result = await uploadService.uploadToS3(
                req.file.buffer,
                `multer/${req.file.originalname}`
            );

            const memoryStats = memoryTracker.stop();

            res.json({
                message: 'File uploaded successfully using Multer',
                location: result.Location,
                memoryUsage: memoryStats
            });
        } catch (error) {
            memoryTracker.stop();
            res.status(500).json({ error: error.message });
        }
    }

    async uploadWithBusboy(req, res) {
        const memoryTracker = new MemoryTracker();
        memoryTracker.start();

        try {
            const bb = busboy({
                headers: req.headers,
            });

            bb.on('file', async (name, file, info) => {
                try {
                    const result = await uploadService.uploadToS3(
                        file,
                        `busboy/${info.filename}`
                    );

                    const memoryStats = memoryTracker.stop();

                    res.json({
                        message: 'File uploaded successfully using Busboy',
                        location: result.Location,
                        memoryUsage: memoryStats
                    });
                } catch (error) {
                    memoryTracker.stop();
                    res.status(500).json({ error: error.message });
                }
            });

            bb.on('error', (error) => {
                memoryTracker.stop();
                res.status(500).json({ error: error.message });
            });

            bb.on('limit', () => {
                memoryTracker.stop();
                res.status(413).json({ error: 'File size limit exceeded' });
            });

            req.pipe(bb);
        } catch (error) {
            memoryTracker.stop();
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UploadController();
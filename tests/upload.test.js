// tests/upload.test.js
const request = require('supertest');
const app = require('../src/app');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('Upload endpoints', () => {
    const TEST_TIMEOUT = 30000; // 30 segundos
    let smallFilePath;
    let largeFilePath;

    beforeAll(async () => {
        // Crear archivos en el directorio temporal del sistema
        smallFilePath = path.join(os.tmpdir(), 'small-test-file.txt');
        largeFilePath = path.join(os.tmpdir(), 'large-test-file.txt');

        // Crear archivo pequeño (256MB)
        const smallFileStream = fs.createWriteStream(smallFilePath);
        const smallFileSize = 256 * 1024 * 1024;
        for(let i = 0; i < smallFileSize/1024; i++) {
            smallFileStream.write(Buffer.alloc(1024, 'a'));
        }
        await new Promise(resolve => smallFileStream.end(resolve));

        // Crear archivo grande (768MB)
        const largeFileStream = fs.createWriteStream(largeFilePath);
        const largeFileSize = 768 * 1024 * 1024;
        for(let i = 0; i < largeFileSize/1024; i++) {
            largeFileStream.write(Buffer.alloc(1024, 'b'));
        }
        await new Promise(resolve => largeFileStream.end(resolve));
    }, TEST_TIMEOUT);

    afterAll(async () => {
        // Limpiar archivos temporales
        try {
            if (fs.existsSync(smallFilePath)) {
                fs.unlinkSync(smallFilePath);
            }
            if (fs.existsSync(largeFilePath)) {
                fs.unlinkSync(largeFilePath);
            }
        } catch (error) {
            console.error('Error cleaning up test files:', error);
        }
    });

    describe('Multer upload', () => {
        test('Should upload small file successfully', async () => {
            const response = await request(app)
                .post('/upload/multer')
                .attach('file', smallFilePath)
                .timeout(TEST_TIMEOUT);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('location');
            expect(response.body).toHaveProperty('memoryUsage');
        }, TEST_TIMEOUT);

        test('Should reject large file', async () => {
            const response = await request(app)
                .post('/upload/multer')
                .attach('file', largeFilePath)
                .timeout(TEST_TIMEOUT);

            expect(response.status).toBe(413);
        }, TEST_TIMEOUT);
    });

    describe('Busboy upload', () => {
        test('Should upload small file successfully', async () => {
            const response = await request(app)
                .post('/upload/busboy')
                .attach('file', smallFilePath)
                .timeout(TEST_TIMEOUT);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('location');
            expect(response.body).toHaveProperty('memoryUsage');
        }, TEST_TIMEOUT);

        test('Should upload large file successfully', async () => {
            const response = await request(app)
                .post('/upload/busboy')
                .attach('file', largeFilePath)
                .timeout(TEST_TIMEOUT);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('location');
            expect(response.body).toHaveProperty('memoryUsage');
        }, TEST_TIMEOUT);
    });
});
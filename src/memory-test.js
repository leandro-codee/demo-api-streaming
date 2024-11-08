const fs = require('fs');
const path = require('path');
const uploadService = require('./services/upload.service');

async function runMemoryTest() {
    // Create a 1GB test file
    const testFilePath = path.join(__dirname, 'test-file.txt');
    const fileSize = 1024 * 1024 * 1024; // 1GB

    console.log('Creating test file...');
    fs.writeFileSync(testFilePath, Buffer.alloc(fileSize));

    // Test traditional approach
    console.log('\nTesting traditional approach:');
    console.log('Initial memory usage:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');

    const traditionalStart = process.hrtime();
    const file = {
        originalname: 'test-file.txt',
        buffer: fs.readFileSync(testFilePath)
    };

    await uploadService.uploadTraditional(file);

    const traditionalEnd = process.hrtime(traditionalStart);
    console.log('Final memory usage:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
    console.log('Time taken:', traditionalEnd[0], 'seconds');

    // Test streaming approach
    console.log('\nTesting streaming approach:');
    console.log('Initial memory usage:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');

    const streamStart = process.hrtime();
    const fileStream = fs.createReadStream(testFilePath);

    await uploadService.uploadStream(fileStream, 'test-file.txt');

    const streamEnd = process.hrtime(streamStart);
    console.log('Final memory usage:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB');
    console.log('Time taken:', streamEnd[0], 'seconds');

    // Cleanup
    fs.unlinkSync(testFilePath);
}

runMemoryTest().catch(console.error);
// generate-test-files.js
const fs = require('fs');
const path = require('path');

const MB = 1024 * 1024;

function generateFile(filePath, sizeInMB) {
    console.log(`Generando archivo de ${sizeInMB}MB en ${filePath}`);
    const writeStream = fs.createWriteStream(filePath);

    // Escribir en chunks de 1MB para no saturar la memoria
    const chunkSize = 1 * MB;
    const totalChunks = sizeInMB;
    let currentChunk = 0;

    const writeChunk = () => {
        if (currentChunk >= totalChunks) {
            writeStream.end();
            console.log(`✅ Archivo generado: ${filePath}`);
            console.log(`   Tamaño: ${(fs.statSync(filePath).size / MB).toFixed(2)}MB`);
            return;
        }

        const chunk = Buffer.alloc(chunkSize, 'a');
        const canWrite = writeStream.write(chunk);

        if (canWrite) {
            currentChunk++;
            process.stdout.write(`\rProgreso: ${((currentChunk/totalChunks) * 100).toFixed(1)}%`);
            setImmediate(writeChunk);
        } else {
            writeStream.once('drain', () => {
                currentChunk++;
                process.stdout.write(`\rProgreso: ${((currentChunk/totalChunks) * 100).toFixed(1)}%`);
                setImmediate(writeChunk);
            });
        }
    };

    writeChunk();
}

// Crear directorio si no existe
const testFilesDir = path.join(__dirname, 'test-files');
if (!fs.existsSync(testFilesDir)) {
    fs.mkdirSync(testFilesDir);
}

// Generar archivo pequeño (256MB)
generateFile(path.join(testFilesDir, 'small-file-256mb.txt'), 256);

// Generar archivo grande (768MB)
generateFile(path.join(testFilesDir, 'large-file-768mb.txt'), 768);
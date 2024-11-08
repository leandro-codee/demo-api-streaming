// Enfoque Tradicional
const result = await uploadService.uploadTraditional(req.file);

// Enfoque Streaming
const result = await uploadService.uploadStream(fileStream, filename);
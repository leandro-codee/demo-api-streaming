const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../config/s3.js');

class UploadService {
    constructor() {
        this.bucketName = process.env.AWS_BUCKET_NAME;
    }

    async uploadToS3(body, key) {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: this.bucketName,
                Key: key,
                Body: body
            }
        });

        return await upload.done();
    }
}

module.exports = new UploadService();
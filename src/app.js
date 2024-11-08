const express = require('express');
const uploadRoutes = require('./routes/upload.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/upload', uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
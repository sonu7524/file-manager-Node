const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const folderRoutes = require('./routes/folder');
const fileRoutes = require('./routes/files');


// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', authRoutes);
// app.use('/db', setupRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api', fileRoutes);


app.get('/', (req, res) => {
    res.send('File Manager server is working!');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


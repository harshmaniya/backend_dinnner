const express = require('express');
const multer = require('multer');
const router = express.Router()

// router.post('/upload', async (req, res) => {
//     const imageData = req.body.image;
//     const imageUrl = await (imageData);
//     res.json({ imageUrl });
// });


// // Set up multer middleware to handle file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'D:\\college\\Project\\rms\\Admin_Module\\src\\Test')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });
//
// const upload = multer({ storage: storage });
//
// router.post('/upload', upload.array('files'), (req, res) => {
//     // Handle the uploaded file
//     const files = req.files;
//     console.log('Received file:', files);
//     console.log("file path is : ",files[0].path);
//
//     // Send a response
//     res.send('File uploaded');
// });

module.exports = router;
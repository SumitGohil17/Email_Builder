const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
router.get('/getEmailLayout', (req, res) => {
    try {
        const layoutPath = path.join(__dirname, '../templates', 'layout.html');
        const layout = fs.readFileSync(layoutPath, 'utf8');
        res.json({ 
            success: true,
            layout
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error reading layout file',
            details: error.message 
        });
    }
});

router.post('/uploadImage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    cloudinary.uploader.upload(req.file.path, { folder: 'email_images' }, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Error uploading to Cloudinary', details: error.message });
        }
        fs.unlinkSync(req.file.path);
        res.json({ imageUrl: result.secure_url });
    });
});

router.post('/uploadEmailConfig', async (req, res) => {
    try {
        const { name, title, templateType, styles, canvasElements } = req.body;
        
        if (!name || !title) {
            return res.status(400).json({ 
                error: 'Missing required fields: name and title are required' 
            });
        }

        const template = new Template({
            name,
            title,
            templateType,
            styles,
            canvasElements: Array.isArray(canvasElements) ? canvasElements : []
        });

        await template.save();
        
        res.json({ 
            success: true, 
            message: 'Template saved successfully',
            template 
        });
    } catch (error) {
        console.error('Error saving template:', error);
        res.status(500).json({ 
            error: 'Error saving template', 
            details: error.message 
        });
    }
});

router.get('/template/html/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json({
            success: true,
            template: {
                ...template.toObject(),
                htmlContent: template.htmlContent,
                generatedHtml: template.generatedHtml
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error fetching template', 
            details: error.message 
        });
    }
});

module.exports = router;
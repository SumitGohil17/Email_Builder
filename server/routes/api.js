const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

function getFontSize(size) {
    const sizes = {
        xxs: '12px',
        xs: '14px',
        sm: '16px',
        md: '18px',
        lg: '24px',
        xl: '32px'
    };
    return sizes[size] || '16px';
}

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

router.post('/uploadImage', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'email_images'
        });

        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({
            error: 'Error uploading to Cloudinary',
            details: error.message
        });
    }
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

router.get('/renderAndDownloadTemplate/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: ${template.styles?.contentFont || 'Arial'}, sans-serif;
        }
        .email-container {
            position: relative;
            width: 800px;
            margin: 0 auto;
            min-height: 600px;
            background: #ffffff;
            padding: 20px;
        }
        .canvas-container {
            position: relative;
            width: 100%;
            margin: 0 auto;
        }
        @media (max-width: 820px) {
            .email-container {
                width: 100%;
                padding: 10px;
            }
            .canvas-container {
                transform: scale(1);
                transform-origin: top center;
            }
        }
        ${template.styles ? `
            .text-content {
                color: ${template.styles.textColor || '#000000'};
                text-align: ${template.styles.alignment || 'left'};
                font-size: ${template.styles.contentSize ? getFontSize(template.styles.contentSize) : '16px'};
            }
        ` : ''}
    </style>
</head>
<body>
    <div class="email-container">
        ${template.canvasElements?.map(element => {
            const styles = `
                position: absolute;
                left: ${element.x}px;
                top: ${element.y}px;
                ${element.type === 'text' ? `
                    font-family: ${element.fontFamily};
                    font-size: ${element.fontSize}px;
                    color: ${element.fill};
                    text-align: ${element.textAlign};
                    font-style: ${element.fontStyle || 'normal'};
                    font-weight: ${element.fontWeight || 'normal'};
                    text-decoration: ${element.textDecoration || 'none'};
                ` : ''}
            `.trim();

            if (element.type === 'text') {
                return `<div class="text-content" style="${styles}">${element.text}</div>`;
            } else if (element.type === 'image') {
                return `<img src="${element.src}" style="${styles}" alt="" />`;
            }
            return '';
        }).join('\n')}
    </div>
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename=${template.name}.html`);
        res.send(html);
    } catch (error) {
        console.error('Error rendering template:', error);
        res.status(500).json({
            error: 'Error rendering template',
            details: error.message
        });
    }
});

module.exports = router;
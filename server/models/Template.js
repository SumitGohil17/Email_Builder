const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    type: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    text: String,
    src: String,
    fontSize: Number,
    fontFamily: String,
    fill: String,
    textAlign: String,
    fontStyle: String,
    fontWeight: String,
    textDecoration: String,
    id: { type: String, required: true },
    elementType: String
}, { _id: false });

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    templateType: { type: String, default: 'custom' },
    styles: {
        titleFont: String,
        contentFont: String,
        titleSize: String,
        contentSize: String,
        alignment: String,
        textColor: String,
        isBold: Boolean,
        isItalic: Boolean,
        isUnderline: Boolean
    },
    canvasElements: [elementSchema],
    htmlContent: String,
    generatedHtml: String 
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
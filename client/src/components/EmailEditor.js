import React, { useState, useEffect, useRef } from 'react';
import PreviewPanel from './PreviewPanel';
import axios from 'axios';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toggle } from './ui/toggle';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { emailTemplates } from '../data/templates';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter,
    AlignRight, AlignJustify
} from 'lucide-react';
import { DragDropContext } from 'react-beautiful-dnd';
import CodePreview from './CodePreview';
import { generateHtml } from '../utils/htmlGenerator';
import CanvasEditor from './CanvasEditor';
import { useCanvas } from '../context/CanvasContext';

const EmailEditor = ({ templateId, onBack }) => {
    const { updateCanvas } = useCanvas();
    const canvasRef = useRef(null);
    const [template, setTemplate] = useState(() => {
        const selectedTemplate = emailTemplates[templateId];
        return {
            name: selectedTemplate?.name || '',
            title: selectedTemplate?.title || '',
            styles: selectedTemplate?.styles || {},
            elements: selectedTemplate?.elements || []
        };
    });

    const [viewMode, setViewMode] = useState('edit');

    // Remove templateId.split effect
    useEffect(() => {
        if (templateId && emailTemplates[templateId]) {
            const selectedTemplate = emailTemplates[templateId];
            setTemplate(prev => ({
                ...prev,
                name: selectedTemplate.name,
                styles: selectedTemplate.styles,
                elements: selectedTemplate.elements
            }));
        }
    }, [templateId]);

    const [layoutHtml, setLayoutHtml] = useState('');
    const [activeTab, setActiveTab] = useState('content');
    const [isEditing, setIsEditing] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [templateType, setTemplateType] = useState('email');
    const [activeSection, setActiveSection] = useState(null);
    const [templateVariables, setTemplateVariables] = useState({});

    useEffect(() => {
        fetchLayout();
    }, []);

    const fetchLayout = async () => {
        try {
            const response = await axios.get(`https://email-builder-backend-omega.vercel.app/api/getEmailLayout`);
            setLayoutHtml(response.data);
        } catch (error) {
            console.error('Error fetching layout:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const elements = canvasRef.current?.getElements() || [];
            const canvasHtml = canvasRef.current?.generateHTML() || '';

            const htmlContent = generateHtml(canvasHtml); // Import from htmlGenerator.js

            const templateData = {
                name: template.name || 'Untitled Template',
                title: template.title || 'Untitled',
                templateType: templateType,
                styles: template.styles,
                canvasElements: elements.map(el => ({
                    ...el,
                    elementType: el.id.split('-')[0]
                })),
                htmlContent: canvasHtml,
                generatedHtml: htmlContent
            };

            if (!templateData.name || !templateData.title) {
                alert('Please fill in template name and title');
                return;
            }

            const response = await axios.post(`https://email-builder-backend-omega.vercel.app/api/uploadEmailConfig`, templateData);

            if (response.data.success) {
                alert('Template saved successfully!');
            }
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Error saving template: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleStyleChange = (property, value) => {
        setTemplate(prev => ({
            ...prev,
            styles: {
                ...prev.styles,
                [property]: value
            }
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const sections = Array.from(template.sections);
        const [reorderedItem] = sections.splice(result.source.index, 1);
        sections.splice(result.destination.index, 0, reorderedItem);

        setTemplate(prev => ({
            ...prev,
            sections
        }));
    };
    const getFontSizeClass = (pixels) => {
        const sizes = {
            12: 'xxs',
            14: 'xs',
            16: 'sm',
            18: 'md',
            24: 'lg',
            32: 'xl'
        };
        return sizes[pixels] || 'sm';
    };

    const handleElementSelect = (element) => {
        if (element) {
            setTemplate(prev => ({
                ...prev,
                styles: {
                    ...prev.styles,
                    contentFont: element.fontFamily,
                    contentSize: getFontSizeClass(element.fontSize),
                    textColor: element.fill,
                    alignment: element.textAlign,
                    isBold: element.fontWeight === 'bold',
                    isItalic: element.fontStyle === 'italic',
                    isUnderline: element.textDecoration === 'underline'
                }
            }));
        }
    };

    useEffect(() => {
        if (canvasRef.current) {
            const html = canvasRef.current.generateHTML();
            const elements = canvasRef.current.getElements();
            updateCanvas(html, elements);
        }
    }, [template.elements]);

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <header className="border-b px-4 py-2 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back
                </Button>
                <span className="font-medium">{template.name || 'New Template'}</span>
                <div className="ml-auto flex items-center gap-2">
                    <div className="flex rounded-lg border border-gray-200 p-1">
                        <Button
                            variant={viewMode === 'edit' ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode('edit')}
                        >
                            Edit
                        </Button>
                        <Button
                            variant={viewMode === 'preview' ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode('preview')}
                        >
                            Preview
                        </Button>
                        <Button
                            variant={viewMode === 'code' ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode('code')}
                        >
                            Code
                        </Button>
                    </div>
                    <Button variant="ghost" size="sm">Discard</Button>
                    <Button size="sm" onClick={handleSubmit}>Save</Button>
                </div>
            </header>

            {/* Main Content */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex-1">
                    {viewMode === 'edit' && (
                        <CanvasEditor
                            ref={canvasRef}
                            dimensions={{
                                width: 800,
                                height: 1200
                            }}
                            styles={template.styles}
                            elements={template.elements} // Pass template elements
                            onElementsChange={(elements) => {
                                setTemplate(prev => ({ ...prev, elements }));
                            }}
                            onElementSelect={handleElementSelect}
                        >
                            {/* Pass controls as children */}
                            <div className="space-y-6">
                                {/* Controls Panel */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">Text</h3>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        <Toggle
                                            pressed={template.styles.isBold}
                                            onPressedChange={(pressed) => handleStyleChange('isBold', pressed)}
                                            aria-label="Toggle bold"
                                        >
                                            <Bold className="h-4 w-4" />
                                        </Toggle>
                                        <Toggle
                                            pressed={template.styles.isItalic}
                                            onPressedChange={(pressed) => handleStyleChange('isItalic', pressed)}
                                            aria-label="Toggle italic"
                                        >
                                            <Italic className="h-4 w-4" />
                                        </Toggle>
                                        <Toggle
                                            pressed={template.styles.isUnderline}
                                            onPressedChange={(pressed) => handleStyleChange('isUnderline', pressed)}
                                            aria-label="Toggle underline"
                                        >
                                            <Underline className="h-4 w-4" />
                                        </Toggle>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Alignment</Label>
                                            <div className="flex flex-wrap gap-1">
                                                {['left', 'center', 'right', 'justify'].map(align => (
                                                    <Toggle
                                                        key={align}
                                                        pressed={template.styles.alignment === align}
                                                        onPressedChange={() => handleStyleChange('alignment', align)}
                                                        aria-label={`Align ${align}`}
                                                    >
                                                        {align === 'left' && <AlignLeft className="h-4 w-4" />}
                                                        {align === 'center' && <AlignCenter className="h-4 w-4" />}
                                                        {align === 'right' && <AlignRight className="h-4 w-4" />}
                                                        {align === 'justify' && <AlignJustify className="h-4 w-4" />}
                                                    </Toggle>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Font</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Select
                                                    value={template.styles.contentFont}
                                                    onValueChange={(value) => handleStyleChange('contentFont', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Body font" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Arial">Arial</SelectItem>
                                                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                                                        <SelectItem value="Verdana">Verdana</SelectItem>
                                                        <SelectItem value="Tahoma">Tahoma</SelectItem>
                                                        <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                                                        <SelectItem value="Roboto">Roboto</SelectItem>
                                                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                                                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                                        <SelectItem value="Georgia">Georgia</SelectItem>
                                                        <SelectItem value="Garamond">Garamond</SelectItem>
                                                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                                                        <SelectItem value="Courier New">Courier New</SelectItem>
                                                        <SelectItem value="Monaco">Monaco</SelectItem>
                                                        <SelectItem value="Impact">Impact</SelectItem>
                                                        <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Font size</Label>
                                            <RadioGroup
                                                className="flex gap-2"
                                                value={template.styles.contentSize}
                                                onValueChange={(value) => handleStyleChange('contentSize', value)}
                                            >
                                                {['xxs', 'xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
                                                    <div key={size} className="flex items-center space-x-1">
                                                        <RadioGroupItem value={size} id={size} />
                                                        <Label htmlFor={size}>{size.toUpperCase()}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Text color</Label>
                                            <input
                                                type="color"
                                                value={template.styles.textColor}
                                                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                                                className="w-full h-10 rounded-md cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CanvasEditor>
                    )}
                    {viewMode === 'preview' && (
                        <PreviewPanel
                            template={template}
                            layoutHtml={layoutHtml}
                            sections={template.sections}
                            canvasElements={canvasRef.current?.generateHTML()} // Get HTML from CanvasEditor
                        />
                    )}
                    {viewMode === 'code' && (
                        <div className="flex-1 p-4 bg-gray-50">
                            <div className="max-w-4xl mx-auto">
                                <CodePreview
                                    canvasElements={canvasRef.current?.generateHTML()}
                                />
                            </div>
                        </div>
                    )}

                </div>
            </DragDropContext>
        </div>
    );
};

export default EmailEditor;
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import DraggableElement from './DraggableElement';
import ImageUploader from './ImageUploader';

const CanvasEditor = React.forwardRef(({ 
    dimensions, 
    styles, 
    elements: initialElements = [], 
    onElementsChange, 
    onElementSelect,
    children 
}, ref) => {
    const [elements, setElements] = useState(initialElements);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isControlsOpen, setIsControlsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null
    });
    const canvasRef = useRef(null);

    useEffect(() => {
        setElements(initialElements);
    }, [initialElements]);

    useEffect(() => {
        onElementsChange?.(elements);
    }, [elements, onElementsChange]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const addTitle = () => {
        if (!formData.title) {
            alert('Please enter a title');
            return;
        }
        const element = {
            type: 'text',
            x: 50,
            y: 50,
            text: formData.title,
            fontSize: 24,
            fontFamily: styles?.contentFont || 'Arial',
            fill: styles?.textColor || '#000000',
            textAlign: 'center',
            fontWeight: 'bold',
            id: `title-${Date.now()}`
        };
        setElements(prev => [...prev, element]);
        setFormData(prev => ({ ...prev, title: '' }));
    };

    const addContent = () => {
        if (!formData.content) {
            alert('Please enter content');
            return;
        }
        const element = {
            type: 'text',
            x: 50,
            y: 120,
            text: formData.content,
            fontSize: getFontSizeInPixels(styles?.contentSize) || 16,
            fontFamily: styles?.contentFont || 'Arial',
            fill: styles?.textColor || '#000000',
            textAlign: styles?.alignment || 'left',
            id: `content-${Date.now()}`
        };
        setElements(prev => [...prev, element]);
        setFormData(prev => ({ ...prev, content: '' }));
    };

    const addImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const element = {
                type: 'image',
                x: 50,
                y: 50,
                src: e.target.result,
                id: `image-${Date.now()}`
            };
            setElements(prev => [...prev, element]);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            addImage(file);
        }
    };

    const handleSelect = (id) => {
        setSelectedId(id);
        const selectedElement = elements.find(el => el.id === id);
        if (selectedElement) {
            onElementSelect?.(selectedElement);
        }
    };

    const handleChange = (updatedElement) => {
        const newElements = elements.map(el => 
            el.id === updatedElement.id ? 
            {
                ...updatedElement,
                text: updatedElement.text, // Preserve text content
                fontFamily: styles?.contentFont || updatedElement.fontFamily,
                fontSize: getFontSizeInPixels(styles?.contentSize) || updatedElement.fontSize,
                fill: styles?.textColor || updatedElement.fill,
                textAlign: styles?.alignment || updatedElement.textAlign,
                fontStyle: styles?.isItalic ? 'italic' : 'normal',
                fontWeight: styles?.isBold ? 'bold' : 'normal',
                textDecoration: styles?.isUnderline ? 'underline' : '',
            } : el
        );
        setElements(newElements);
    };

    const handleDelete = (id) => {
        setElements(elements.filter(el => el.id !== id));
        setSelectedId(null);
    };

    // Expose generateHTML method through ref
    React.useImperativeHandle(ref, () => ({
        generateHTML: () => {
            return `
                <div class="canvas-container" style="position: relative; width: 800px; margin: 0 auto; min-height: 600px;">
                    ${elements.map(element => {
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
                            return `<div style="${styles}">${element.text}</div>`;
                        } else if (element.type === 'image') {
                            return `<img src="${element.src}" style="${styles}" alt="" />`;
                        }
                        return '';
                    }).join('\n')}
                </div>
            `;
        },
        getElements: () => elements
    }), [elements]);

    useEffect(() => {
        if (selectedId) {
            const selectedElement = elements.find(el => el.id === selectedId);
            if (selectedElement) {
                handleChange(selectedElement);
            }
        }
    }, [styles]);

    return (
        <div className="relative flex flex-col md:flex-row">
            {/* Mobile Toggle Buttons */}
            <div className="fixed bottom-4 right-4 flex gap-2 z-50 md:hidden">
                <Button
                    size="sm"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="rounded-full shadow-lg"
                >
                    {isFormOpen ? 'Close Form' : 'Add Elements'}
                </Button>
                <Button
                    size="sm"
                    onClick={() => setIsControlsOpen(!isControlsOpen)}
                    className="rounded-full shadow-lg"
                >
                    {isControlsOpen ? 'Close Controls' : 'Style Controls'}
                </Button>
            </div>

            {/* Form Panel */}
            <div className={`
                fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out
                md:relative md:w-80 md:translate-x-0 md:transition-none
                ${isFormOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-screen overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <h2 className="text-xl font-semibold">Add Elements</h2>
                        <Button size="sm" onClick={() => setIsFormOpen(false)}>
                            Close
                        </Button>
                    </div>
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Add Elements</h2>
                
                    <div className="space-y-6">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter title"
                                value={formData.title}
                                onChange={handleFormChange}
                                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Button 
                                onClick={addTitle}
                                className="w-full py-2 rounded-md shadow-sm"
                            >
                                Add Title
                            </Button>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea
                                name="content"
                                placeholder="Enter content"
                                value={formData.content}
                                onChange={handleFormChange}
                                rows={4}
                                className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                            <Button 
                                onClick={addContent}
                                className="w-full py-2 rounded-md shadow-sm"
                            >
                                Add Content
                            </Button>
                        </div>

                        {/* Image Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <ImageUploader 
                                onUpload={(url) => {
                                    const element = {
                                        type: 'image',
                                        x: 50,
                                        y: 50,
                                        src: url,
                                        id: `image-${Date.now()}`
                                    };
                                    setElements(prev => [...prev, element]);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Canvas screen */}
            <div className="flex-1 p-4 bg-gray-50 overflow-auto">
                <div 
                    ref={canvasRef}
                    className="relative bg-white shadow-xl rounded-lg mx-auto"
                    style={{ 
                        width: '100%',
                        maxWidth: dimensions.width,
                        height: dimensions.height,
                        transform: `scale(${window.innerWidth < 768 ? 0.5 : 1})`,
                        transformOrigin: 'top center'
                    }}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {elements.map(element => (
                        <DraggableElement
                            key={element.id}
                            element={element}
                            isSelected={selectedId === element.id}
                            onSelect={handleSelect}
                            onChange={handleChange}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>

            {/* Controls Panel */}
            <div className={`
                fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out
                md:relative md:w-80 md:translate-x-0 md:transition-none
                ${isControlsOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-screen overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <h2 className="text-xl font-semibold">Style Controls</h2>
                        <Button size="sm" onClick={() => setIsControlsOpen(false)}>
                            Close
                        </Button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
});

// Add helper function
const getFontSizeInPixels = (size) => {
    const sizes = {
        xxs: 12,
        xs: 14,
        sm: 16,
        md: 18,
        lg: 24,
        xl: 32
    };
    return sizes[size] || 16;
};

export default CanvasEditor;

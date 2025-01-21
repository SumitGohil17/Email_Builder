import React, { useState } from 'react';
import { Button } from './ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import ImageUploader from './ImageUploader';
import DraggableElement from './DraggableElement';

const EmailSection = ({ section, onUpdate, onDelete, activeStyles }) => {
    const handlePositionChange = (position) => {
        onUpdate({ 
            position,
            styles: { ...section.styles, position: 'absolute', ...position }
        });
    };

    const handleSizeChange = ({ width, height, position }) => {
        onUpdate({ 
            size: { width, height },
            position,
            styles: { 
                ...section.styles, 
                width, 
                height,
                position: 'absolute',
                ...position
            }
        });
    };

    const applyStyles = (content) => {
        const styles = [];
        if (activeStyles.isBold) styles.push('font-bold');
        if (activeStyles.isItalic) styles.push('italic');
        if (activeStyles.isUnderline) styles.push('underline');
        if (activeStyles.alignment) styles.push(`text-${activeStyles.alignment}`);
        
        return `<div class="${styles.join(' ')}" style="
            color: ${activeStyles.textColor};
            font-family: ${activeStyles.contentFont};
            font-size: ${activeStyles.contentSize};
        ">${content}</div>`;
    };

    const renderContent = () => {
        switch (section.type) {
            case 'text':
                return (
                    <textarea
                        value={section.content}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        className={`w-full p-2 min-h-[40px] border rounded resize-none
                            ${activeStyles.isBold ? 'font-bold' : ''}
                            ${activeStyles.isItalic ? 'italic' : ''}
                            ${activeStyles.isUnderline ? 'underline' : ''}
                            ${activeStyles.alignment ? `text-${activeStyles.alignment}` : ''}
                        `}
                        style={{
                            color: activeStyles.textColor,
                            fontFamily: activeStyles.contentFont,
                            fontSize: getFontSize(activeStyles.contentSize)
                        }}
                    />
                );
            case 'image':
                return (
                    <div className="relative group">
                        {section.imageUrl ? (
                            <img 
                                src={section.imageUrl} 
                                alt="Section" 
                                className="max-w-full h-auto"
                            />
                        ) : (
                            <ImageUploader 
                                onUpload={(imageUrl) => onUpdate({ imageUrl })}
                            />
                        )}
                    </div>
                );

            case 'button':
                return (
                    <div className="relative group space-y-2">
                        <input
                            type="text"
                            value={section.buttonText}
                            onChange={(e) => onUpdate({ buttonText: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Button text"
                        />
                        <input
                            type="url"
                            value={section.buttonUrl}
                            onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Button URL"
                        />
                    </div>
                );

            case 'divider':
                return (
                    <div className="relative group py-4">
                        <hr className="border-t-2" />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="relative group">
            <DraggableElement
                onPositionChange={handlePositionChange}
                onSizeChange={handleSizeChange}
                defaultPosition={section.position}
                defaultSize={section.size}
            >
                {renderContent()}
            </DraggableElement>
            <SectionControls onDelete={onDelete} />
        </div>
    );
};

const getFontSize = (size) => {
    const sizes = {
        xs: '0.75rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem'
    };
    return sizes[size] || '1rem';
};

const SectionControls = ({ onDelete }) => (
    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
        </Button>
        <GripVertical className="h-4 w-4 cursor-move" />
    </div>
);

export default EmailSection;

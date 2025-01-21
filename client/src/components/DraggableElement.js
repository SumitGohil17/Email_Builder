import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';

const DraggableElement = ({ element, isSelected, onSelect, onChange, onDelete }) => {
    const [position, setPosition] = useState({ x: element.x || 0, y: element.y || 0 });
    const elementRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const touchRef = useRef({ startX: 0, startY: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        onSelect(element.id);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        const newPosition = {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        };
        
        setPosition(newPosition);
        onChange({ ...element, ...newPosition });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        touchRef.current = {
            startX: touch.clientX - position.x,
            startY: touch.clientY - position.y
        };
        setIsDragging(true);
        onSelect(element.id);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const newX = touch.clientX - touchRef.current.startX;
        const newY = touch.clientY - touchRef.current.startY;

        setPosition({ x: newX, y: newY });
        onChange({ ...element, x: newX, y: newY });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    return (
        <div
            ref={elementRef}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            className={`${isSelected ? 'ring-2 ring-blue-500' : ''} touch-manipulation`}
        >
            {element.type === 'text' && (
                <div 
                    contentEditable
                    suppressContentEditableWarning
                    className="min-w-[100px] min-h-[40px] p-2"
                    style={{
                        fontFamily: element.fontFamily,
                        fontSize: `${element.fontSize}px`,
                        color: element.fill,
                        textAlign: element.textAlign,
                        fontStyle: element.fontStyle,
                        fontWeight: element.fontWeight,
                        textDecoration: element.textDecoration
                    }}
                    onBlur={(e) => onChange({ 
                        ...element, 
                        text: e.target.innerText 
                    })}
                >
                    {element.text}
                </div>
            )}
            {element.type === 'image' && (
                <img 
                    src={element.src} 
                    alt=""
                    className="max-w-[300px] h-auto"
                />
            )}
            {isSelected && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(element.id)}
                    className="absolute -top-2 -right-2"
                >
                    ×
                </Button>
            )}
        </div>
    );
};

export default DraggableElement;

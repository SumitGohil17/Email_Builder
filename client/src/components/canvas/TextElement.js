import React, { useRef, useEffect, useState } from 'react';
import { Text, Transformer } from 'react-konva';

const TextElement = ({ element, isSelected, onSelect, onChange }) => {
    const textRef = useRef();
    const trRef = useRef();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isSelected && trRef.current && textRef.current) {
            trRef.current.nodes([textRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const handleTextDblClick = (e) => {
        setIsEditing(true);
        const stage = e.target.getStage();
        const textPosition = textRef.current.absolutePosition();
        
        // Create textarea overlay
        const textArea = document.createElement('textarea');
        document.body.appendChild(textArea);

        // Style the textarea
        const styles = {
            position: 'absolute',
            top: `${textPosition.y}px`,
            left: `${textPosition.x}px`,
            width: `${textRef.current.width() - textRef.current.padding() * 2}px`,
            height: `${textRef.current.height() - textRef.current.padding() * 2}px`,
            fontSize: `${element.fontSize}px`,
            border: 'none',
            padding: '5px',
            margin: '0px',
            overflow: 'hidden',
            background: 'none',
            outline: 'none',
            resize: 'none',
            lineHeight: element.lineHeight || '1',
            fontFamily: element.fontFamily || 'Arial',
            color: element.fill || 'black',
            textAlign: element.align || 'left',
            transformOrigin: 'left top'
        };

        Object.assign(textArea.style, styles);
        textArea.value = element.text;
        textArea.focus();

        function handleOutsideClick(e) {
            if (e.target !== textArea) {
                removeTextarea();
            }
        }

        function removeTextarea() {
            setIsEditing(false);
            document.body.removeChild(textArea);
            window.removeEventListener('click', handleOutsideClick);
            onChange({
                ...element,
                text: textArea.value
            });
        }

        textArea.addEventListener('keydown', (e) => {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                removeTextarea();
            }
            if (e.keyCode === 27) {
                removeTextarea();
            }
        });

        textArea.addEventListener('blur', removeTextarea);
        window.addEventListener('click', handleOutsideClick);
    };

    const handleTransformEnd = () => {
        const node = textRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            width: Math.max(node.width() * scaleX, 20),
            height: Math.max(node.height() * scaleY, 20),
            fontSize: element.fontSize * scaleX,
            rotation: node.rotation()
        });
    };

    return (
        <>
            <Text
                ref={textRef}
                {...element}
                onClick={() => onSelect(element.id)}
                onDblClick={handleTextDblClick}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...element,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onTransformEnd={handleTransformEnd}
                fontSize={element.fontSize || 16}
                fontFamily={element.fontFamily || 'Arial'}
                fill={element.fill || 'black'}
                padding={5}
            />
            {isSelected && !isEditing && (
                <Transformer
                    ref={trRef}
                    enabledAnchors={[
                        'top-left', 'top-right',
                        'bottom-left', 'bottom-right'
                    ]}
                    boundBoxFunc={(oldBox, newBox) => {
                        // Limit resize
                        if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

export default TextElement;

import React, { createContext, useContext, useState, useEffect } from 'react';

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
    const [canvasState, setCanvasState] = useState({
        html: '',
        elements: [],
        lastUpdate: null
    });

    const updateCanvas = (html, elements) => {
        setCanvasState({
            html,
            elements,
            lastUpdate: Date.now()
        });
        localStorage.setItem('canvasState', JSON.stringify({
            html,
            elements,
            lastUpdate: Date.now()
        }));
    };

    return (
        <CanvasContext.Provider value={{ canvasState, updateCanvas }}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => useContext(CanvasContext);
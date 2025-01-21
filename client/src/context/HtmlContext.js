import React, { createContext, useContext, useState, useEffect } from 'react';

const HtmlContext = createContext();

export const HtmlProvider = ({ children }) => {
    const [htmlState, setHtmlState] = useState(() => {
        const saved = localStorage.getItem('canvasHtml');
        return saved ? JSON.parse(saved) : { html: '', timestamp: null };
    });

    const updateHtml = (newHtml) => {
        const state = { html: newHtml, timestamp: Date.now() };
        setHtmlState(state);
        localStorage.setItem('canvasHtml', JSON.stringify(state));
    };

    return (
        <HtmlContext.Provider value={{ htmlState, updateHtml }}>
            {children}
        </HtmlContext.Provider>
    );
};

export const useHtml = () => useContext(HtmlContext);
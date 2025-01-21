import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { generateHtml } from '../utils/htmlGenerator';
// import { useHtml } from '../context/HtmlContext';
import { useCanvas } from '../context/CanvasContext';

const PreviewPanel = () => {
    const { canvasState } = useCanvas();
    const previewRef = useRef(null);
    const [viewMode, setViewMode] = useState('desktop');

    useEffect(() => {
        if (previewRef.current && canvasState.html) {
            previewRef.current.srcdoc = generateHtml(canvasState.html);
        }
    }, [canvasState.html, viewMode]);

    return (
        <div className="flex-1 p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-medium">Preview</h3>
                        <div className="flex items-center gap-2">
                            <Button 
                                size="sm" 
                                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                                onClick={() => setViewMode('mobile')}
                            >
                                Mobile View
                            </Button>
                            <Button 
                                size="sm" 
                                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                                onClick={() => setViewMode('desktop')}
                            >
                                Desktop View
                            </Button>
                        </div>
                    </div>
                    <div className="p-4">
                        <iframe
                            ref={previewRef}
                            className={`w-full min-h-[600px] border-0 transition-all duration-300 ${
                                viewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''
                            }`}
                            title="Canvas Preview"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
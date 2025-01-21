import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Check, Copy, Download } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import { generateHtml } from '../utils/htmlGenerator';
import { useCanvas } from '../context/CanvasContext';

const CodePreview = () => {
    const { canvasState } = useCanvas();

    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (canvasState.html) {
            Prism.highlightAll();
        }
    }, [canvasState.html]);

    const getFormattedHtml = () => {
        return generateHtml(canvasState.html).replace(/^\s+/gm, '    ');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getFormattedHtml());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadHtml = () => {
        const blob = new Blob([getFormattedHtml()], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'canvas-design.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-white font-medium">Complete HTML Code</h3>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="text-gray-300 hover:text-white"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 mr-2" />
                        ) : (
                            <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadHtml}
                        className="text-gray-300 hover:text-white"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                </div>
            </div>
            <div className="p-4 overflow-auto max-h-[600px]">
                <pre className="!bg-transparent !p-0">
                    <code className="language-markup">
                        {getFormattedHtml()}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodePreview;

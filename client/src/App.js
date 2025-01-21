import React, { useState } from 'react';
import TemplateSelector from './components/TemplateSelector';
import EmailEditor from './components/EmailEditor';
import { HtmlProvider } from './context/HtmlContext';
import { CanvasProvider } from './context/CanvasContext';
import {emailTemplates} from "./data/templates";

const App = () => {
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);

    const handleTemplateSelect = (templateId) => {
        if (emailTemplates[templateId]) {
            setSelectedTemplateId(templateId);
        }
    };

    return (
        <HtmlProvider>
            <CanvasProvider>
                <div className="min-h-screen bg-gray-50">
                {selectedTemplateId ? (
                    <EmailEditor 
                        templateId={selectedTemplateId}
                        onBack={() => setSelectedTemplateId(null)}
                    />
                ) : (
                    <TemplateSelector onSelectTemplate={handleTemplateSelect} />
                )}
                </div>
            </CanvasProvider>
        </HtmlProvider>
    );
};

export default App;
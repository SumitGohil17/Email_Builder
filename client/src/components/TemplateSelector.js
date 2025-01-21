import React from 'react';
import { emailTemplates } from '../data/templates';

const TemplateSelector = ({ onSelectTemplate }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Select a Template</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(emailTemplates).map(([id, template]) => (
                    <div
                        key={id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => onSelectTemplate(id)}
                    >
                        <img
                            src={template.thumbnail}
                            alt={template.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                            <p className="text-gray-600">{template.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
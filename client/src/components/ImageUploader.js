import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';

const ImageUploader = ({ onUpload }) => {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const response = await axios.post(`https://email-builder-backend-omega.vercel.app/api/uploadImage`, formData);
            onUpload(response.data.imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
        setUploading(false);
    };

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (imageUrl.trim()) {
            onUpload(imageUrl);
            setImageUrl('');
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="w-full p-2 border rounded-md"
                />
                {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <form onSubmit={handleUrlSubmit} className="flex gap-2">
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL"
                        className="flex-1 p-2 border rounded-md"
                    />
                    <Button type="submit">Add</Button>
                </form>
            </div>
        </div>
    );
};

export default ImageUploader;
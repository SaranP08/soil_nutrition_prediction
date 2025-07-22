import React, { useState, useCallback } from 'react';
import { DocumentArrowUpIcon, DocumentCheckIcon } from './Icons.jsx';

const FileUpload = ({ onFileSelect }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv') {
                setSelectedFile(file);
                onFileSelect(file);
            } else {
                alert('Please upload a valid .csv file.');
                setSelectedFile(null);
                onFileSelect(null);
            }
        }
    };
    
    const onDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const onDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    }, [handleFileChange]);

    return (
        <label
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-brand-blue-50 transition-colors duration-300
                ${isDragging ? 'border-brand-blue-600' : 'border-gray-300'}
            `}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                {selectedFile ? (
                    <>
                        <DocumentCheckIcon className="w-10 h-10 mb-3 text-green-500" />
                        <p className="mb-2 text-sm font-semibold text-gray-800">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    </>
                ) : (
                    <>
                        <DocumentArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold text-brand-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV file with lat, lon, and date</p>
                    </>
                )}
            </div>
            <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={(e) => handleFileChange(e.target.files)}
            />
        </label>
    );
};

export default FileUpload;
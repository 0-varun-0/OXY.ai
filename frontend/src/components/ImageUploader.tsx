import React, { useState, ChangeEvent } from 'react';
import { Button, Box, Card, CardMedia, Typography, CircularProgress, Alert } from '@mui/material';

interface ImageUploaderProps {
  onUploadSuccess: (filename: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Client-side validation
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Invalid file type. Please select a JPG or PNG image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('File is too large. Maximum size is 5MB.');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/v1/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed');
      }
      
      // Extract filename from the success message
      import api from '../services/api';

// ... (imports and interface)

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  // ... (state declarations)

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const data = await api.uploadImage(selectedFile);
      const filenameMatch = data.message.match(/'([^']+)'/);
      if (filenameMatch) {
        onUploadSuccess(filenameMatch[1]);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setUploading(false);
    }
  };

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ my: 4, p: 2, border: '1px dashed grey', borderRadius: 2, textAlign: 'center' }}>
      <Button variant="contained" component="label">
        Select Image
        <input type="file" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
      </Button>

      {previewUrl && (
        <Card sx={{ mt: 2, maxWidth: 345, mx: 'auto' }}>
          <CardMedia component="img" height="194" image={previewUrl} alt="Image preview" />
        </Card>
      )}

      {selectedFile && (
        <Box sx={{ mt: 2 }}>
          <Typography>File: {selectedFile.name}</Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleUpload} 
            disabled={uploading} 
            sx={{ mt: 1 }}
          >
            {uploading ? <CircularProgress size={24} /> : 'Upload Image'}
          </Button>
        </Box>
      )}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default ImageUploader;
rror" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default ImageUploader;

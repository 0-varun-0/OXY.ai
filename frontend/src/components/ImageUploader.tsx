import React, { useState, ChangeEvent } from 'react';
import { Button, Box, Card, CardMedia, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
    try {
      const data = await api.uploadImage(selectedFile);
      const filenameMatch = data.message.match(/'([^']+)'/);
      if (filenameMatch) {
        onUploadSuccess(filenameMatch[1]);
      }
    } catch (err) {
      const error = err as Error;
      setError(`Upload failed: ${error.message}`);
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
        <Card sx={{ mt: 2, maxWidth: 345, mx: 'auto' }}><CardMedia component="img" image={previewUrl} alt="Image preview" /></Card>
      )}
      {selectedFile && (
        <Box sx={{ mt: 2 }}>
          <Typography>File: {selectedFile.name}</Typography>
          <Button variant="contained" color="secondary" onClick={handleUpload} disabled={uploading} sx={{ mt: 1 }}>
            {uploading ? <CircularProgress size={24} /> : 'Upload Image'}
          </Button>
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default ImageUploader;
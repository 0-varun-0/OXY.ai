import React, { useState } from 'react';
import { Typography, Box, Paper } from '@mui/material';
import ImageUploader from '../components/ImageUploader';

const ChatPage: React.FC = () => {
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  const handleUploadSuccess = (filename: string) => {
    setUploadedFilename(filename);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {!uploadedFilename ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Step 1: Upload a Skin Lesion Image
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please upload a clear, well-lit image (JPG or PNG, max 5MB) for analysis.
          </Typography>
          <ImageUploader onUploadSuccess={handleUploadSuccess} />
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            Step 2: Ask a Question
          </Typography>
          <Typography>Uploaded file: {uploadedFilename}</Typography>
          {/* The Chat Interface component will go here in a future stage */}
        </Box>
      )}
    </Paper>
  );
};

export default ChatPage;
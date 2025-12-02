// frontend/src/components/Conversation.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';

interface QA {
  question: string;
  answer: string;
}

interface ConversationProps {
  imageId: string | null;
  conversation: QA[];
  onNewQA: (qa: QA) => void;
}

const Conversation: React.FC<ConversationProps> = ({ imageId, conversation, onNewQA }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageId) {
      setError('Please upload an image first.');
      return;
    }
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image_id', imageId);
    formData.append('question', question);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Query failed');
      }

      const data = await response.json();
      onNewQA(data);
      setQuestion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {conversation.map((qa, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Paper elevation={1} sx={{ p: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '10px 10px 10px 0' }}>
              <Typography variant="body1">{qa.question}</Typography>
            </Paper>
            <Paper elevation={1} sx={{ p: 1.5, mt: 1, bgcolor: 'background.paper', borderRadius: '10px 10px 0 10px' }}>
              <Typography variant="body1"><strong>Answer:</strong> {qa.answer}</Typography>
            </Paper>
          </Box>
        ))}
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>}
        <div ref={conversationEndRef} />
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        {error && <Typography color="error" sx={{ mb: 1, textAlign: 'center' }}>{error}</Typography>}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={imageId ? "Ask a question..." : "Upload an image to start"}
            disabled={!imageId || loading}
          />
          <Button type="submit" variant="contained" disabled={!imageId || loading}>
            {loading ? '...' : 'Ask'}
          </Button>.
        </Box>
      </Box>
    </>
  );
};

export default Conversation;
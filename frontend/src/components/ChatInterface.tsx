import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Define types for our data
interface Message {
  id: number;
  text: string;
  is_from_user: boolean;
}

interface ChatInterfaceProps {
  imageFilename: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ imageFilename }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, is_from_user: true };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/vqa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_filename: imageFilename,
          question: currentInput,
          conversation_id: conversationId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to get response');

      // After a successful VQA call, fetch the whole conversation history
      import api from '../services/api';

// ... (imports and interfaces)

const ChatInterface: React.FC<ChatInterfaceProps> = ({ imageFilename }) => {
  // ... (state declarations)

  const handleSendMessage = async () => {
    // ... (initial checks)

    try {
      const vqaData = await api.postVqa(imageFilename, currentInput, conversationId);
      const historyData = await api.getConversationHistory(vqaData.conversation_id);

      setMessages(historyData.messages);
      setConversationId(historyData.id);

    } catch (err: any) {
      setError(err.message);
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <Typography variant="h6" gutterBottom>Conversation</Typography>
      <Paper elevation={2} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, mb: 2 }}>
        <List>
          {messages.map((msg) => (
            <ListItem key={msg.id} sx={{ display: 'flex', justifyContent: msg.is_from_user ? 'flex-end' : 'flex-start' }}>
              <Paper elevation={1} sx={{ p: 1.5, bgcolor: msg.is_from_user ? 'primary.main' : 'grey.300', color: msg.is_from_user ? 'primary.contrastText' : 'inherit', maxWidth: '70%' }}>
                {msg.text}
              </Paper>
            </ListItem>
          ))}
          {isLoading && <ListItem sx={{justifyContent: 'flex-start'}}><CircularProgress size={24} /></ListItem>}
        </List>
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about the image..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
        />
        <Button variant="contained" onClick={handleSendMessage} disabled={isLoading} sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;

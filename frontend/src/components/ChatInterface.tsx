import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem, CircularProgress, Alert, Divider } from '@mui/material';
import api from '../services/api';

interface Message {
  id: number;
  text: string;
  is_from_user: boolean;
  disclaimer?: string;
}
interface ChatInterfaceProps {
  imageFilename: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ imageFilename }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      { id: Date.now(), text: 'Please ask a question about the uploaded image to begin the analysis.', is_from_user: false }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: currentInput, is_from_user: true }]);
    setIsLoading(true);
    setError(null);

    try {
      const vqaData = await api.postVqa(imageFilename, currentInput, conversationId);
      const historyData = await api.getConversationHistory(vqaData.conversation_id);
      setMessages(historyData.messages.map((msg: any) => ({ ...msg, disclaimer: vqaData.disclaimer })));
      setConversationId(historyData.id);
    } catch (err) {
      const error = err as Error;
      setError(`Failed to get response: ${error.message}`);
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
            <ListItem key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.is_from_user ? 'flex-end' : 'flex-start' }}>
              <Paper elevation={1} sx={{ p: 1.5, bgcolor: msg.is_from_user ? 'primary.main' : 'grey.300', color: msg.is_from_user ? 'primary.contrastText' : 'inherit', maxWidth: '80%' }}>
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
              {!msg.is_from_user && msg.disclaimer && (
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', maxWidth: '80%' }}>{msg.disclaimer}</Typography>
              )}
            </ListItem>
          ))}
          {isLoading && <ListItem sx={{justifyContent: 'flex-start'}}><CircularProgress size={24} /></ListItem>}
        </List>
      </Paper>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex' }}>
        <TextField fullWidth variant="outlined" placeholder="Ask a question..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()} disabled={isLoading} />
        <Button variant="contained" onClick={handleSendMessage} disabled={isLoading} sx={{ ml: 1 }}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatInterface;
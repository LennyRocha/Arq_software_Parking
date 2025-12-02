import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
} from '@mui/icons-material';

const ChatWidget = ({ open, onClose }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! 👋 Soy el asistente de parKing. ¿En qué puedo ayudarte con tu estacionamiento?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Conectar directamente al webhook con formato específico para AI Agent
      const response = await fetch('https://sfsd345sdf.app.n8n.cloud/webhook/eb1853ea-9747-448e-a8aa-b237b38e06e8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Formato específico que espera el AI Agent de n8n
          input: currentInput,
          chatInput: currentInput,
          message: currentInput,
          text: currentInput,
          question: currentInput
        })
      });

      let botResponse;
      
      if (response.ok) {
        // Verificar si hay contenido antes de parsearlo
        const text = await response.text();
        console.log('Respuesta del servidor:', text);
        
        if (text) {
          try {
            const data = JSON.parse(text);
            // Buscar la respuesta en diferentes campos posibles
            botResponse = data.response || 
                         data.message || 
                         data.reply || 
                         data.output || 
                         data.text || 
                         data.chatResponse ||
                         'Respuesta recibida correctamente';
          } catch (parseError) {
            console.log('Error parseando JSON:', parseError);
            botResponse = text; // Si no es JSON, usar el texto directo
          }
        } else {
          botResponse = 'El servidor respondió pero no envió datos. Verifica que tu workflow de n8n esté configurado para devolver una respuesta.';
        }
      } else {
        // Si hay error, mostrar mensaje más específico
        const errorText = await response.text();
        console.error('Error del servidor n8n:', response.status, errorText);
        botResponse = `Error del servidor (${response.status}). Por favor, verifica que tu workflow de n8n esté activo y configurado correctamente.`;
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, no puedo conectarme al servidor en este momento. Por favor, inténtalo más tarde.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: '600px',
          maxHeight: '80vh',
          borderRadius: 3,
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BotIcon />
          <Typography variant="h6" component="div">
            parKing Asistente
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="cerrar"
          sx={{ color: 'inherit' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Messages Area */}
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                ...(message.sender === 'user' && {
                  flexDirection: 'row-reverse',
                }),
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: message.sender === 'bot' 
                    ? theme.palette.primary.main 
                    : theme.palette.secondary.main,
                }}
              >
                {message.sender === 'bot' ? <BotIcon fontSize="small" /> : <UserIcon fontSize="small" />}
              </Avatar>
              
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  backgroundColor: message.sender === 'bot' 
                    ? theme.palette.background.paper 
                    : theme.palette.primary.main,
                  color: message.sender === 'bot' 
                    ? theme.palette.text.primary 
                    : theme.palette.primary.contrastText,
                  borderRadius: 2,
                  ...(message.sender === 'user' && {
                    borderTopRightRadius: 4,
                  }),
                  ...(message.sender === 'bot' && {
                    borderTopLeftRadius: 4,
                  }),
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>
              </Paper>
            </Box>
          ))}
          
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                <BotIcon fontSize="small" />
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  borderTopLeftRadius: 4,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Escribiendo...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            variant="outlined"
            size="small"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:disabled': {
                backgroundColor: theme.palette.action.disabled,
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWidget;
import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  Send, 
  Image as ImageIcon, 
  Bot, 
  User, 
  RefreshCw, 
  Trash2, 
  FileText
} from "lucide-react";
import Header from './components/Header';
import Login from './components/Login';
import './App.css';

// ⚠️ CHANGE THIS if your backend is running elsewhere
const API_BASE = "http://localhost:8000";

type ChatMessage = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
};

// More suggestions can be added here to expand the feature.
const SUGGESTIONS_CATEGORIES = {
  "Presence & Location": [
    "Is there any evidence of pneumothorax?",
    "Where is the lesion located?",
    "Is there a foreign object visible?",
    "Are the lungs clear?",
    "Is there any fluid in the lungs?",
    "Locate the primary area of concern.",
    "Is there any sign of cardiomegaly?",
    "Are there any signs of consolidation?",
    "Is the trachea midline?",
    "Are there any pleural effusions?",
    "Is there evidence of interstitial lung disease?",
    "Locate the hilar region.",
    "Are the cardiomediastinal contours normal?",
    "Is there any free air under the diaphragm?",
    "Are the costophrenic angles sharp?",
    "Is there any evidence of atelectasis?",
    "Locate the apex of the heart.",
  ],
  "Attributes & Characteristics": [
    "What is the size of the nodule?",
    "Describe the shape and margin of the mass.",
    "What are the characteristics of the fracture?",
    "Is the opacity well-defined or diffuse?",
    "Describe the texture of the bone.",
    "Is the lesion solid or cystic?",
    "Describe the density of the observed mass.",
    "Is the lesion calcified?",
    "What is the orientation of the fracture line?",
    "Is there any displacement of the fracture?",
    "Describe the vascular markings.",
    "Is the mass homogeneous or heterogeneous?",
    "Are the borders of the heart sharp?",
    "Describe the pattern of gas in the bowel.",
    "Is the lesion cavitary?",
    "What is the attenuation of the lesion?",
  ],
  "Counting & Comparison": [
    "How many nodules are visible?",
    "Compare the size of the left and right lung.",
    "Is the heart size within normal limits?",
    "Are there multiple fractures?",
    "Count the number of ribs affected.",
    "Compare the vascularity in the upper and lower lobes.",
    "Is the cardiothoracic ratio normal?",
    "Are there more than one lesions?",
    "Compare the density of the lesion to the surrounding tissue.",
    "Are the findings symmetric?",
    "How many lobes are affected?",
    "Is the left hemidiaphragm higher than the right?",
    "Are there any satellite lesions?",
    "Count the number of clips or markers.",
  ],
};

function MainApp() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null); 
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [activeSuggestionTab, setActiveSuggestionTab] = useState(Object.keys(SUGGESTIONS_CATEGORIES)[0]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, loading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setChatLog([]);
    setImageId(null);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", f);

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: fd
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      setImageId(data.image_id);
      
    } catch (err) {
      setChatLog([{
        id: "sys-err",
        sender: 'bot',
        text: "Error: Could not connect to the backend server. Is main.py running?",
        isError: true
      }]);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageId(null);
    setChatLog([]);
    setQuestion("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleQuery = async (q?: string) => {
    const currentQ = q || question;
    if (!currentQ.trim() || !imageId) return;

    setQuestion("");
    setLoading(true);

    const newMessage: ChatMessage = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: currentQ 
    };
    
    const updatedLog = [...chatLog, newMessage];
    setChatLog(updatedLog);

    try {
      const fd = new FormData();
      fd.append("image_id", imageId);
      fd.append("question", currentQ);

      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      setChatLog(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'bot', 
        text: data.answer 
      }]);

    } catch (err: any) {
      setChatLog(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'bot', 
        text: "Sorry, I encountered an error processing that request.",
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuery();
    }
  };

  return (
    <div className="app-container">
      <Header imageId={imageId} />

      <main className="main-content">
        
        <div className="panel-left">
          <div className="card">
            <div className="card-header">
              <span style={{display:'flex', gap:8, alignItems:'center'}}>
                <ImageIcon size={18} color="#4f46e5" /> Analysis Target
              </span>
              {selectedFile && (
                <button onClick={clearImage} style={{background:'none', border:'none', cursor:'pointer', color:'#ef4444'}}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              {!previewUrl ? (
                <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                  <UploadCloud size={48} color="#cbd5e1" style={{marginBottom: 12}} />
                  <p style={{fontWeight: 500, color: '#4b5563'}}>Tap to Upload X-Ray</p>
                  <p style={{fontSize:'0.8rem', color:'#9ca3af'}}>JPG, PNG, DICOM</p>
                </div>
              ) : (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                  <button className="btn-overlay" onClick={() => fileInputRef.current?.click()}>Change Image</button>
                </div>
              )}
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            
            <div style={{marginTop: 10, minHeight: '20px'}}>
                {uploading && (
                  <div style={{fontSize:'0.8rem', color:'#6366f1', display:'flex', alignItems:'center', gap:6}}>
                    <RefreshCw className="spin" size={12} /> Uploading to server...
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="panel-right">
          <div className="card">
            <div className="card-header" style={{marginBottom:0, paddingBottom:'1rem', borderBottom:'1px solid #f3f4f6'}}>
              <span style={{display:'flex', gap:8, alignItems:'center'}}>
                <Bot size={18} color="#4f46e5" /> Diagnostic Conversation
              </span>
              {chatLog.length > 0 && (
                <button onClick={() => setChatLog([])} style={{background:'none', border:'none', fontSize:'0.75rem', color:'#9ca3af', cursor:'pointer'}}>
                  Clear Chat
                </button>
              )}
            </div>

            <div className="chat-window">
              {chatLog.length === 0 ? (
                <div className="empty-chat">
                  <FileText size={48} />
                  <p>{!imageId ? "Upload an image to start the analysis." : "Image uploaded. Ask a question."}</p>
                </div>
              ) : (
                chatLog.map(msg => (
                  <div key={msg.id} className={`message-row ${msg.sender}`}>
                    <div className={`avatar ${msg.sender}`}>
                      {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
                    </div>
                    <div className={`bubble ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="message-row bot">
                  <div className="avatar bot"><Bot size={18} /></div>
                  <div className="bubble bot" style={{display:'flex', alignItems:'center', gap:8, color:'#9ca3af'}}>
                    <RefreshCw className="spin" size={14} /> Analyzing...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {imageId && (
              <div className="suggestions-container">
                <h3 className="suggestions-title">Prompt Suggestions</h3>
                <div className="suggestions-tabs">
                  {Object.keys(SUGGESTIONS_CATEGORIES).map(category => (
                    <button 
                      key={category} 
                      className={`tab ${activeSuggestionTab === category ? 'active' : ''}`}
                      onClick={() => setActiveSuggestionTab(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="suggestions-list">
                  {SUGGESTIONS_CATEGORIES[activeSuggestionTab as keyof typeof SUGGESTIONS_CATEGORIES].map((q, i) => (
                    <div key={i} className="suggestion-item" onClick={() => handleQuery(q)}>{q}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="input-area">
              <div className="input-wrapper">
                <input
                  className="chat-input"
                  placeholder={imageId ? "Ask a question or use a suggestion..." : "Waiting for upload..."}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading || !imageId}
                />
                <button 
                  className="send-btn" 
                  onClick={() => handleQuery()} 
                  disabled={loading || !question.trim() || !imageId}
                >
                  {loading ? <RefreshCw className="spin" size={18} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <MainApp />;
}

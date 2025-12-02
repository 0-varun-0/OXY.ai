import React, { useState } from 'react';
import './index.css';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8000'; // Assuming backend runs on port 8000

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImageId(null); // Reset imageId when a new image is selected
      setAnswer(null); // Reset answer
      setError(null); // Clear any previous errors

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Image upload failed.');
      }

      const data = await response.json();
      setImageId(data.image_id);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!imageId) {
      setError('Please upload an image first.');
      return;
    }
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    const formData = new FormData();
    formData.append('image_id', imageId);
    formData.append('question', question);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Query failed.');
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer.');
      console.error('Query error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Medical VQA</h1>

      <div className="card">
        <h2>1. Upload Image</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleImageUpload} disabled={!imageFile || loading}>
          {loading && !imageId ? 'Uploading...' : 'Upload Image'}
        </button>
        {imagePreview && (
          <div className="image-preview">
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px' }} />
          </div>
        )}
        {imageId && <p className="success-message">Image uploaded! Image ID: {imageId}</p>}
      </div>

      <div className="card">
        <h2>2. Ask a Question</h2>
        <input
          type="text"
          placeholder="Enter your question about the image..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={!imageId || loading}
        />
        <button onClick={handleQuestionSubmit} disabled={!imageId || !question.trim() || loading}>
          {loading && imageId ? 'Getting Answer...' : 'Get Answer'}
        </button>
      </div>

      {error && <p className="error-message">Error: {error}</p>}

      {answer && (
        <div className="card answer-card">
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
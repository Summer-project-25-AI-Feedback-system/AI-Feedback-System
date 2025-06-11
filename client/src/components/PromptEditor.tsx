import React, { useState, useEffect } from 'react';
import './PromptEditor.css';

const PromptEditor = () => {
  // Alustetaan prompt-tila
  const [prompt, setPrompt] = useState<string>("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Ladataan prompt palvelimelta sivun latautuessa
  useEffect(() => {
    const loadPrompt = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/prompt');
        if (!response.ok) {
          throw new Error('Failed to load prompt');
        }
        const data = await response.text();
        setPrompt(data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Error loading prompt' });
      } finally {
        setLoading(false);
      }
    };
    loadPrompt();
  }, []);

  const handleSave = async () => {
    if (!prompt.trim()) {
      setMessage({ type: 'error', text: 'Prompt cannot be empty!' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        // Yritetään lukea palvelimen virheilmoitus
        let errorMsg = 'Failed to save prompt';
        try {
          const data = await response.json();
          if (data && data.error) errorMsg = data.error;
        } catch {}
        throw new Error(errorMsg);
      }

      setMessage({ type: 'success', text: 'Prompt saved successfully!' });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error?.message || 'Error saving prompt'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prompt-editor">
      <h2>Edit Evaluation Prompt</h2>
      {loading && <div>Loading...</div>}
      <textarea
        className="prompt-textarea"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />
      <button 
        className="save-button"
        onClick={handleSave}
        disabled={loading}
      >
        Save Prompt
      </button>
      {message && (
        <div className={`${message.type}-message`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PromptEditor;

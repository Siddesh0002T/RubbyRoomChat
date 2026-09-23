import React, { useState, useRef, useEffect } from 'react';
import { FaCode, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './SendCodeModal.css';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'json', name: 'JSON' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'sql', name: 'SQL' },
  { id: 'bash', name: 'Bash / Shell' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'text', name: 'Plain Text' }
];

const SendCodeModal = ({ isOpen, onClose, onSendCode }) => {
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const textareaRef = useRef(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } else {
      setCode('');
      setTitle('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Tab key in code textarea
  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
      return;
    }

    // Support Tab key indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 2 spaces
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);

      // Restore cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleSend = () => {
    if (!code.trim()) return;

    let formattedMessage = '';
    if (title.trim()) {
      formattedMessage += `**${title.trim()}**\n\n`;
    }
    formattedMessage += `\`\`\`${language}\n${code.trim()}\n\`\`\``;

    onSendCode(formattedMessage);
    onClose();
  };

  const lineCount = code ? code.split('\n').length : 1;

  return (
    <div className="code-modal-backdrop" onClick={onClose}>
      <div
        className="code-modal-window neo-brutalist-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="code-modal-title"
      >
        {/* Modal Header */}
        <div className="code-modal-header">
          <div className="code-modal-title-wrap">
            <div className="code-modal-icon-badge">
              <FaCode />
            </div>
            <div>
              <h2 id="code-modal-title" className="code-modal-title">Share Code Snippet</h2>
              <p className="code-modal-subtitle">Formatted with ChatGPT-style syntax highlighting & copy button</p>
            </div>
          </div>
          <button
            type="button"
            className="code-modal-close-btn"
            onClick={onClose}
            aria-label="Close code dialog"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Controls */}
        <div className="code-modal-controls">
          <div className="code-control-group">
            <label htmlFor="code-lang-select" className="code-control-label">
              Language:
            </label>
            <select
              id="code-lang-select"
              className="code-lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="code-control-group flex-1">
            <label htmlFor="code-title-input" className="code-control-label">
              Description / File name (optional):
            </label>
            <input
              id="code-title-input"
              type="text"
              className="code-title-input"
              placeholder="e.g. auth_middleware.js or React Navbar fix"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="code-editor-wrapper">
          <div className="code-editor-header">
            <span className="code-editor-lang-pill">{language}</span>
            <span className="code-editor-stats">
              {lineCount} {lineCount === 1 ? 'line' : 'lines'} • {code.length} chars
            </span>
          </div>
          <textarea
            ref={textareaRef}
            className="code-editor-textarea"
            placeholder={`// Paste or write your ${language} code here...\n// Press Tab to indent, Ctrl+Enter to send`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoCapitalize="none"
            autoComplete="off"
            rows={12}
          />
        </div>

        {/* Modal Footer */}
        <div className="code-modal-footer">
          <div className="code-modal-hint">
            Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to send
          </div>
          <div className="code-modal-actions">
            <button
              type="button"
              className="code-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="code-btn-send"
              onClick={handleSend}
              disabled={!code.trim()}
            >
              <FaPaperPlane /> Send Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendCodeModal;

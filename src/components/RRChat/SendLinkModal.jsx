import React, { useState, useRef, useEffect } from 'react';
import { FaLink, FaTimes, FaPaperPlane, FaExternalLinkAlt } from 'react-icons/fa';
import './SendLinkModal.css';

const SendLinkModal = ({ isOpen, onClose, onSendLink }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const urlInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        urlInputRef.current?.focus();
      }, 50);
    } else {
      setUrl('');
      setTitle('');
      setComment('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Normalize URL with https:// if omitted
  const cleanUrl = url.trim() ? (/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`) : '';

  let domain = '';
  try {
    if (cleanUrl) {
      const parsed = new URL(cleanUrl);
      domain = parsed.hostname.replace(/^www\./, '');
    }
  } catch {
    domain = '';
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!cleanUrl) return;

    const displayTitle = title.trim() || domain || cleanUrl;
    let messageText = '';

    if (comment.trim()) {
      messageText += `${comment.trim()}\n\n`;
    }

    messageText += `[${displayTitle}](${cleanUrl})`;

    onSendLink(messageText);
    onClose();
  };

  return (
    <div className="link-modal-backdrop" onClick={onClose}>
      <div
        className="link-modal-window neo-brutalist-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-modal-title"
      >
        {/* Modal Header */}
        <div className="link-modal-header">
          <div className="link-modal-title-wrap">
            <div className="link-modal-icon-badge">
              <FaLink />
            </div>
            <div>
              <h2 id="link-modal-title" className="link-modal-title">Share Link</h2>
              <p className="link-modal-subtitle">Formatted with live domain preview and one-click copy</p>
            </div>
          </div>
          <button
            type="button"
            className="link-modal-close-btn"
            onClick={onClose}
            aria-label="Close link dialog"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="link-modal-body">
          {/* URL Input */}
          <div className="link-input-group">
            <label htmlFor="link-url-input" className="link-input-label">
              Destination URL <span className="required">*</span>
            </label>
            <div className="link-input-wrapper">
              <FaLink className="link-field-icon" />
              <input
                ref={urlInputRef}
                id="link-url-input"
                type="text"
                className="link-text-input"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="link-input-group">
            <label htmlFor="link-title-input" className="link-input-label">
              Link Title / Display Name (Optional)
            </label>
            <input
              id="link-title-input"
              type="text"
              className="link-text-input plain"
              placeholder="e.g. GitHub Repository, Documentation, Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Comment / Context */}
          <div className="link-input-group">
            <label htmlFor="link-comment-input" className="link-input-label">
              Note or Message (Optional)
            </label>
            <input
              id="link-comment-input"
              type="text"
              className="link-text-input plain"
              placeholder="e.g. Check this out for reference!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Live Preview Card */}
          {cleanUrl && (
            <div className="link-preview-box">
              <div className="link-preview-label">Live Preview:</div>
              <div className="link-preview-render">
                <span className="md-rich-link-badge">
                  <span className="md-rich-link-anchor">
                    <FaLink className="md-rich-link-icon" />
                    <span className="md-rich-link-title">
                      {title.trim() || domain || cleanUrl}
                    </span>
                    {domain && <span className="md-rich-link-domain">{domain}</span>}
                    <FaExternalLinkAlt className="md-rich-link-ext" />
                  </span>
                  <span className="md-rich-link-copy-btn">
                    Copy
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="link-modal-footer">
          <div className="link-modal-hint">
            Tip: Press <kbd>Enter</kbd> to send
          </div>
          <div className="link-modal-actions">
            <button
              type="button"
              className="link-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="link-btn-send"
              onClick={handleSend}
              disabled={!cleanUrl}
            >
              <FaPaperPlane /> Send Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendLinkModal;

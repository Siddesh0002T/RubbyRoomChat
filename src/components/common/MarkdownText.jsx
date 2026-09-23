import React, { useState } from 'react';
import { FaCopy, FaCheck, FaTerminal, FaLink, FaExternalLinkAlt } from 'react-icons/fa';
import './MarkdownText.css';

// Syntax highlighting tokenizer for code blocks
const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'import', 'export', 'from', 'default', 'as', 'class', 'extends', 'super', 'this',
  'new', 'typeof', 'instanceof', 'void', 'delete', 'switch', 'case', 'break', 'continue',
  'try', 'catch', 'finally', 'throw', 'async', 'await', 'yield',
  'def', 'elif', 'lambda', 'with', 'pass', 'raise', 'except', 'self',
  'public', 'private', 'protected', 'static', 'final', 'interface', 'implements',
  'package', 'func', 'type', 'struct', 'chan', 'go', 'select', 'defer',
  'fn', 'mut', 'pub', 'impl', 'trait', 'match',
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'GROUP', 'BY', 'ORDER', 'HAVING'
]);

const BOOLEANS_NULL = new Set([
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
  'True', 'False', 'None', 'nil'
]);

/**
 * Universal clipboard copy helper with fallback for all environments.
 */
function copyTextToClipboard(text, onSuccess) {
  const fallback = () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful && onSuccess) onSuccess();
    } catch (err) {
      console.warn('Fallback copy failed:', err);
      if (onSuccess) onSuccess();
    }
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch(() => {
        fallback();
      });
  } else {
    fallback();
  }
}

/**
 * Extract clean domain name from URL.
 */
function getDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Rich Link Component with clean card badge, domain chip, external icon, and Copy Link button.
 */
const RichLink = ({ href, label }) => {
  const [copied, setCopied] = useState(false);
  const domain = getDomain(href);
  const displayLabel = label || domain || href;

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    copyTextToClipboard(href, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <span className="md-rich-link-badge">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="md-rich-link-anchor"
        title={`Open link: ${href}`}
      >
        <FaLink className="md-rich-link-icon" />
        <span className="md-rich-link-title">{displayLabel}</span>
        {domain && <span className="md-rich-link-domain">{domain}</span>}
        <FaExternalLinkAlt className="md-rich-link-ext" />
      </a>
      <button
        type="button"
        className={`md-rich-link-copy-btn ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        title="Copy link to clipboard"
      >
        {copied ? (
          <>
            <FaCheck className="copy-icon" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <FaCopy className="copy-icon" />
            <span>Copy</span>
          </>
        )}
      </button>
    </span>
  );
};

/**
 * Tokenize a single line of code into colored JSX spans.
 */
function tokenizeLine(line) {
  if (!line) {
    return [<span key="empty">&nbsp;</span>];
  }

  // Regex to match:
  // 1: Comments (//, #, /* */)
  // 2: Strings ("...", '...', `...`)
  // 3: HTML / JSX tags (<tag>, </tag>)
  // 4: Numbers (integer, float, hex)
  // 5: Words / Identifiers (keywords, booleans, functions, variables)
  // 6: Operators / Punctuation
  const tokenRegex = /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[\w.-]+(?:\s+[^>]*?)?>)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)|([{}()[\].,;:+\-*/%&|^!=<>?~])/g;

  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(line)) !== null) {
    // Normal text before token
    if (match.index > lastIndex) {
      elements.push(line.substring(lastIndex, match.index));
    }

    const [, comment, str, tag, num, word, op] = match;

    if (comment) {
      elements.push(<span key={match.index} className="tok-comment">{comment}</span>);
    } else if (str) {
      elements.push(<span key={match.index} className="tok-string">{str}</span>);
    } else if (tag) {
      elements.push(<span key={match.index} className="tok-tag">{tag}</span>);
    } else if (num) {
      elements.push(<span key={match.index} className="tok-number">{num}</span>);
    } else if (word) {
      if (KEYWORDS.has(word) || KEYWORDS.has(word.toUpperCase())) {
        elements.push(<span key={match.index} className="tok-keyword">{word}</span>);
      } else if (BOOLEANS_NULL.has(word)) {
        elements.push(<span key={match.index} className="tok-boolean">{word}</span>);
      } else {
        // Check if immediately followed by '(' indicating a function call
        const remainder = line.slice(match.index + word.length);
        if (/^\s*\(/.test(remainder)) {
          elements.push(<span key={match.index} className="tok-function">{word}</span>);
        } else {
          elements.push(<span key={match.index} className="tok-ident">{word}</span>);
        }
      }
    } else if (op) {
      elements.push(<span key={match.index} className="tok-operator">{op}</span>);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(line.substring(lastIndex));
  }

  return elements.length > 0 ? elements : line;
}

/**
 * Lightweight, safe Markdown & Code renderer with syntax boxes and copy button.
 */
const MarkdownText = ({ text }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!text) return null;

  const copyCodeSnippet = (codeString, index) => {
    copyTextToClipboard(codeString, () => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  // Helper to parse inline markdown (bold, italic, strike, inline code, links)
  const parseInline = (line) => {
    const parts = [];
    // 1: `code`
    // 3: **bold**
    // 5: *italic*
    // 7: ~~strike~~
    // 9: [label](url) -> label = match[10], url = match[11]
    // 12: raw url -> url = match[13]
    const inlineRegex = /(`([^`]+)`)|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(~~([^~]+)~~)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|((https?:\/\/[^\s<]+))/g;
    let lastIndex = 0;
    let match;

    while ((match = inlineRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // `code`
        parts.push(
          <code key={match.index} className="md-inline-code">
            {match[2]}
          </code>
        );
      } else if (match[3]) {
        // **bold**
        parts.push(<strong key={match.index}>{match[4]}</strong>);
      } else if (match[5]) {
        // *italic*
        parts.push(<em key={match.index}>{match[6]}</em>);
      } else if (match[7]) {
        // ~~strike~~
        parts.push(<del key={match.index}>{match[8]}</del>);
      } else if (match[9]) {
        // Markdown Link: [label](url)
        parts.push(
          <RichLink
            key={match.index}
            href={match[11]}
            label={match[10]}
          />
        );
      } else if (match[12]) {
        // Raw URL link
        parts.push(
          <RichLink
            key={match.index}
            href={match[13]}
            label=""
          />
        );
      }

      lastIndex = inlineRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts.length > 0 ? parts : line;
  };

  // Split by code blocks ```lang ... ``` (supports CRLF and LF)
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)[ \t]*\r?\n([\s\S]*?)\r?\n?[ \t]*```/g;
  const elements = [];
  let lastIdx = 0;
  let blockMatch;
  let blockCount = 0;

  while ((blockMatch = codeBlockRegex.exec(text)) !== null) {
    // Normal text before code block
    if (blockMatch.index > lastIdx) {
      const normalText = text.substring(lastIdx, blockMatch.index);
      elements.push(
        <div key={`text-${lastIdx}`} className="md-text-block">
          {renderTextLines(normalText)}
        </div>
      );
    }

    // Code block itself
    const lang = blockMatch[1] ? blockMatch[1].trim() : 'code';
    const codeContent = blockMatch[2].replace(/\n$/, '');
    const currentBlockIdx = blockCount++;
    const isCopied = copiedIndex === currentBlockIdx;

    // Render code line by line with syntax highlighting and line numbers
    const rawLines = codeContent.split('\n');
    const showLineNumbers = rawLines.length > 1;

    elements.push(
      <div key={`code-${blockMatch.index}`} className="code-terminal-card">
        {/* Terminal Header */}
        <div className="code-terminal-header">
          <div className="code-terminal-lang">
            <FaTerminal className="code-terminal-lang-icon" />
            <span>{lang.toLowerCase()}</span>
          </div>
          <button
            type="button"
            className={`code-terminal-copy-btn ${isCopied ? 'copied' : ''}`}
            onClick={() => copyCodeSnippet(codeContent, currentBlockIdx)}
            title="Copy code to clipboard"
          >
            {isCopied ? (
              <>
                <FaCheck className="copy-icon" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FaCopy className="copy-icon" />
                <span>Copy code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block with Syntax Colors & Line Numbers */}
        <div className="code-terminal-body">
          <pre className="code-terminal-pre">
            <code>
              {rawLines.map((lineStr, lineIdx) => (
                <div key={lineIdx} className="code-terminal-line">
                  {showLineNumbers && (
                    <span className="code-terminal-line-num">{lineIdx + 1}</span>
                  )}
                  <span className="code-terminal-line-tokens">
                    {tokenizeLine(lineStr)}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    );

    lastIdx = codeBlockRegex.lastIndex;
  }

  // Trailing content
  if (lastIdx < text.length) {
    const trailingText = text.substring(lastIdx);
    elements.push(
      <div key={`text-${lastIdx}`} className="md-text-block">
        {renderTextLines(trailingText)}
      </div>
    );
  }

  function renderTextLines(rawBlock) {
    const lines = rawBlock.split('\n');
    return lines.map((line, idx) => {
      // Check blockquote >
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="md-blockquote">
            {parseInline(line.substring(2))}
          </blockquote>
        );
      }
      // Check bullet list - or *
      if (line.match(/^(\*|-)\s+/)) {
        return (
          <div key={idx} className="md-list-item">
            <span className="md-bullet">•</span>
            <span>{parseInline(line.replace(/^(\*|-)\s+/, ''))}</span>
          </div>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="md-spacer" />;
      }
      // Regular line
      return <div key={idx}>{parseInline(line)}</div>;
    });
  }

  return <div className="md-rendered-content">{elements}</div>;
};

export default MarkdownText;

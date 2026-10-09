import React from 'react';
import DOMPurify from 'dompurify';

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  // Sanitize content against XSS attacks
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr',
      'th', 'td', 'br', 'hr', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'width', 'height', 'style'],
  });

  return (
    <div 
      className={`prose-arabic ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

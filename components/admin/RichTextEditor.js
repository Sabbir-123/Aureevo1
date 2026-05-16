'use client';

import { useRef } from 'react';
import { Bold, Italic, List, Heading3, Link as LinkIcon, Pilcrow } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
    const textareaRef = useRef(null);

    const insertTag = (startTag, endTag) => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        
        const newText = value.substring(0, start) + startTag + selectedText + endTag + value.substring(end);
        onChange(newText);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + startTag.length, start + startTag.length + selectedText.length);
        }, 0);
    };

    return (
        <div style={{ border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius)', overflow: 'hidden', background: 'var(--admin-bg)' }}>
            <div style={{ display: 'flex', gap: '4px', padding: '8px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-surface)' }}>
                <button type="button" onClick={() => insertTag('<strong>', '</strong>')} title="Bold" style={toolbarBtnStyle}>
                    <Bold size={16} />
                </button>
                <button type="button" onClick={() => insertTag('<em>', '</em>')} title="Italic" style={toolbarBtnStyle}>
                    <Italic size={16} />
                </button>
                <button type="button" onClick={() => insertTag('<h3>', '</h3>')} title="Heading 3" style={toolbarBtnStyle}>
                    <Heading3 size={16} />
                </button>
                <button type="button" onClick={() => insertTag('<p>', '</p>')} title="Paragraph" style={toolbarBtnStyle}>
                    <Pilcrow size={16} />
                </button>
                <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} title="Bullet List" style={toolbarBtnStyle}>
                    <List size={16} />
                </button>
                <button type="button" onClick={() => insertTag('<a href="#">', '</a>')} title="Link" style={toolbarBtnStyle}>
                    <LinkIcon size={16} />
                </button>
            </div>
            <textarea
                ref={textareaRef}
                className="formInput"
                style={{ border: 'none', borderRadius: 0, minHeight: '150px' }}
                placeholder={placeholder || 'Write description here... Use HTML for formatting.'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

const toolbarBtnStyle = {
    padding: '6px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--admin-text)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

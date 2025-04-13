import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import type { Quill as QuillType } from 'quill';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillType | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const initQuill = async () => {
        const Quill = (await import('quill')).default;
        const options = {
          theme: 'snow',
          placeholder: placeholder,
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['blockquote', 'code-block'],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ]
          }
        };

        const quill = new Quill(editorRef.current, options);
        quillRef.current = quill;

        // Set initial content
        if (value) {
          quill.root.innerHTML = value;
        }

        // Use MutationObserver for content changes
        observerRef.current = new MutationObserver(() => {
          const content = quill.root.innerHTML;
          if (content !== value) {
            onChange(content);
          }
        });

        observerRef.current.observe(quill.root, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: false
        });

        // Handle text changes directly
        quill.on('text-change', () => {
          const content = quill.root.innerHTML;
          if (content !== value) {
            onChange(content);
          }
        });
      };

      initQuill();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (quillRef.current) {
        quillRef.current.off('text-change');
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="quill-editor">
      <div ref={editorRef} />
    </div>
  );
};

// Use dynamic import for the component to avoid SSR issues
export default dynamic(() => Promise.resolve(QuillEditor), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />
}); 
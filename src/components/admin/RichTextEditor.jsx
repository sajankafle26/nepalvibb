"use client";

import { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { 
  Bold, Italic, List, ListOrdered, 
  Heading1, Heading2, Quote, Undo, Redo,
  Image as ImageIcon, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MenuButton = ({ onClick, isActive, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "p-2 rounded-lg transition-all",
      isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-gray-100 hover:text-primary"
    )}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image is too large. Max size is 10MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server returned status ${res.status}`);
      }

      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        throw new Error("Failed to get uploaded file URL.");
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[150px] p-6 text-sm text-gray-600 leading-relaxed font-medium',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">{label}</label>}
      
      <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] overflow-hidden focus-within:border-primary transition-all shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-50 bg-gray-50/50">
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic className="w-4 h-4" />
          </MenuButton>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 className="w-4 h-4" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <MenuButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <Quote className="w-4 h-4" />
          </MenuButton>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          
          <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <MenuButton 
            onClick={() => fileInputRef.current?.click()} 
            isActive={false}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          </MenuButton>
          <div className="flex-1" />
          <MenuButton onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

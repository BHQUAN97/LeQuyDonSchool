'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/** Nut toolbar don le */
function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded-md transition-colors disabled:opacity-40',
        active
          ? 'bg-slate-200 text-slate-900'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      {children}
    </button>
  );
}

/** Duong ke ngan cach nhom toolbar */
function ToolbarDivider() {
  return <div className="w-px h-6 bg-slate-200 mx-0.5" />;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Nhập nội dung...',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' },
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base max-w-none min-h-[300px] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Dong bo content tu ngoai vao (vi du khi load data tu API)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
    // Chi chay khi content prop thay doi tu ngoai
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  /** Them/xoa link */
  const handleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = prompt('Nhập URL liên kết:');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  /** Chen hinh anh */
  const handleImage = () => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const iconSize = 18;

  return (
    <div className="rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-green-600 focus-within:border-transparent">
      {/* Toolbar — sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-2 py-1.5 flex flex-wrap gap-0.5 items-center">
        {/* Inline formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="In đậm"
        >
          <Bold size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="In nghiêng"
        >
          <Italic size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Gạch chân"
        >
          <UnderlineIcon size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Gạch ngang"
        >
          <Strikethrough size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          active={editor.isActive('heading', { level: 4 })}
          title="Heading 4"
        >
          <Heading4 size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Danh sách"
        >
          <List size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Danh sách đánh số"
        >
          <ListOrdered size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Trích dẫn"
        >
          <Quote size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Khối mã"
        >
          <Code2 size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link & Image */}
        <ToolbarButton
          onClick={handleLink}
          active={editor.isActive('link')}
          title="Liên kết"
        >
          <LinkIcon size={iconSize} />
        </ToolbarButton>
        <ToolbarButton onClick={handleImage} title="Chèn hình ảnh">
          <ImageIcon size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text align */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Căn trái"
        >
          <AlignLeft size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Căn giữa"
        >
          <AlignCenter size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Căn phải"
        >
          <AlignRight size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Hoàn tác"
        >
          <Undo2 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Làm lại"
        >
          <Redo2 size={iconSize} />
        </ToolbarButton>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}

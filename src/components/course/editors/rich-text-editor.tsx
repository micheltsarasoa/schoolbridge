'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorToolbar } from './editor-toolbar';
import { useEffect } from 'react';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  initialContent: string;
  onUpdate: (html: string, text: string) => void;
}

export function RichTextEditor({ initialContent, onUpdate }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'article-image rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'bg-muted rounded-md p-4 font-mono text-sm',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-4 border rounded-md',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onUpdate(html, text);
    },
  });

  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  return (
    <Tabs defaultValue="editor" className="w-full">
      <TabsList>
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="source">Source Code</TabsTrigger>
      </TabsList>

      <TabsContent value="editor" className="space-y-2">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </TabsContent>

      <TabsContent value="preview">
        <div 
          className="prose prose-sm sm:prose lg:prose-lg max-w-none p-4 border rounded-md min-h-[400px]"
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      </TabsContent>

      <TabsContent value="source">
        <pre className="p-4 border rounded-md min-h-[400px] overflow-auto bg-muted text-xs font-mono">
          {editor.getHTML()}
        </pre>
      </TabsContent>
    </Tabs>
  );
}

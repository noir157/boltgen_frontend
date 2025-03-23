import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import CharacterCount from '@tiptap/extension-character-count';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Typography from '@tiptap/extension-typography';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Search,
  Save,
  FileText,
  Download,
  Settings,
  Moon,
  Sun,
  Languages,
  Share,
  GitBranch,
  MessageSquare,
  Users,
  Type,
  Palette,
  X,
  Plus,
  Check,
  Copy,
  Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

interface Tab {
  id: string;
  title: string;
  isActive: boolean;
}

export const TextEditor: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('documents');
    return saved ? JSON.parse(saved) : [];
  });

  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Inter');
  const { t, i18n } = useTranslation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Image,
      Link,
      Table,
      CharacterCount,
      TextStyle,
      Color,
      Typography,
    ],
    content: '',
    autofocus: true,
    onUpdate: ({ editor }) => {
      if (activeDocument && autoSave) {
        handleSave(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const handleNewDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: `Novo Documento ${documents.length + 1}`,
      content: '',
      lastModified: new Date(),
    };
    setDocuments([...documents, newDoc]);
    setActiveDocument(newDoc);
    setTabs([...tabs, { id: newDoc.id, title: newDoc.title, isActive: true }]);
    editor?.commands.setContent('');
  };

  const handleSave = (content: string) => {
    if (!activeDocument) return;

    const updatedDoc = {
      ...activeDocument,
      content,
      lastModified: new Date(),
    };

    setDocuments(documents.map(doc =>
      doc.id === activeDocument.id ? updatedDoc : doc
    ));
    setActiveDocument(updatedDoc);
  };

  const handleExport = async (format: 'pdf' | 'doc' | 'txt') => {
    if (!activeDocument) return;

    switch (format) {
      case 'pdf':
        const element = document.querySelector('.ProseMirror');
        if (!element) return;

        const canvas = await html2canvas(element as HTMLElement);
        const pdf = new jsPDF();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
        pdf.save(`${activeDocument.title}.pdf`);
        break;

      case 'doc':
        const docContent = editor?.getHTML() || '';
        const blob = new Blob([docContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${activeDocument.title}.doc`;
        link.click();
        break;

      case 'txt':
        const txtContent = editor?.getText() || '';
        const txtBlob = new Blob([txtContent], { type: 'text/plain' });
        const txtUrl = URL.createObjectURL(txtBlob);
        const txtLink = document.createElement('a');
        txtLink.href = txtUrl;
        txtLink.download = `${activeDocument.title}.txt`;
        txtLink.click();
        break;
    }
  };

  const handleSearch = useCallback(() => {
    if (!searchQuery || !editor) return;

    const text = editor.getText();
    const regex = new RegExp(searchQuery, 'gi');
    let match;
    const matches = [];

    while ((match = regex.exec(text)) !== null) {
      matches.push(match.index);
    }

    // Highlight matches
    editor.commands.unsetAllMarks();
    matches.forEach(index => {
      editor.commands.setTextSelection({ from: index, to: index + searchQuery.length });
      editor.commands.setMark('highlight');
    });
  }, [searchQuery, editor]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const toolbarButtons = [
    { icon: <Bold size={18} />, action: () => editor?.chain().focus().toggleBold().run(), isActive: () => editor?.isActive('bold') },
    { icon: <Italic size={18} />, action: () => editor?.chain().focus().toggleItalic().run(), isActive: () => editor?.isActive('italic') },
    { icon: <UnderlineIcon size={18} />, action: () => editor?.chain().focus().toggleUnderline().run(), isActive: () => editor?.isActive('underline') },
    { type: 'separator' },
    { icon: <AlignLeft size={18} />, action: () => editor?.chain().focus().setTextAlign('left').run(), isActive: () => editor?.isActive({ textAlign: 'left' }) },
    { icon: <AlignCenter size={18} />, action: () => editor?.chain().focus().setTextAlign('center').run(), isActive: () => editor?.isActive({ textAlign: 'center' }) },
    { icon: <AlignRight size={18} />, action: () => editor?.chain().focus().setTextAlign('right').run(), isActive: () => editor?.isActive({ textAlign: 'right' }) },
    { icon: <AlignJustify size={18} />, action: () => editor?.chain().focus().setTextAlign('justify').run(), isActive: () => editor?.isActive({ textAlign: 'justify' }) },
    { type: 'separator' },
    { icon: <List size={18} />, action: () => editor?.chain().focus().toggleBulletList().run(), isActive: () => editor?.isActive('bulletList') },
    { icon: <ListOrdered size={18} />, action: () => editor?.chain().focus().toggleOrderedList().run(), isActive: () => editor?.isActive('orderedList') },
    { type: 'separator' },
    { icon: <ImageIcon size={18} />, action: () => {
      const url = window.prompt('URL da imagem:');
      if (url) editor?.chain().focus().setImage({ src: url }).run();
    }},
    { icon: <LinkIcon size={18} />, action: () => {
      const url = window.prompt('URL do link:');
      if (url) editor?.chain().focus().setLink({ href: url }).run();
    }},
    { icon: <TableIcon size={18} />, action: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run() },
  ];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Main Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewDocument}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>{t('newDocument')}</span>
            </button>

            <button
              onClick={() => handleSave(editor?.getHTML() || '')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Save size={18} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Search size={18} />
              </button>
              
              {showSearch && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={t('search')}
                    className="w-full px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded"
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Settings size={18} />
              </button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>{t('darkMode')}</span>
                        <button
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm">{t('fontSize')}</label>
                        <input
                          type="range"
                          min="12"
                          max="24"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm">{t('fontFamily')}</label>
                        <select
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>{t('autoSave')}</span>
                        <button
                          onClick={() => setAutoSave(!autoSave)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            autoSave ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              autoSave ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Download size={18} />
            </button>

            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Languages size={18} />
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center space-x-1 p-2 border-t border-gray-200 dark:border-gray-700">
          {toolbarButtons.map((button, index) => 
            button.type === 'separator' ? (
              <div key={index} className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            ) : (
              <button
                key={index}
                onClick={button.action}
                className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  button.isActive?.() ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
              >
                {button.icon}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg cursor-pointer ${
              tab.isActive
                ? 'bg-white dark:bg-gray-800 shadow-sm'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => {
              const doc = documents.find(d => d.id === tab.id);
              if (doc) {
                setActiveDocument(doc);
                editor?.commands.setContent(doc.content);
                setTabs(tabs.map(t => ({ ...t, isActive: t.id === tab.id })));
              }
            }}
          >
            <FileText size={14} />
            <span className="text-sm">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTabs(tabs.filter(t => t.id !== tab.id));
                setDocuments(documents.filter(d => d.id !== tab.id));
                if (tab.isActive && tabs.length > 1) {
                  const newActiveTab = tabs[tabs.indexOf(tab) - 1] || tabs[tabs.indexOf(tab) + 1];
                  const newActiveDoc = documents.find(d => d.id === newActiveTab.id);
                  if (newActiveDoc) {
                    setActiveDocument(newActiveDoc);
                    editor?.commands.setContent(newActiveDoc.content);
                    setTabs(tabs.map(t => ({ ...t, isActive: t.id === newActiveTab.id })));
                  }
                }
              }}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 p-4">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <div>
          {editor && (
            <>
              <span>{editor.storage.characterCount.characters()} {t('characters')}</span>
              <span className="mx-2">•</span>
              <span>{editor.storage.characterCount.words()} {t('words')}</span>
            </>
          )}
        </div>
        <div>
          {activeDocument && (
            <span>
              {t('lastModified')}: {new Date(activeDocument.lastModified).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-1"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            <Bold size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            <Italic size={14} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
              editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600' : ''
            }`}
          >
            <UnderlineIcon size={14} />
          </button>
        </BubbleMenu>
      )}
    </div>
  );
};
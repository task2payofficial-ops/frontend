'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Video,
  Code,
  Eye,
  Undo,
  Redo,
  Upload,
  Loader2,
  X,
  Check
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Image Modal States
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Link Modal States
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  // Video Modal States
  const [videoUrl, setVideoUrl] = useState('');

  // Keep editor content in sync when value changes from outside (e.g. AI or initialData)
  useEffect(() => {
    if (editorRef.current && !isCodeView) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isCodeView]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  // Format block (Paragraph, H2, H3, H4)
  const formatBlock = (tag: string) => {
    document.execCommand('formatBlock', false, `<${tag}>`);
    handleInput();
  };

  // Image Upload Handler
  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल इमेज फ़ाइल (JPG, PNG, WEBP) चुनें।');
      return;
    }

    setIsUploadingImage(true);
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', file);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const uploadUrl = apiBase
      ? `${apiBase.replace(/\/$/, '')}/api/v1/admin/articles/upload-image`
      : '/api/v1/admin/articles/upload-image';

    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        let finalUrl = data.url;
        if (finalUrl.includes('://apnabikaner.com/') && !finalUrl.includes('://api.apnabikaner.com/')) {
          finalUrl = finalUrl.replace('://apnabikaner.com/', '://api.apnabikaner.com/');
        }
        if (apiBase && (finalUrl.includes('localhost') || finalUrl.includes('127.0.0.1'))) {
          finalUrl = finalUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, apiBase.replace(/\/$/, ''));
        }
        setImageUrl(finalUrl);
      } else {
        alert(data.message || 'फोटो अपलोड करने में त्रुटि आई।');
      }
    } catch {
      alert('सर्वर से कनेक्ट नहीं हो सका।');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Insert Image into content
  const insertImage = () => {
    if (!imageUrl) {
      alert('कृपया इमेज यूआरएल दर्ज करें या फोटो अपलोड करें।');
      return;
    }

    const figureHtml = `
      <figure class="my-6 text-center">
        <img src="${imageUrl}" alt="${imageCaption || 'समाचार चित्र'}" class="rounded-xl max-w-full mx-auto shadow-xs border border-slate-200" />
        ${imageCaption ? `<figcaption class="text-xs text-slate-500 italic mt-2">${imageCaption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;

    if (isCodeView) {
      onChange(value + '\n' + figureHtml);
    } else {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, figureHtml);
      handleInput();
    }

    // Reset modal
    setImageUrl('');
    setImageCaption('');
    setShowImageModal(false);
  };

  // Insert Link
  const insertLink = () => {
    if (!linkUrl) {
      alert('कृपया यूआरएल दर्ज करें।');
      return;
    }

    const formattedUrl = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    const textToDisplay = linkText || formattedUrl;
    const targetAttr = openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
    const linkHtml = `<a href="${formattedUrl}" ${targetAttr} class="text-red-600 underline font-medium hover:text-red-800">${textToDisplay}</a>`;

    if (isCodeView) {
      onChange(value + ' ' + linkHtml);
    } else {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, linkHtml);
      handleInput();
    }

    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  // Insert YouTube Video
  const insertVideo = () => {
    if (!videoUrl) return;

    let embedUrl = videoUrl;
    const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const videoHtml = `
      <div class="my-6 aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden shadow-xs border border-slate-200">
        <iframe src="${embedUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p><br></p>
    `;

    if (isCodeView) {
      onChange(value + '\n' + videoHtml);
    } else {
      editorRef.current?.focus();
      document.execCommand('insertHTML', false, videoHtml);
      handleInput();
    }

    setVideoUrl('');
    setShowVideoModal(false);
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 transition-all">
      {/* 1. WORDPRESS STYLE TOP TOOLBAR */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700">
        {/* Headings */}
        <button
          type="button"
          onClick={() => formatBlock('p')}
          title="सामान्य पैराग्राफ"
          className="px-2 py-1 text-xs font-bold hover:bg-slate-200 rounded-md transition-colors"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => formatBlock('h2')}
          title="बड़ा शीर्षक (H2)"
          className="px-2 py-1 text-xs font-bold hover:bg-slate-200 rounded-md transition-colors"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatBlock('h3')}
          title="उप शीर्षक (H3)"
          className="px-2 py-1 text-xs font-bold hover:bg-slate-200 rounded-md transition-colors"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatBlock('h4')}
          title="छोटा शीर्षक (H4)"
          className="px-2 py-1 text-xs font-bold hover:bg-slate-200 rounded-md transition-colors"
        >
          H4
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Text Formats */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          title="बोल्ड (Ctrl+B)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          title="इटैलिक (Ctrl+I)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          title="अंडरलाइन (Ctrl+U)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          title="स्ट्राइकथ्रू"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Quotes & Lists */}
        <button
          type="button"
          onClick={() => formatBlock('blockquote')}
          title="उद्धरण (Quote)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          title="बिंदुवार सूची (Bullet List)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          title="क्रमवार सूची (Numbered List)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          title="बाएं संरेखित करें"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          title="मध्य में संरेखित करें"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          title="दाएं संरेखित करें"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyFull')}
          title="जस्टिफाई"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

        {/* Media Inserters: Image, Link, Video */}
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          title="लेख के बीच में फ़ोटो जोड़ें (Insert Image)"
          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-semibold text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ImageIcon className="w-3.5 h-3.5 text-red-600" />
          <span>+ फ़ोटो जोड़ें</span>
        </button>

        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          title="वेब लिंक जोड़ें (Insert Link)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('unlink')}
          title="लिंक हटाएं (Unlink)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-500"
        >
          <Unlink className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowVideoModal(true)}
          title="YouTube वीडियो जोड़ें"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Video className="w-4 h-4 text-slate-700" />
        </button>

        <div className="grow" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => executeCommand('undo')}
          title="पूर्ववत करें (Undo)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('redo')}
          title="दोहराएं (Redo)"
          className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
        >
          <Redo className="w-4 h-4" />
        </button>

        {/* Code / Visual Mode Switch */}
        <button
          type="button"
          onClick={() => setIsCodeView(!isCodeView)}
          title={isCodeView ? 'विज़ुअल एडिटर देखें' : 'HTML कोड देखें'}
          className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            isCodeView ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
          }`}
        >
          {isCodeView ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
          <span>{isCodeView ? 'विज़ुअल मोड (Visual)' : 'HTML कोड (HTML)'}</span>
        </button>
      </div>

      {/* 2. EDITOR BODY */}
      {isCodeView ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          placeholder="<p>यहाँ HTML कोड लिखें या पेस्ट करें...</p>"
          className="w-full text-xs font-mono p-4 bg-slate-950 text-emerald-400 focus:outline-none leading-relaxed"
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          className="min-h-[320px] max-h-[600px] overflow-y-auto p-5 focus:outline-none text-slate-800 text-sm leading-relaxed prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      )}

      {/* 3. MODAL: INSERT IMAGE IN CONTENT */}
      {showImageModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-600" />
                <span>समाचार के बीच में फ़ोटो जोड़ें (Insert Image)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs: File Upload vs URL */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  imageTab === 'upload' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                फ़ोटो अपलोड करें
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  imageTab === 'url' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                इमेज लिंक (URL)
              </button>
            </div>

            {imageTab === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadFile(f);
                  }}
                />
                <div
                  onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-white transition-all"
                >
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center py-2 text-red-600">
                      <Loader2 className="w-6 h-6 animate-spin mb-2" />
                      <p className="text-xs font-bold">फोटो अपलोड हो रही है...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-2">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-700">फोटो चुनने के लिए क्लिक करें</p>
                      <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, WEBP (10MB तक)</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">इमेज वेब यूआरएल</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            {/* Preview if uploaded */}
            {imageUrl && (
              <div className="aspect-16/10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                चित्र कैप्शन / क्रेडिट (वैकल्पिक)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="उदा. सभा को संबोधित करते हुए (फोटो: संवाद सूत्र)"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={insertImage}
                disabled={!imageUrl || isUploadingImage}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
              >
                आर्टिकल में जोड़ें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: INSERT LINK */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-red-600" />
                <span>वेब लिंक जोड़ें (Insert Link)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">वेबसाइट URL *</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com/..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">दिखाई देने वाला टेक्स्ट (वैकल्पिक)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="यहाँ क्लिक करें..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={openInNewTab}
                onChange={(e) => setOpenInNewTab(e.target.checked)}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span>नए टैब में खोलें (Open in new tab)</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
              >
                लिंक लगाएं
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: INSERT YOUTUBE VIDEO */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-red-600" />
                <span>YouTube वीडियो एम्बेड करें</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube वीडियो लिंक</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={insertVideo}
                disabled={!videoUrl}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg disabled:opacity-50"
              >
                वीडियो जोड़ें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


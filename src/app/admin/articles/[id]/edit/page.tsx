'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';

export default function EditArticlePage() {
  const params = useParams();
  const id = params?.id;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`/api/v1/admin/articles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400 text-xs font-semibold">लोड हो रहा है...</div>;
  }

  if (!article) {
    return <div className="py-20 text-center text-red-600 text-sm font-bold">समाचार नहीं मिला।</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ArticleEditorForm initialData={article} isEdit={true} />
    </div>
  );
}


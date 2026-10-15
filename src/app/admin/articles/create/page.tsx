'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';

export default function CreateArticlePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === 'user') {
          router.replace('/admin/polls');
          return;
        }
      }
      setAuthorized(true);
    } catch {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ArticleEditorForm isEdit={false} />
    </div>
  );
}

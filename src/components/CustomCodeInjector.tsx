'use client';

import React, { useEffect } from 'react';

interface CustomCodeInjectorProps {
  headerCode?: string;
  footerCode?: string;
  customCss?: string;
  googleAnalyticsId?: string;
  adsenseClientId?: string;
}

export default function CustomCodeInjector({
  headerCode,
  footerCode,
  customCss,
  googleAnalyticsId,
  adsenseClientId,
}: CustomCodeInjectorProps) {

  // Helper to inject HTML string into target element safely executing scripts
  useEffect(() => {
    // 1. Inject Custom CSS
    if (customCss && customCss.trim()) {
      const existingCss = document.getElementById('newsportal-custom-css');
      if (!existingCss) {
        const style = document.createElement('style');
        style.id = 'newsportal-custom-css';
        style.innerHTML = customCss;
        document.head.appendChild(style);
      }
    }

    // 2. Inject Header Code into <head>
    if (headerCode && headerCode.trim()) {
      injectHtml(headerCode, document.head, 'data-portal-header-script');
    }

    // 3. Inject Footer Code into <body>
    if (footerCode && footerCode.trim()) {
      injectHtml(footerCode, document.body, 'data-portal-footer-script');
    }
  }, [headerCode, footerCode, customCss]);

  const injectHtml = (htmlString: string, targetEl: HTMLElement, identifierAttr: string) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;

      // Extract all script tags and execute them properly
      const scripts = tempDiv.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.setAttribute(identifierAttr, 'true');
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        targetEl.appendChild(newScript);
        oldScript.remove();
      });

      // Append remaining elements (meta, link, style, noscript, etc.)
      while (tempDiv.firstChild) {
        const child = tempDiv.firstChild as HTMLElement;
        if (child.setAttribute) {
          child.setAttribute(identifierAttr, 'true');
        }
        targetEl.appendChild(child);
      }
    } catch (e) {
      console.warn('Failed executing custom injected code:', e);
    }
  };

  return (
    <>
      {/* Official Google Analytics (GA4) Shortcut */}
      {googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Official Google AdSense Shortcut */}
      {adsenseClientId && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}


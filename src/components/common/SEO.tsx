import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'الموقع الرسمي لجمعية أطباء الأسرة العراقية (IFPS) - المظلة المهنية والعلمية لأطباء الأسرة في العراق، شريككم الدائم نحو صحة أفضل.',
  keywords = 'جمعية أطباء الأسرة العراقية, طب الأسرة, العراق, IFPS, WONCA, الرعاية الصحية الأولية, البورد العراقي, البورد العربي',
  image = 'https://iraqifps.org/wp-content/uploads/2025/11/%D8%A8%D8%AF%D9%88%D9%86-%D8%AE%D9%84%D9%81%D9%8A%D8%A9-1024x284.png',
  url,
  type = 'website',
  schema,
}) => {
  const fullTitle = title 
    ? `${title} | جمعية أطباء الأسرة العراقية (IFPS)` 
    : 'جمعية أطباء الأسرة العراقية | Iraqi Family Physicians Society';

  useEffect(() => {
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:type', type, true);
    if (url) updateMeta('og:url', url, true);

    // Schema.org JSON-LD
    let scriptTag = document.querySelector('script[data-schema="ifps"]');
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        scriptTag.setAttribute('data-schema', 'ifps');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, description, keywords, image, url, type, schema]);

  return null;
};

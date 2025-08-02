import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEO = ({ 
  title = "САЙТ ЖЕЛАНИЙ - Загадайте желание онлайн и поверьте в его исполнение",
  description = "Загадайте желание онлайн на официальном Сайте Желаний. Энергетический вклад через безопасную оплату поможет вашему желанию исполниться. Тысячи счастливых пользователей уже исполнили свои мечты!",
  keywords = "загадать желание, исполнение желаний, желания онлайн, сайт желаний, магия желаний, энергетический вклад, исполнить мечту, загадать мечту",
  ogImage = "https://cdn.poehali.dev/intertnal/img/og.png",
  canonical = "https://wish-site-spring.poehali.dev"
}: SEOProps) => {
  
  useEffect(() => {
    // Устанавливаем базовые мета-теги
    document.title = title;
    
    // Удаляем существующие мета-теги
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());
    
    const existingLinks = document.querySelectorAll('link[data-seo="true"]');
    existingLinks.forEach(link => link.remove());
    
    // Создаем новые мета-теги
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Сайт желаний' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      
      // Open Graph для соцсетей
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonical },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Сайт желаний' },
      { property: 'og:locale', content: 'ru_RU' },
      
      // Twitter Cards
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
      
      // Яндекс
      { name: 'yandex-verification', content: '1dd7ed960d8a6dd1' },
      
      // Google
      { name: 'google-site-verification', content: 'pIGNRKC4wrlB_zCPTk7PYX8HwhrVGESlIkAJZcsHXgE' },
      
      // Дополнительные теги для лучшего SEO
      { name: 'theme-color', content: '#4f46e5' },
      { name: 'msapplication-TileColor', content: '#4f46e5' },
      { name: 'application-name', content: 'Сайт желаний' },
      { name: 'apple-mobile-web-app-title', content: 'Сайт желаний' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    ];
    
    metaTags.forEach(({ name, property, content }) => {
      const meta = document.createElement('meta');
      if (name) meta.setAttribute('name', name);
      if (property) meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });
    
    // Канонический URL
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', canonical);
    canonicalLink.setAttribute('data-seo', 'true');
    document.head.appendChild(canonicalLink);
    
    // Альтернативные языки (если планируете многоязычность)
    const alternateLang = document.createElement('link');
    alternateLang.setAttribute('rel', 'alternate');
    alternateLang.setAttribute('hreflang', 'ru');
    alternateLang.setAttribute('href', canonical);
    alternateLang.setAttribute('data-seo', 'true');
    document.head.appendChild(alternateLang);
    
  }, [title, description, keywords, ogImage, canonical]);
  
  return null; // Компонент не рендерит ничего видимого
};

export default SEO;
import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'WebSite' | 'Service' | 'Organization';
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
}

const StructuredData = ({
  type = 'WebSite',
  name = 'САЙТ ЖЕЛАНИЙ',
  description = 'Загадайте желание онлайн на официальном Сайте Желаний. Энергетический вклад через безопасную оплату поможет вашему желанию исполниться. Тысячи счастливых пользователей уже исполнили свои мечты!',
  url = 'https://wish-site-spring.poehali.dev',
  logo = 'https://cdn.poehali.dev/intertnal/img/og.png'
}: StructuredDataProps) => {
  
  useEffect(() => {
    // Удаляем существующие структурированные данные
    const existingScripts = document.querySelectorAll('script[data-structured="true"]');
    existingScripts.forEach(script => script.remove());
    
    // Основная структура сайта
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": name,
      "alternateName": "Сайт Желаний",
      "description": description,
      "url": url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${url}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "sameAs": [
        "https://t.me/+QgiLIa1gFRY4Y2Iy"
      ],
      "publisher": {
        "@type": "Organization",
        "name": name,
        "url": url,
        "logo": {
          "@type": "ImageObject",
          "url": logo,
          "width": 512,
          "height": 512
        }
      }
    };
    
    // Организация
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization", 
      "name": name,
      "url": url,
      "logo": logo,
      "description": description,
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "RU",
        "addressLocality": "Россия"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Russian"
      }
    };
    
    // Сервис исполнения желаний
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Исполнение желаний",
      "description": "Профессиональный сервис исполнения желаний с энергетическим вкладом",
      "provider": {
        "@type": "Organization",
        "name": name,
        "url": url
      },
      "areaServed": {
        "@type": "Country",
        "name": "Russia"
      },
      "availableLanguage": "ru",
      "category": "Духовные услуги",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "price": "100-1000",
        "priceCurrency": "RUB",
        "priceValidUntil": "2025-12-31",
        "description": "Энергетический вклад в исполнение желания"
      }
    };
    
    // FAQ Schema для часто задаваемых вопросов
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Как работает сайт желаний?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Вы загадываете желание, выбираете силу своего желания от 1 до 10, делаете энергетический вклад и верите в исполнение. Чем сильнее желание, тем больше энергии вы в него вкладываете."
          }
        },
        {
          "@type": "Question", 
          "name": "Сколько стоит исполнение желания?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Стоимость зависит от силы вашего желания: от 100 рублей (уровень 1) до 1000 рублей (уровень 10). Вы сами выбираете подходящий уровень."
          }
        },
        {
          "@type": "Question",
          "name": "Безопасна ли оплата?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "Да, мы используем защищенные методы оплаты через банковские карты, СБП и другие проверенные системы. Все транзакции проходят через безопасные каналы."
          }
        }
      ]
    };
    
    // BreadcrumbList для навигации
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": url
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Исполнение желаний",
          "item": `${url}/wishes`
        }
      ]
    };
    
    // Добавляем все схемы
    const schemas = [websiteSchema, organizationSchema, serviceSchema, faqSchema, breadcrumbSchema];
    
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured', 'true');
      script.setAttribute('data-schema-id', `schema-${index}`);
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    });
    
  }, [type, name, description, url, logo]);
  
  return null;
};

export default StructuredData;
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import AffirmationDocument from './AffirmationDocument';

interface ContactFormData {
  email: string;
  phone: string;
  whatsapp: string;
}

const AffirmationGenerator: React.FC = () => {
  const [step, setStep] = useState<'form' | 'preview' | 'contacts'>('form');
  const [affirmationType, setAffirmationType] = useState<'love' | 'money' | 'health' | 'career' | 'custom'>('love');
  const [userName, setUserName] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDesires, setCustomDesires] = useState('');
  const [contactData, setContactData] = useState<ContactFormData>({
    email: '',
    phone: '',
    whatsapp: ''
  });
  const [isSent, setIsSent] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const affirmationTypes = [
    { value: 'love', label: '💕 Любовь и отношения', emoji: '💕' },
    { value: 'money', label: '💰 Богатство и изобилие', emoji: '💰' },
    { value: 'health', label: '🌿 Здоровье и энергия', emoji: '🌿' },
    { value: 'career', label: '🚀 Карьера и успех', emoji: '🚀' },
    { value: 'custom', label: '✨ Персональная аффирмация', emoji: '✨' },
  ];

  const parseCustomDesires = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.startsWith('-') || line.startsWith('•') ? line.substring(1).trim() : line);
  };

  const generatePDF = async () => {
    if (!documentRef.current) return;

    try {
      // В реальном приложении здесь будет библиотека для генерации PDF
      // Например: html2pdf, jsPDF, puppeteer на бэкенде
      const element = documentRef.current;
      
      // Эмуляция генерации PDF
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Создаем blob для скачивания
      const blob = new Blob(['PDF Content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Аффирмация_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
      alert('Произошла ошибка при создании PDF. Попробуйте еще раз.');
    }
  };

  const sendToEmailAndWhatsApp = async () => {
    try {
      // В реальном приложении здесь будет API для отправки
      const formData = {
        userName,
        affirmationType,
        customTitle,
        desires: affirmationType === 'custom' ? parseCustomDesires(customDesires) : [],
        email: contactData.email,
        whatsapp: contactData.whatsapp
      };

      // Эмуляция отправки API запроса
      console.log('Отправка аффирмации:', formData);
      
      // Имитация успешной отправки
      setTimeout(() => {
        alert(`✅ Аффирмация отправлена на:\n📧 Email: ${contactData.email}\n📱 WhatsApp: ${contactData.whatsapp}`);
        setIsSent(true);
      }, 1000);

    } catch (error) {
      console.error('Ошибка при отправке:', error);
      alert('Произошла ошибка при отправке. Попробуйте еще раз.');
    }
  };

  const handleSend = async () => {
    if (!contactData.email || !contactData.whatsapp) {
      alert('Пожалуйста, заполните email и WhatsApp для получения документа');
      return;
    }

    await sendToEmailAndWhatsApp();
  };

  if (step === 'form') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
            <Icon name="Sparkles" size={28} />
            Создание Персональной Аффирмации
          </CardTitle>
          <p className="text-muted-foreground">
            Создайте мощную аффирмацию, настроенную под ваши желания
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Ваше имя</label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Введите ваше имя"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Тип аффирмации</label>
            <Select value={affirmationType} onValueChange={(value: any) => setAffirmationType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {affirmationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {affirmationType === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Название аффирмации</label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Например: Аффирмация процветания"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ваши желания и цели</label>
                <Textarea
                  value={customDesires}
                  onChange={(e) => setCustomDesires(e.target.value)}
                  placeholder="Опишите ваши желания и цели. Каждую с новой строки или через тире."
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Пример: - Я привлекаю изобилие в свою жизнь
                </p>
              </div>
            </>
          )}

          <Button 
            onClick={() => setStep('preview')}
            className="w-full"
            disabled={!userName}
          >
            <Icon name="Eye" size={20} className="mr-2" />
            Предварительный просмотр
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'preview') {
    const selectedType = affirmationTypes.find(t => t.value === affirmationType);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Предварительный просмотр</h2>
            <p className="text-muted-foreground mb-4">
              {selectedType?.emoji} {selectedType?.label} для {userName}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setStep('form')}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Редактировать
              </Button>
              <Button onClick={() => setStep('contacts')}>
                <Icon name="Send" size={16} className="mr-2" />
                Получить бесплатно
              </Button>
            </div>
          </CardContent>
        </Card>

        <div ref={documentRef}>
          <AffirmationDocument
            type={affirmationType}
            customTitle={customTitle}
            userName={userName}
            userDesires={affirmationType === 'custom' ? parseCustomDesires(customDesires) : []}
            createdDate={new Date().toLocaleDateString('ru-RU')}
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary flex items-center justify-center gap-2">
          <Icon name="Send" size={24} />
          Получение документа
        </CardTitle>
        <p className="text-muted-foreground">
          Бесплатно
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email для получения PDF</label>
          <Input
            type="email"
            value={contactData.email}
            onChange={(e) => setContactData({...contactData, email: e.target.value})}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">WhatsApp (с кодом страны)</label>
          <Input
            type="tel"
            value={contactData.whatsapp}
            onChange={(e) => setContactData({...contactData, whatsapp: e.target.value})}
            placeholder="+7 999 123-45-67"
          />
        </div>

        <div className="text-center space-y-3">
          <Button onClick={handleSend} className="w-full" size="lg">
            <Icon name="Zap" size={20} className="mr-2" />
            Получить аффирмацию
          </Button>
          
          <Button variant="outline" onClick={() => setStep('preview')} className="w-full">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться к просмотру
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Документ будет автоматически отправлен на указанные контакты
        </div>
      </CardContent>
    </Card>
  );
};

export default AffirmationGenerator;
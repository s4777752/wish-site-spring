import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WishAffirmationFormProps {
  onComplete: (data: AffirmationData) => void;
}

export interface AffirmationData {
  name: string;
  email: string;
  phone: string;
  wishes: string[];
  category: string;
}

const categories = [
  { id: 'health', name: 'Здоровье', icon: 'Heart' },
  { id: 'love', name: 'Любовь', icon: 'HeartHandshake' },
  { id: 'career', name: 'Карьера', icon: 'Briefcase' },
  { id: 'money', name: 'Финансы', icon: 'DollarSign' },
  { id: 'family', name: 'Семья', icon: 'Home' },
  { id: 'dreams', name: 'Мечты', icon: 'Star' }
];

const WishAffirmationForm = ({ onComplete }: WishAffirmationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    wishes: ['', '', '']
  });
  
  const [currentStep, setCurrentStep] = useState(1);

  const handleWishChange = (index: number, value: string) => {
    const newWishes = [...formData.wishes];
    newWishes[index] = value;
    setFormData({ ...formData, wishes: newWishes });
  };

  const addWish = () => {
    if (formData.wishes.length < 7) {
      setFormData({ ...formData, wishes: [...formData.wishes, ''] });
    }
  };

  const removeWish = (index: number) => {
    if (formData.wishes.length > 1) {
      const newWishes = formData.wishes.filter((_, i) => i !== index);
      setFormData({ ...formData, wishes: newWishes });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.name && formData.email && formData.phone) {
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.category) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = () => {
    const validWishes = formData.wishes.filter(wish => wish.trim() !== '');
    if (validWishes.length > 0) {
      onComplete({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        wishes: validWishes,
        category: formData.category
      });
    }
  };

  const canProceedStep1 = formData.name && formData.email && formData.phone;
  const canProceedStep2 = formData.category;
  const canSubmit = formData.wishes.some(wish => wish.trim() !== '');

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Прогресс */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep 
                ? 'bg-blue-600 text-white' 
                : step < currentStep 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? <Icon name="Check" size={16} /> : step}
          </div>
        ))}
      </div>

      {/* Шаг 1: Контактные данные */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="User" size={24} />
              Ваши контактные данные
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Полное имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 999-99-99"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <Button 
              onClick={handleNext} 
              disabled={!canProceedStep1}
              className="w-full"
            >
              Далее <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Шаг 2: Выбор категории */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Target" size={24} />
              Выберите основную область ваших желаний
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFormData({ ...formData, category: category.id })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.category === category.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon name={category.icon as any} size={32} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(1)}
                className="flex-1"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" /> Назад
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!canProceedStep2}
                className="flex-1"
              >
                Далее <Icon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Шаг 3: Ввод желаний */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Sparkles" size={24} />
              Опишите ваши желания
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.wishes.map((wish, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  placeholder={`Желание ${index + 1}...`}
                  value={wish}
                  onChange={(e) => handleWishChange(index, e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                {formData.wishes.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeWish(index)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                )}
              </div>
            ))}
            
            {formData.wishes.length < 7 && (
              <Button
                variant="outline"
                onClick={addWish}
                className="w-full"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить желание
              </Button>
            )}

            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(2)}
                className="flex-1"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" /> Назад
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!canSubmit}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Создать аффирмации <Icon name="Wand2" size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WishAffirmationForm;
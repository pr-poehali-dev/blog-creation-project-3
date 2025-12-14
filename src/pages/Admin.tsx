import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const API_URL = 'https://functions.poehali.dev/6ac092ce-4ee7-4831-a0a7-a22c17c5f0c9';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  date: string;
  readTime: string;
}

const Admin = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    image: '',
    tags: '',
    readTime: ''
  });

  const fetchArticles = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить статьи",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        image: article.image,
        tags: article.tags.join(', '),
        readTime: article.readTime
      });
    } else {
      setEditingArticle(null);
      setFormData({
        title: '',
        excerpt: '',
        image: '',
        tags: '',
        readTime: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const articleData = {
      title: formData.title,
      excerpt: formData.excerpt,
      image: formData.image,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: formData.readTime
    };

    try {
      if (editingArticle) {
        const response = await fetch(`${API_URL}/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });
        
        if (response.ok) {
          toast({
            title: "Статья обновлена",
            description: "Изменения успешно сохранены",
          });
          fetchArticles();
        }
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        });

        if (response.ok) {
          toast({
            title: "Статья создана",
            description: "Новая статья добавлена в блог",
          });
          fetchArticles();
        }
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить статью",
        variant: "destructive"
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Статья удалена",
          description: "Статья успешно удалена из блога",
        });
        fetchArticles();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить статью",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Modern Blog
              </h1>
              <Badge className="bg-purple-100 text-purple-700">
                Админ-панель
              </Badge>
            </div>
            <div className="flex gap-4 items-center">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Управление статьями</h2>
            <p className="text-gray-600">Всего статей: {articles.length}</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => handleOpenDialog()}
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Создать статью
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? 'Редактировать статью' : 'Новая статья'}
                </DialogTitle>
                <DialogDescription>
                  Заполните информацию о статье
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Введите заголовок статьи"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Краткое описание</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Краткое описание статьи"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">URL изображения</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Теги (через запятую)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Технологии, Дизайн, UX/UI"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="readTime">Время чтения</Label>
                  <Input
                    id="readTime"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="5 мин"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {editingArticle ? 'Сохранить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="p-6 bg-white/80 backdrop-blur-md border-purple-100 hover:shadow-lg transition-shadow">
              <div className="flex gap-6">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-48 h-32 object-cover rounded-lg"
                />
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(article)}
                  >
                    <Icon name="Edit" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <Card className="p-12 text-center bg-white/80 backdrop-blur-md border-purple-100">
            <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">Нет статей</h3>
            <p className="text-gray-600 mb-4">Создайте первую статью для вашего блога</p>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => handleOpenDialog()}
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Создать статью
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;

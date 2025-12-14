import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  date: string;
  readTime: string;
}

const API_URL = 'https://functions.poehali.dev/6ac092ce-4ee7-4831-a0a7-a22c17c5f0c9';

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)));

  const filteredArticles = selectedTag
    ? articles.filter(article => article.tags.includes(selectedTag))
    : articles;

  const featuredArticle = articles[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Загрузка статей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Modern Blog
            </h1>
            <div className="flex gap-6 items-center">
              <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Главная
              </a>
              <a href="#articles" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Статьи
              </a>
              <a href="#tags" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Категории
              </a>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/admin'}
              >
                <Icon name="Settings" size={18} className="mr-2" />
                Админ-панель
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-left">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              ✨ Избранное
            </Badge>
            <h2 className="text-5xl font-bold leading-tight">
              Создаём будущее <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">вместе</span>
            </h2>
            <p className="text-lg text-gray-600">
              Исследуйте мир современных технологий, дизайна и разработки. Актуальные статьи от экспертов индустрии.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8">
              Читать статьи
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
            <img 
              src="https://cdn.poehali.dev/projects/6be8a421-82e7-4b79-8da7-83f3ec132251/files/997acd05-5152-4931-8d27-259470eafbe1.jpg" 
              alt="Hero"
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 bg-white/80 backdrop-blur-md border-purple-100 shadow-xl hover:shadow-2xl transition-shadow animate-fade-in">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <img 
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="rounded-2xl w-full h-[300px] object-cover"
            />
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {featuredArticle.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="text-3xl font-bold">{featuredArticle.title}</h3>
              <p className="text-gray-600">{featuredArticle.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={16} />
                  {featuredArticle.date}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={16} />
                  {featuredArticle.readTime}
                </span>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Читать полностью
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <section id="tags" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">Категории</h2>
          <p className="text-gray-600">Найдите статьи по интересующим вас темам</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center mb-8">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            onClick={() => setSelectedTag(null)}
            className={selectedTag === null ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" : ""}
          >
            Все статьи
          </Button>
          {allTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => setSelectedTag(tag)}
              className={selectedTag === tag ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" : "hover:border-purple-600 hover:text-purple-600"}
            >
              {tag}
            </Button>
          ))}
        </div>
      </section>

      <section id="articles" className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <Card 
              key={article.id} 
              className="overflow-hidden bg-white/80 backdrop-blur-md border-purple-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden group">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {article.tags.slice(0, 2).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(tag);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-bold line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
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
            </Card>
          ))}
        </div>
      </section>

      <footer className="bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Modern Blog
              </h3>
              <p className="text-purple-200">
                Актуальные статьи о технологиях, дизайне и разработке
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Навигация</h4>
              <div className="space-y-2 text-purple-200">
                <a href="#" className="block hover:text-white transition-colors">Главная</a>
                <a href="#articles" className="block hover:text-white transition-colors">Статьи</a>
                <a href="#tags" className="block hover:text-white transition-colors">Категории</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Категории</h4>
              <div className="space-y-2 text-purple-200">
                {allTags.slice(0, 4).map(tag => (
                  <a key={tag} href="#" className="block hover:text-white transition-colors">{tag}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Следите за нами</h4>
              <div className="flex gap-4">
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <Icon name="Twitter" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <Icon name="Github" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <Icon name="Linkedin" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-8 pt-8 text-center text-purple-200">
            <p>© 2024 Modern Blog. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
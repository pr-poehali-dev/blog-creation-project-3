CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  image VARCHAR(1000) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  date VARCHAR(100) NOT NULL,
  read_time VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO articles (title, excerpt, image, tags, date, read_time) VALUES
('Будущее веб-разработки: тренды 2025', 'Исследуем ключевые технологии и подходы, которые определят развитие веб-индустрии в ближайшие годы.', 'https://cdn.poehali.dev/projects/6be8a421-82e7-4b79-8da7-83f3ec132251/files/89f395aa-11df-461d-aa0b-857c6d9a520c.jpg', ARRAY['Технологии', 'Веб-разработка', 'Тренды'], '15 декабря 2024', '5 мин'),
('Дизайн-системы: как создать единый язык продукта', 'Подробное руководство по построению эффективной дизайн-системы для вашей команды.', 'https://cdn.poehali.dev/projects/6be8a421-82e7-4b79-8da7-83f3ec132251/files/9e74a6fe-769a-4444-b846-76406f8e1bd9.jpg', ARRAY['Дизайн', 'UX/UI', 'Инструменты'], '12 декабря 2024', '8 мин'),
('TypeScript для начинающих: полное погружение', 'Начните свой путь в типизированном JavaScript с этого практического руководства.', 'https://cdn.poehali.dev/projects/6be8a421-82e7-4b79-8da7-83f3ec132251/files/89f395aa-11df-461d-aa0b-857c6d9a520c.jpg', ARRAY['TypeScript', 'Обучение', 'JavaScript'], '10 декабря 2024', '12 мин'),
('Микроанимации в интерфейсах: примеры и лучшие практики', 'Как правильно использовать анимацию для улучшения пользовательского опыта.', 'https://cdn.poehali.dev/projects/6be8a421-82e7-4b79-8da7-83f3ec132251/files/9e74a6fe-769a-4444-b846-76406f8e1bd9.jpg', ARRAY['Анимация', 'Дизайн', 'UX/UI'], '8 декабря 2024', '6 мин'),
('Оптимизация производительности React приложений', 'Практические советы по ускорению работы ваших React-проектов.', 'https://cdn.poehali.dev/projects/6be8a421-82e7-4b79-8da7-83f3ec132251/files/89f395aa-11df-461d-aa0b-857c6d9a520c.jpg', ARRAY['React', 'Оптимизация', 'Веб-разработка'], '5 декабря 2024', '10 мин'),
('Адаптивная типографика: руководство по масштабированию', 'Создаём красивые и читаемые тексты на всех размерах экранов.', 'https://cdn.poehali.dev/projects/6be8a421-82e7-4b79-8da7-83f3ec132251/files/9e74a6fe-769a-4444-b846-76406f8e1bd9.jpg', ARRAY['Типографика', 'Дизайн', 'CSS'], '3 декабря 2024', '7 мин');

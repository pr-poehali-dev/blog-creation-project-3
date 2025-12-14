import json
import os
import psycopg2
from typing import Dict, Any

def get_db_connection():
    """Создает подключение к PostgreSQL базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для управления статьями блога
    GET / - получить все статьи
    POST / - создать новую статью
    PUT /{id} - обновить статью
    DELETE /{id} - удалить статью
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT id, title, excerpt, image, tags, date, read_time 
                FROM articles 
                ORDER BY created_at DESC
            ''')
            rows = cur.fetchall()
            
            articles = []
            for row in rows:
                articles.append({
                    'id': row[0],
                    'title': row[1],
                    'excerpt': row[2],
                    'image': row[3],
                    'tags': row[4],
                    'date': row[5],
                    'readTime': row[6]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(articles, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO articles (title, excerpt, image, tags, date, read_time)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, title, excerpt, image, tags, date, read_time
            ''', (
                body_data['title'],
                body_data['excerpt'],
                body_data['image'],
                body_data['tags'],
                body_data['date'],
                body_data['readTime']
            ))
            
            row = cur.fetchone()
            conn.commit()
            
            article = {
                'id': row[0],
                'title': row[1],
                'excerpt': row[2],
                'image': row[3],
                'tags': row[4],
                'date': row[5],
                'readTime': row[6]
            }
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(article, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            params = event.get('pathParams', {})
            article_id = params.get('id')
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                UPDATE articles 
                SET title = %s, excerpt = %s, image = %s, tags = %s, 
                    date = %s, read_time = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, title, excerpt, image, tags, date, read_time
            ''', (
                body_data['title'],
                body_data['excerpt'],
                body_data['image'],
                body_data['tags'],
                body_data['date'],
                body_data['readTime'],
                article_id
            ))
            
            row = cur.fetchone()
            conn.commit()
            
            if row:
                article = {
                    'id': row[0],
                    'title': row[1],
                    'excerpt': row[2],
                    'image': row[3],
                    'tags': row[4],
                    'date': row[5],
                    'readTime': row[6]
                }
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(article, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Article not found'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            params = event.get('pathParams', {})
            article_id = params.get('id')
            
            cur.execute('DELETE FROM articles WHERE id = %s', (article_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()

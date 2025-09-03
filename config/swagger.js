import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущий путь к файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем package.json
const packageJson = JSON.parse(
  await readFile(path.join(__dirname, '../package.json'))
);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sportive Healing API',
      version: packageJson.version,
      description: `
        ## API для платформы спортивного врачевания
        
        ### Общее описание
        Платформа позволяет молодым врачам улучшать свои навыки, решая интерактивные задачи с автоматической проверкой результатов.
        
        ### Основные возможности:
        - Регистрация и аутентификация врачей
        - Управление медицинскими задачами (создание, решение, проверка)
        - Категоризация задач по медицинским специальностям
        - Отслеживание статистики и прогресса пользователей
        
        ### Авторизация
        Большинство эндпоинтов требуют JWT-токена. Добавьте его в заголовок \`Authorization: Bearer <token>\`
      `,
      contact: {
        name: 'Техническая поддержка',
        email: 'support@sportivehealing.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/',
        description: 'Локальный сервер разработки'
      },
      //{
        //url: 'https://api.sportivehealing.com/',
        //description: 'Продуктивный сервер'
      //}
    ],
    externalDocs: {
      description: 'Документация по медицинским стандартам',
      url: 'https://medical-standards.org'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT токен в формате: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              example: 'Иван Иванов'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            },
            specialization: {
              type: 'string',
              example: 'Травматолог'
            },
            experienceYears: {
              type: 'number',
              example: 5
            },
            statistics: {
              type: 'object',
              properties: {
                totalAttempts: {
                  type: 'number',
                  example: 25
                },
                correctAttempts: {
                  type: 'number',
                  example: 18
                },
                solvedTasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      task: {
                        $ref: '#/components/schemas/Task'
                      },
                      solvedAt: {
                        type: 'string',
                        format: 'date-time'
                      },
                      isCorrect: {
                        type: 'boolean'
                      }
                    }
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            title: {
              type: 'string',
              example: 'Диагностика травмы колена'
            },
            description: {
              type: 'string',
              example: 'Опишите методику диагностики травмы колена'
            },
            category: {
              type: 'string',
              example: '507f1f77bcf86cd799439013'
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              example: 'medium'
            },
            correctAnswer: {
              type: 'string',
              example: 'МРТ и рентгенография'
            },
            options: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['УЗИ', 'МРТ и рентгенография', 'Пальпация', 'Анализ крови']
            },
            explanation: {
              type: 'string',
              example: 'МРТ показывает мягкие ткани, а рентген - костные структуры'
            },
            author: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        Solution: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439014'
            },
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            task: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            userAnswer: {
              type: 'string',
              example: 'МРТ и рентгенография'
            },
            isCorrect: {
              type: 'boolean',
              example: true
            },
            solvedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439013'
            },
            name: {
              type: 'string',
              example: 'Травматология'
            },
            description: {
              type: 'string',
              example: 'Диагностика и лечение травм'
            },
            icon: {
              type: 'string',
              example: 'trauma-icon.svg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Произошла ошибка'
            },
            stack: {
              type: 'string',
              example: 'Error: Произошла ошибка\n    at ...'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            total: {
              type: 'integer',
              example: 100
            },
            page: {
              type: 'integer',
              example: 1
            },
            limit: {
              type: 'integer',
              example: 10
            }
          }
        }
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Аутентификация и регистрация пользователей'
      },
      {
        name: 'Users',
        description: 'Операции с пользователями (врачами)'
      },
      {
        name: 'Tasks',
        description: 'Управление медицинскими задачами и решениями'
      },
      {
        name: 'Categories',
        description: 'Категории медицинских задач'
      },
    ]
  },
  apis: ['./routes/*.js', './models/*.js']
};


const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${process.env.PORT}/api-docs`);
};
import { Application } from 'express';
import { JSONFilePreset } from 'lowdb/node';
// @ts-ignore
import defaultDB from '../db/db.json' assert { type: "json" };
import {ReportData} from "../../types/index.js";

// Инициализация базы данных
const db = await JSONFilePreset('db.json', defaultDB);

const ALL_DESCRIPTIONS = '/api/descriptions';
const ONE_DESCRIPTION = '/api/description';
const ALL_REPORTS = '/api/reports';
const ONE_REPORT = '/api/report';

export const initRoutes = (app: Application) => {
  // Middleware для загрузки базы перед каждым запросом
  app.use(async (req, res, next) => {
    await db.read();
    next();
  });

  app.post<{}, {}, {pass: string}, {}>('/api/sign-in', (req, res) => {
    try {
      const {pass} = req.body
      if (pass !== '123!321')  res.status(401).send({ message: 'Неверный пароль' });
      res.status(200).send()
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при входе', error: e.message });
    }
  })

  // app.post<{}, {}, {password: string}, {}>('/api/update-pass')

  // Получить все описания (по одному органу или всем)
  app.get<{}, {}, {}, {organ: string | undefined}>(ALL_DESCRIPTIONS, (req, res) => {
    try {
      const {organ} = req.query;
      if (organ) {
        const organData = db.data.templates[organ];
        if (!organData) {
          return res.status(404).send({ message: `Орган '${organ}' не найден.` });
        }
        res.send(organData);
      } else {
        res.send(db.data.templates);
      }
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при получении описаний', error: e.message });
    }
  });

  // Получить конкретное описание по органу и типу (например, норму почек)
  app.get<{}, {}, {}, {organ: string, type: string}>(ONE_DESCRIPTION, (req, res) => {
    try {
      const { organ, type } = req.query;
      if (!organ || !type) {
        return res.status(400).send({ message: 'Параметры organ и type обязательны.' });
      }

      const organData = db.data.templates[organ];
      if (!organData) {
        return res.status(404).send({ message: `Орган '${organ}' не найден.` });
      }

      const description = organData[type];
      if (!description) {
        return res.status(404).send({ message: `Описание '${type}' для органа '${organ}' не найдено.` });
      }

      res.send(description);
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при получении описания', error: e.message });
    }
  });

  // Добавить или изменить описание для органа
  app.post<{}, {}, {organ: string, title: string, description: string}, {}>(ONE_DESCRIPTION, async (req, res) => {
    try {
      const { organ, title, description } = req.body;
      if (!organ || !title || !description) {
        return res.status(400).send({ message: 'Поля organ, title и description обязательны.' });
      }

      if (!db.data.templates[organ]) {
        return res.status(404).send({ message: `'${organ}' не найден.` });
      }

      const isUpdated = !!db.data.templates[organ][title]

      db.data.templates[organ][title] = description;
      await db.write();

      res.status(201).send({ message: `Описание '${title}' для '${organ} ${isUpdated ? 'обновлено' : 'добавлено'}'.` });
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при добавлении описания', error: e.message });
    }
  });

  // todo обновление название патологии и органа

  // Удалить описание для органа
  app.delete<{}, {}, {}, {organ: string, type: string}>(ONE_DESCRIPTION, async (req, res) => {
    try {
      const { organ, type } = req.query
      if (!organ || !type) {
        return res.status(400).send({ message: 'Поля organ и type обязательны.' });
      }

      if (!db.data.templates[organ] || !db.data.templates[organ][type]) {
        return res.status(404).send({ message: `Описание '${type}' для органа '${organ}' не найдено.` });
      }

      delete db.data.templates[organ][type];
      await db.write();

      res.send({ message: `Описание '${type}' для органа '${organ}' удалено.` });
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при удалении описания', error: e.message });
    }
  });

  // Получить все репорты или выбранный
  app.get<{}, {}, {}, {reportId: string | undefined}>(ALL_REPORTS, (req, res) => {
    try {
      const {reportId} = req.query;
      if (reportId) {
        const reportData = db.data.reports[reportId];
        if (!reportData) {
          return res.status(404).send({ message: `Отчет '${reportId}' не найден.` });
        }
        res.send(reportData);
      } else {
        res.send(db.data.reports);
      }
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при получении отчетов', error: e.message });
    }
  });

  // Сохранить новый репорт
  app.post<{}, {}, ReportData, {}>(ONE_REPORT, async (req, res) => {
    try {
      const { reportId, reportTitle, descriptions } = req.body;
      if (!reportId || !reportTitle || !descriptions) {
        return res.status(400).send({ message: 'Нужно добавить кличку питомца и выбрать как минимум одно описание' });
      }

      if (!db.data.reports[reportId]) {
        return res.status(404).send({ message: `Отчет '${reportId}' не найден.` });
      }

      db.data.reports[reportId] = { reportId, reportTitle, descriptions };
      await db.write();

      res.status(201).send({ message: `Отчет '${reportId}' добавлен.` });
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при добавлении отчета', error: e.message });
    }
  });

  // Удалить выбранный репорт
  app.delete<{}, {}, {}, {reportId: string}>(ONE_REPORT, async (req, res) => {
    try {
      const { reportId } = req.query;
      if (!reportId) {
        return res.status(400).send({ message: 'Поле reportId обязательно.' });
      }

      if (!db.data.reports[reportId]) {
        return res.status(404).send({ message: `Отчет '${reportId}' не найден.` });
      }

      db.data.reports[reportId] = {reportId};
      await db.write();

      res.status(200).send({ message: `Отчет '${reportId}' удален.` });
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при удалении отчета', error: e.message });
    }
  });

  // выкачать базу
  app.get('/api/db', async (req, res) => {
    try {
      res.send(db.data)
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при удалении отчета', error: e.message });
    }
  })

  // закачать базу
  app.post('/api/db', async (req, res) => {
    try {
      db.data = req.body
      await db.write();
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при удалении отчета', error: e.message });
    }
  })
};

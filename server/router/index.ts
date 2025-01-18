import { Application, Response, Request } from 'express';
import { JSONFilePreset } from 'lowdb/node';
// @ts-ignore
import defaultDB from '../db/db.json' assert { type: "json" };
import {ReportData} from "../../types/index.js";
import jwt, {JwtPayload} from "jsonwebtoken";

// Инициализация базы данных
const db = await JSONFilePreset('db.json', defaultDB);

const ALL_DESCRIPTIONS = '/api/descriptions';
const ONE_DESCRIPTION = '/api/description';
const ALL_REPORTS = '/api/reports';
const ONE_REPORT = '/api/report';
type SetCookiesParams = { res: Response, tokenName: COOKIE_TOKEN_NAMES, token: String }

export const setCookie = ({res, tokenName, token}: SetCookiesParams) => {
  res.cookie(tokenName, token, {
    maxAge: 3600 * 1000 * 24 * 30,
    // signed: true, // для этого надо куки парсер поставить
    httpOnly: true,
    // secure: false,
    sameSite: false,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
export enum COOKIE_TOKEN_NAMES {
  REFRESH_TOKEN = 'refresh-token',
  ACCESS_TOKEN = 'access-token'
}
enum TOKEN_TYPES { ACCESS = 'ACCESS', REFRESH = 'REFRESH' }
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY || 'abirvalg';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || 'ciclopentanoperhidrofenantreno';

export const generateAccessToken = (): string => jwt.sign({ type: TOKEN_TYPES.ACCESS }, ACCESS_SECRET_KEY, { expiresIn: '10m' });
export const generateRefreshToken = (trustDevice: boolean): string => jwt.sign({ type: TOKEN_TYPES.REFRESH }, REFRESH_SECRET_KEY, { expiresIn: trustDevice ? '30d' : '1h' });
function isJwtPayload(decoded: string | JwtPayload): decoded is JwtPayload {
  return typeof decoded === 'object' && 'type' in decoded;
}
const checkJWT = (token: string, key: string, tokenType: TOKEN_TYPES): boolean => {
  const decoded = jwt.verify(token, key);
  return isJwtPayload(decoded) && decoded.type === tokenType
};

export const checkAccessToken = (token: string) => checkJWT(token, ACCESS_SECRET_KEY, TOKEN_TYPES.ACCESS)
export const checkRefreshToken = (token: string) => checkJWT(token, REFRESH_SECRET_KEY, TOKEN_TYPES.REFRESH)

export const checkCookies = (req: Request): void => {
  const accessToken = req.cookies[COOKIE_TOKEN_NAMES.ACCESS_TOKEN];
  if (!accessToken) throw new Error('Нет токена доступа')
  if (typeof accessToken !== 'string') throw new Error('Некорректный токен')
  const isTokenValid = checkAccessToken(accessToken);
  if (!isTokenValid) throw new Error('Невалидный токен');
}

export const initRoutes = (app: Application) => {
  // Middleware для загрузки базы перед каждым запросом
  app.use(async (req, res, next) => {
    await db.read();
    next();
  });

  app.post<{}, {}, {trustDevice: boolean, pass: string}, {}>('/api/sign-in', (req, res) => {
    try {
      const {trustDevice, pass} = req.body
      if (pass !== '123!321')  res.status(401).send({ message: 'Неверный пароль' });
      const accessToken = generateAccessToken()
      const refreshToken = generateRefreshToken(trustDevice)
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.ACCESS_TOKEN, token: accessToken})
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.REFRESH_TOKEN, token: refreshToken})
        .status(200).send({accessToken})
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при входе', error: e.message });
    }
  })

  // app.post<{}, {}, {password: string}, {}>('/api/update-pass')

  // Получить все описания (по одному органу или всем)
  app.get<{}, {}, {}, {organ: string | undefined}>(ALL_DESCRIPTIONS, (req, res) => {
    try {
      checkCookies(req)
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
      checkCookies(req)
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
      checkCookies(req)
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
      checkCookies(req)
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
      checkCookies(req)
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
      checkCookies(req)
      const { reportId, reportTitle, descriptions, reportType, animalSpecies } = req.body;
      if (!reportId || !reportTitle || !descriptions || !reportType || !animalSpecies) {
        return res.status(400).send({ message: 'Нужно добавить кличку питомца и выбрать как минимум одно описание' });
      }

      if (!db.data.reports[reportId]) {
        return res.status(404).send({ message: `Отчет '${reportId}' не найден.` });
      }

      db.data.reports[reportId] = { reportId, reportTitle, descriptions, reportType, animalSpecies };
      await db.write();

      res.status(201).send({ message: `Отчет '${reportId}' добавлен.` });
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при добавлении отчета', error: e.message });
    }
  });

  // Удалить выбранный репорт
  app.delete<{}, {}, {}, {reportId: string}>(ONE_REPORT, async (req, res) => {
    try {
      checkCookies(req)
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
      checkCookies(req)
      const data = db.data;
      res.setHeader('Content-Disposition', 'attachment; filename="database.json"');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при удалении отчета', error: e.message });
    }
  })

  // закачать базу
  app.post('/api/db', async (req, res) => {
    try {
      checkCookies(req)
      db.data = req.body
      await db.write();
      res.status(200).send()
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при удалении отчета', error: e.message });
    }
  })

  app.post<{}, {}, {trustDevice: boolean}, {}>('/api/refresh-token', async (req, res) => {
    try {
      const {trustDevice} = req.body
      if (!req.cookies) throw new Error('Cookies отсутствуют')
      const refreshToken = req.cookies[COOKIE_TOKEN_NAMES.REFRESH_TOKEN];
      if (!refreshToken) throw new Error('Нет refresh токена')
      const isRefreshValid = checkRefreshToken(refreshToken)
      if (!isRefreshValid) throw new Error('Невалидный refresh токен')
      const accessToken = generateAccessToken()
      const newRefreshToken = generateRefreshToken(trustDevice)
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.ACCESS_TOKEN, token: accessToken})
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.REFRESH_TOKEN, token: newRefreshToken})
        .status(200).send({accessToken})
    } catch (e) {
      if (e instanceof Error) res.status(500).send({ message: 'Ошибка при обновлении токена', error: e.message });
    }
  });
};

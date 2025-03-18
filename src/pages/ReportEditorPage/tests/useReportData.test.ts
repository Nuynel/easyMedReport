// useReportData.test.ts

import { renderHook, act } from '@testing-library/react-hooks';
import { expect, beforeEach, it, describe, vi, Mock  } from 'vitest'
// или из '@testing-library/react-hooks' — смотря, что вы используете

import { useReportData } from '../useReportData';

// Импортируем все методы, которые будем мокать
import * as tokenMethods from '#root/src/shared/methods/tokenMethods';
import * as apiMethods from '#root/src/pages/ReportEditorPage/methods/api';
import * as services from '#root/src/pages/ReportEditorPage/methods/services';
import * as utils from '#root/src/pages/ReportEditorPage/methods/utils';

// Говорим Vitest, что эти модули будут мокированы
vi.mock('#root/src/shared/methods/tokenMethods');
vi.mock('#root/src/pages/ReportEditorPage/methods/api');
vi.mock('#root/src/pages/ReportEditorPage/methods/services');
vi.mock('#root/src/pages/ReportEditorPage/methods/utils');

describe('useReportData', () => {
  beforeEach(() => {
    // сбрасываем все предыдущие вызовы и реализации
    vi.clearAllMocks();

    // Настраиваем, что именно возвращают наши замоканные функции
    (tokenMethods.checkAndRefreshAccessToken as Mock).mockResolvedValue(undefined);
    (apiMethods.getAllObservationTemplates as Mock).mockResolvedValue({
      heart: { 'норма': 'Сердце без патологии' },
      liver: { 'норма': 'Печень без патологии' }
    });
    (services.getSavedReportData as Mock).mockReturnValue({
      reportType: 'CUSTOM',
      reportTitle: 'Тестовый отчёт',
      reportId: 'report-1',
      animalSpecies: 'собаки',
      descriptions: {}
    });
    (utils.getFilterTemplatesByAnimalSpecies as Mock).mockImplementation((templates, species) => templates);
    (utils.getTemplatesForNormal as Mock).mockImplementation((templates, key) => ({
      heart: 'Норма сердца',
      liver: 'Норма печени'
    }));
  });

  it('должен вызвать checkAndRefreshAccessToken и загрузить observationTemplates при монтировании', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useReportData());

    // Поскольку getAllObservationTemplates - асинхронная функция,
    // дождёмся, пока hook сделает setAllObservationTemplates
    await waitForNextUpdate();

    // Проверяем, что нужные методы были вызваны
    expect(tokenMethods.checkAndRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(apiMethods.getAllObservationTemplates).toHaveBeenCalledTimes(1);

    // Проверяем, что allObservationTemplates стал нашим мок-объектом
    expect(result.current.allObservationTemplates).toEqual({
      heart: { 'норма': 'Сердце без патологии' },
      liver: { 'норма': 'Печень без патологии' }
    });
  });

  it('должен обновить reportTitle при handleChangeReportTitle', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useReportData());
    await waitForNextUpdate();

    // Проверяем, что изначально заголовок тот, что вернулся из getSavedReportData
    expect(result.current.editableReport.reportTitle).toBe('Тестовый отчёт');

    // Меняем заголовок
    act(() => {
      result.current.handleChangeReportTitle('Новый заголовок');
    });

    // Убеждаемся, что editableReport теперь имеет обновлённый заголовок
    expect(result.current.editableReport.reportTitle).toBe('Новый заголовок');
  });

  it('удаляет орган при removeOrgan', async () => {
    // Мокаем так, чтобы в descriptions уже был organ "heart"
    (services.getSavedReportData as Mock).mockReturnValue({
      reportType: 'CUSTOM',
      reportTitle: 'Отчёт с органами',
      reportId: 'report-1',
      animalSpecies: 'собаки',
      descriptions: { heart: { 'норма': 'Всё ОК' }, liver: { 'норма': 'Всё ОК' } }
    });

    const { result, waitForNextUpdate } = renderHook(() => useReportData());
    await waitForNextUpdate();

    // Проверяем, что "heart" в selectedOrgans
    expect(result.current.selectedOrgans).toContain('heart');

    act(() => {
      result.current.removeOrgan('heart');
    });

    // "heart" должен исчезнуть
    expect(result.current.selectedOrgans).not.toContain('heart');
    expect(result.current.editableReport.descriptions).not.toHaveProperty('heart');
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { navigate } from 'vike/client/router';
import ReportEditorHeader from '../componets/ui/ReportEditorHeader';
import {ReportData} from "#root/types";

// Мокаем navigate
// vi.mock('vike/client/router', () => ({
//   navigate: vi.fn(),
//   getAllObservationTemplates: vi.fn().mockResolvedValue({
//     "Мочевой пузырь": {
//       "Норма кошки": "Норма кошки123",
//       "Норма собаки": "Норма собаки456",
//     }
//   })
// }));

const DEFAULT_REPORT_DATA: ReportData = {
  reportType: 'CUSTOM',
  reportTitle: 'Test',
  reportId: '1',
  animalSpecies: 'собаки',
  descriptions: {}
}

describe('Report Editor Header', () => {
  it('Должны отобразиться все три интерактивных элемента', async () => {
    render(
      <ReportEditorHeader
        report={DEFAULT_REPORT_DATA}
        moveToReports={() => {}}
        switchReportType={() => {}}
        switchAnimalSpecies={() => {}}
      />
    );

    screen.debug(); // Выведет в консоль текущий рендер DOM

    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByTestId('report-type-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('animal-species-switcher')).toBeInTheDocument();
  });



  // it('должна просто выйти назад, если изменений нет', async () => {
  //   render(<MyComponent />);
  //   console.log(123)
  //   screen.debug()
  //   console.log(321)
  //
  //   const backButton = screen.findByTestId('back-button');
  //   await userEvent.click(backButton);
  //
  //   expect(navigate).toHaveBeenCalledWith(-1); // проверяем, что произошел выход
  //   // expect(screen.queryByText(/сохранить изменения\?/i)).not.toBeInTheDocument(); // проверяем, что BottomSheet не появился
  // });
  //
  // it('должен показать BottomSheet при наличии изменений', async () => {
  //   render(<MyComponent />);
  //
  //   const input = screen.getByRole('textbox'); // найди свое поле ввода или другой интерактивный элемент
  //   await userEvent.type(input, 'новые данные');
  //
  //   const backButton = screen.getByRole('button', { name: /назад/i });
  //   await userEvent.click(backButton);
  //
  //   expect(screen.getByText(/сохранить изменения\?/i)).toBeInTheDocument(); // BottomSheet должен появиться
  // });

  // it('должен сохранить изменения при нажатии "Сохранить" и выйти', async () => {
  //   const mockSave = vi.fn();
  //
  //   render(<MyComponent onSave={mockSave} />);
  //
  //   const input = screen.getByRole('textbox');
  //   await userEvent.type(input, 'новые данные');
  //
  //   const backButton = screen.getByRole('button', { name: /назад/i });
  //   await userEvent.click(backButton);
  //
  //   const saveButton = screen.getByRole('button', { name: /сохранить/i });
  //   await userEvent.click(saveButton);
  //
  //   expect(mockSave).toHaveBeenCalled(); // проверяем, что сохранение вызвано
  //   expect(navigate).toHaveBeenCalledWith(-1); // проверяем, что произошло перенаправление
  // });

  // it('должен выйти без сохранения при нажатии "Выйти без сохранения"', async () => {
  //   render(<MyComponent />);
  //
  //   const input = screen.getByRole('textbox');
  //   await userEvent.type(input, 'новые данные');
  //
  //   const backButton = screen.getByRole('button', { name: /назад/i });
  //   await userEvent.click(backButton);
  //
  //   const discardButton = screen.getByRole('button', { name: /выйти без сохранения/i });
  //   await userEvent.click(discardButton);
  //
  //   expect(navigate).toHaveBeenCalledWith(-1); // проверяем, что произошло перенаправление
  // });
});

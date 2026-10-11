import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { EmployeesPage } from '../features/employees/pages/EmployeesPage';
import { SchedulesPage } from '../features/schedules/pages/SchedulesPage';
import { FinancePage } from '../features/finance/pages/FinancePage';
import { OcrScanPage } from '../features/ocr/pages/OcrScanPage';
import { RouteErrorBoundary } from '../components/feedback/RouteErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'employees',
        element: <EmployeesPage />,
      },
      {
        path: 'schedules',
        element: <SchedulesPage />,
      },
      {
        path: 'finance',
        element: <FinancePage />,
      },
      {
        path: 'ocr',
        element: <OcrScanPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

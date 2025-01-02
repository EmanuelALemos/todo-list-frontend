import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BoardPage } from './pages/BoardPage';
import { AppLayout } from './layout/app';

export const router = createBrowserRouter([

  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/board/:boardId', element: <BoardPage /> }
    ]
  }
]);

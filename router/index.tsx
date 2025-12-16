import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

import P_login from '../pages/p-login';
import P_home from '../pages/p-home';
import P_record from '../pages/p-record';
import P_analysis from '../pages/p-analysis';
import P_history from '../pages/p-history';
import P_recommend from '../pages/p-recommend';
import P_budget from '../pages/p-budget';
import P_account from '../pages/p-account';
import P_settings from '../pages/p-settings';
import P_transaction_detail from '../pages/p-transaction_detail';
import P_recommend_detail from '../pages/p-recommend_detail';
import P_transaction_edit from '../pages/p-transaction_edit';
import P_consume_record_edit from '../pages/p-consume_record_edit';
import NotFoundPage from './NotFoundPage';
import ErrorPage from './ErrorPage';

function Listener() {
  const location = useLocation();
  useEffect(() => {
    const pageId = 'P-' + location.pathname.replace('/', '').toUpperCase();
    console.log('当前pageId:', pageId, ', pathname:', location.pathname, ', search:', location.search);
    if (typeof window === 'object' && window.parent && window.parent.postMessage) {
      window.parent.postMessage({
        type: 'chux-path-change',
        pageId: pageId,
        pathname: location.pathname,
        search: location.search,
      }, '*');
    }
  }, [location]);

  return <Outlet />;
}

// 使用 createBrowserRouter 创建路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <Listener />,
    children: [
      {
    path: '/',
    element: <Navigate to='/login' replace={true} />,
  },
      {
    path: '/login',
    element: (
      <ErrorBoundary>
        <P_login />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/home',
    element: (
      <ErrorBoundary>
        <P_home />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/record',
    element: (
      <ErrorBoundary>
        <P_record />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/analysis',
    element: (
      <ErrorBoundary>
        <P_analysis />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/history',
    element: (
      <ErrorBoundary>
        <P_history />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/recommend',
    element: (
      <ErrorBoundary>
        <P_recommend />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/budget',
    element: (
      <ErrorBoundary>
        <P_budget />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/account',
    element: (
      <ErrorBoundary>
        <P_account />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/settings',
    element: (
      <ErrorBoundary>
        <P_settings />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/transaction-detail',
    element: (
      <ErrorBoundary>
        <P_transaction_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/recommend-detail',
    element: (
      <ErrorBoundary>
        <P_recommend_detail />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/transaction-edit',
    element: (
      <ErrorBoundary>
        <P_transaction_edit />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '/consume-record-edit',
    element: (
      <ErrorBoundary>
        <P_consume_record_edit />
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
      {
    path: '*',
    element: <NotFoundPage />,
  },
    ]
  }
]);

export default router;
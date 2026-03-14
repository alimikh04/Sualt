import { useMemo, useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { UsersPage } from './pages/UsersPage';

export type AppRoute = 'login' | 'dashboard' | 'shipments' | 'users';

export function App() {
  const [route, setRoute] = useState<AppRoute>('login');
  const [lang, setLang] = useState<'kk' | 'ru'>('kk');

  const labels = useMemo(
    () => ({
      kk: {
        title: 'ITtcargo Control Tower',
        dashboard: 'Дашборд',
        shipments: 'Жөнелтілімдер',
        users: 'Пайдаланушылар',
        logout: 'Шығу',
      },
      ru: {
        title: 'ITtcargo Control Tower',
        dashboard: 'Дашборд',
        shipments: 'Отгрузки',
        users: 'Пользователи',
        logout: 'Выйти',
      },
    }),
    [],
  )[lang];

  if (route === 'login') return <LoginPage onLogin={() => setRoute('dashboard')} lang={lang} onLang={setLang} />;

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>{labels.title}</h2>
        <button onClick={() => setRoute('dashboard')}>{labels.dashboard}</button>
        <button onClick={() => setRoute('shipments')}>{labels.shipments}</button>
        <button onClick={() => setRoute('users')}>{labels.users}</button>
        <button className="ghost" onClick={() => setRoute('login')}>{labels.logout}</button>
      </aside>
      <main className="content">
        {route === 'dashboard' && <DashboardPage />}
        {route === 'shipments' && <ShipmentsPage />}
        {route === 'users' && <UsersPage />}
      </main>
    </div>
  );
}

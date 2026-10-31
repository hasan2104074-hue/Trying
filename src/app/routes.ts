import { createBrowserRouter } from 'react-router';
import { RootShell } from './components/RootShell';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootShell,
  },
  {
    path: '/explore',
    Component: RootShell,
  },
  {
    path: '/events',
    Component: RootShell,
  },
  {
    path: '/store',
    Component: RootShell,
  },
  {
    path: '/ideas',
    Component: RootShell,
  },
  {
    path: '/notifications',
    Component: RootShell,
  },
  {
    path: '/profile',
    Component: RootShell,
  },
  {
    path: '/profile/:userId',
    Component: RootShell,
  },
  {
    path: '/article/:articleId',
    Component: RootShell,
  },
  {
    path: '*',
    Component: RootShell,
  },
]);

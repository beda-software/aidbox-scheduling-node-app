import { Navigate, useRoutes } from 'react-router-dom';
import { useStore } from 'effector-react';
import LoginPage from '../pages/login/index';
import AdminPage from '../pages/admin/index';
import Layout from '../layouts/apps';
import SmartApps from '../pages/patient-page';
import { RoleSwitch } from '../components/RoleSwitch';
import { UserRole } from '../services/role';
import { $token, $user } from '../models/auth';
import { getIn } from '../lib/tools';
import Profile from '../pages/patient-page/ui/profile';
import PatientProfilePage from '../pages/admin/ui/patientProfile';

/* const Profile = () => {
  return (
    <RoleSwitch>
      {{
        [UserRole.Patient]: () => <div>Patient Profile</div>,
        [UserRole.Practitioner]: () => <div>Practitioner profile</div>,
      }}
    </RoleSwitch>
  );
}; */

const Settings = () => <div>Settings</div>;
const PracSettings = () => <div>Prac Settings</div>;

const routesByRole = {
  patient: [
    {
      element: <Layout role="patient" />,
      children: [
        { path: 'smart-apps', element: <SmartApps /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
    { path: '*', element: <Navigate to="/smart-apps" /> },
  ],
  admin: [
    {
      element: <Layout role="admin" />,
      children: [
        { path: 'patients', element: <AdminPage /> },
        { path: 'patients/:id', element: <PatientProfilePage /> },
      ],
    },
    { path: '*', element: <Navigate to="/patients" /> },
  ],
  practitioner: [
    {
      element: <Layout role="practitioner" />,
      children: [
        // { path: 'practitioner-profile', element: <Profile /> },
        { path: 'practitioner-settings', element: <PracSettings /> },
      ],
    },
  ],
};

type RoutesByRole = 'patient' | 'admin' | 'practitioner';

const loginRoutes = [
  {
    element: <LoginPage />,
    path: 'login',
  },
  { path: '*', element: <Navigate to="/login" /> },
];

const Router = ({ routes }: any) => {
  const main = useRoutes(routes);
  return main;
};

export const AppRouter = () => {
  const user = useStore($user);
  const token = useStore($token);
  if (!token) {
    return <Router routes={loginRoutes} />;
  }
  const status: 'loading' | 'done' | 'idle' = user.status;
  const main = {
    idle: () => (token ? <div>Idle loading...</div> : <Router routes={loginRoutes} />),
    done: () => {
      const role: RoutesByRole = getIn(user, ['data', 'role', 0, 'name']);
      const routes = role ? routesByRole[role] : loginRoutes;
      return <Router routes={routes} />;
    },
    loading: () => <div>Loading...</div>,
  }[status];

  return main();
};

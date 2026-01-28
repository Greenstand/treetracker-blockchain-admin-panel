import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/dashboard/AdminDashboard';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isAuthenticated, currentUser, loginError, login, logout, setLoginError } = useAuth();

  const handleLogin = async (credentials, resetPassword) => {
    const result = await login(credentials);
    if (!result.success) {
      resetPassword();
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onSubmit={handleLogin} loginError={loginError} clearError={() => setLoginError('')} />;
  }

  return <AdminDashboard currentUser={currentUser} onLogout={logout} />;
};

export default App;

import Auth from '../components/auth/Auth';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (data: { username: string; password: string }) => {
    await login(data.username, data.password);
    navigate('/');
  };

  return (
    <div className="field-guide">
      <Auth isLogin={true} onSubmit={handleLogin} onNavigate={() => navigate('/signup')} />
    </div>
  );
}

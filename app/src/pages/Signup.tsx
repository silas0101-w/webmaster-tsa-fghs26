import Auth from '../components/auth/Auth';
import { apiRequest } from '../lib/api';
import { useNavigate } from 'react-router';

export default function Signup() {
  const navigate = useNavigate();
  const handleSignup = async (data: { username: string; password: string }) => {
    await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    navigate('/login');
  };

  return (
    <div className="field-guide">
      <Auth isLogin={false} onSubmit={handleSignup} onNavigate={() => navigate('/login')} />
    </div>
  );
}

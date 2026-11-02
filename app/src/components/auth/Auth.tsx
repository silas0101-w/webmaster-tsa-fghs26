import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../../lib/utils';

interface AuthProps {
  isLogin?: boolean;
  onSubmit: (data: { username: string; password: string }) => Promise<void>;
  onNavigate?: () => void;
  onBack?: () => void;
}

export default function Auth({ isLogin = true, onSubmit, onNavigate, onBack }: AuthProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await onSubmit({ username, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button
          type="button"
          className="auth-back"
          onClick={handleBack}
          aria-label="Back to previous page"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <div className="auth-header">
          <h1 className={cn(isLogin ? "auth-title-login" : "auth-title-signup")}>
            {isLogin ? 'Welcome Back' : 'Join the Guide'}
          </h1>
          <p className="auth-subtitle">
            {isLogin ? 'Log in to continue your journey.' : 'Create your student account to save progress.'}
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
              <button
                type="button"
                className="password-toggle-button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setShowPassword(true);
                  try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { void err; }
                }}
                onPointerUp={() => setShowPassword(false)}
                onPointerCancel={() => setShowPassword(false)}
                onLostPointerCapture={() => setShowPassword(false)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowPassword(true);
                }}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                onMouseOut={() => setShowPassword(false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setShowPassword(true);
                }}
                onTouchEnd={() => setShowPassword(false)}
                onTouchCancel={() => setShowPassword(false)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    setShowPassword(true);
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    setShowPassword(false);
                  }
                }}
                onBlur={() => setShowPassword(false)}
                onContextMenu={(e) => e.preventDefault()}
                aria-label="Hold to show password"
                title="Hold to show password"
                disabled={isLoading}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" className="auth-toggle" onClick={onNavigate}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      
      // Check if user has admin or staff role
      if (response.user.role !== 'admin' && response.user.role !== 'staff') {
        throw new Error('Access denied. Admin or staff role required.');
      }
      
      // Store token and user data
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
      
      // Update auth context
      authLogin(response.user, response.token);
      
      // Show success message
      showSuccess('Welcome back!');
      
      // Navigate to dashboard
      navigate('/');
    } catch (err: any) {
      showError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-surface to-dark flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float-gentle" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Logo and title */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl shadow-glow-primary mb-6 animate-float-gentle">
            <span className="text-white font-bold text-3xl">EC</span>
          </div>
          <h1 className="text-4xl font-bold text-text mb-2">Election Cart</h1>
          <h2 className="text-2xl font-semibold text-text-muted">Admin Panel</h2>
          <p className="mt-4 text-text-muted">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login card */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="animate-fade-in-up" glowOnHover>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="appearance-none block w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-glow-primary/0 focus:shadow-glow-primary"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="appearance-none block w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-glow-primary/0 focus:shadow-glow-primary"
                  disabled={loading}
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-dark-border">
              <p className="text-xs text-center text-text-muted">
                Admin and staff access only
              </p>
              <div className="mt-4 text-xs text-center text-text-muted/70">
                <p>Test Credentials:</p>
                <p className="mt-1">Admin: admin / admin123</p>
                <p>Staff: staff / staff123</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

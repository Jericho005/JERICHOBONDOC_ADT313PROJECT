import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((prevState) => !prevState);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    if (type === 'email') {
      setEmail(event.target.value);
    } else if (type === 'password') {
      setPassword(event.target.value);
    }
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus('loading');

    try {
      const response = await axios.post('/user/login', data, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });

      localStorage.setItem('accessToken', response.data.access_token);
      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Login failed!');
    } finally {
      setStatus('idle');
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  const handleSubmit = () => {
    if (status === 'loading') return;

    if (email && password) {
      setStatus('loading');
      setTimeout(() => {
        handleLogin();
      }, 2000);
    } else {
      setIsFieldsDirty(true);
      if (email === '') emailRef.current.focus();
      if (password === '') passwordRef.current.focus();
    }
  };

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Sign In Account</h3>
        <form>
          <div className="form-container">
            <div>
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="text"
                  name="email"
                  ref={emailRef}
                  value={email}
                  onChange={(e) => handleOnChange(e, 'email')}
                />
              </div>
              {debounceState && isFieldsDirty && !email && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  name="password"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => handleOnChange(e, 'password')}
                />
              </div>
              {debounceState && isFieldsDirty && !password && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className="submit-container">
              <button
                className="btn-primary"
                type="button"
                disabled={status === 'loading'}
                onClick={handleSubmit}
              >
                {status === 'idle' ? 'Login' : 'Loading...'}
              </button>
            </div>

            <div className="register-container">
              <small>Don't have an account? </small>
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
    setIsLoggedIn(!!accessToken);
  }, [accessToken, navigate]);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a 
                href="/main/dashboard" 
                style={{
                  color: isLoggedIn ? 'gray' : '#ccc',
                  pointerEvents: isLoggedIn ? 'auto' : 'none'
                }}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a href='/main/movies'>Movies</a>
            </li>
            <li className='logout'>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = (WrappedComponent) => {
  const RedirectComponent = (props) => {

    const navigate = useNavigate();
    
    useEffect(() => {
      const hasToken = localStorage.getItem('loginToken');

      if (!hasToken) {
        navigate('/login');
      }
    }, [navigate]);
    
    return <WrappedComponent {...props} />;
  };

  return RedirectComponent;
};

export default AuthRedirect;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = (WrappedComponent) => {
  const RedirectComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      // Check for the presence of the login token
      const hasToken = localStorage.getItem('loginToken');
      // If the token is not present, redirect to the login page
      if (!hasToken) {
        navigate('/login');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };

  return RedirectComponent;
};

export default AuthRedirect;

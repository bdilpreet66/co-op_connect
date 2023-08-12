import React, { useEffect } from 'react';
import Navigation from './src/Navigation';

export default function App() {
  useEffect(() => {
    // Checking login status and user role from storage or API
    // setLoggedIn(true);
    // setManager(true);
  }, []);

  return <Navigation />;
}
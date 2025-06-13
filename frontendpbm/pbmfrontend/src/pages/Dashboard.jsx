import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Dashboard - Bem-vindo(a), {user?.name}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default Dashboard;
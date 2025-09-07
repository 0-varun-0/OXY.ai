import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        {/* Add routes for Login, etc. here later */}
      </Routes>
    </MainLayout>
  );
};

export default App;
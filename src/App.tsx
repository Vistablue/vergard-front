import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import ItemDetailPage from './pages/ItemDetailPage';
import QuizPage from './pages/QuizPage';
import RankingPage from './pages/RankingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
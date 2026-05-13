import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import DiaryPage from './pages/DiaryPage';
import MyDreamsPage from './pages/MyDreamsPage';
import AnalysisPage from './pages/AnalysisPage';
import CalendarPage from './pages/CalendarPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">&#127769; 梦境日记</div>
          <div className="nav-links">
            <NavLink to="/" end>写日记</NavLink>
            <NavLink to="/dreams">我的梦境</NavLink>
            <NavLink to="/analysis">数据分析</NavLink>
            <NavLink to="/calendar">日历</NavLink>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DiaryPage />} />
            <Route path="/dreams" element={<MyDreamsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

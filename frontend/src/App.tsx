import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PlaceRecPage from './pages/PlaceRecPage';
import ManageGuidePage from './pages/ManageGuidePage';
import FineDustSwitcher from './pages/Statics/FineDustSwitcher';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/placerec" element={<PlaceRecPage />} />
                <Route path="/manageguide" element={<ManageGuidePage />} />
                <Route path="/stats" element={<FineDustSwitcher />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
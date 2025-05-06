import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PlaceRecPage from './pages/PlaceRecPage';
import ManageGuidePage from './pages/ManageGuidePage';
import FineDustStats from './pages/FineDustStats';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/placerec" element={<PlaceRecPage />} />
                <Route path="/manageguide" element={<ManageGuidePage />} />
                <Route path="/stats" element={<FineDustStats />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
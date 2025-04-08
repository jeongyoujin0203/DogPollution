import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FineDustPage from './pages/FineDustPage';
import PlaceRecPage from './pages/PlaceRecPage';
import ManageGuidePage from './pages/ManageGuidePage';
import TodayRecPage from './pages/TodayRecPage'
import FineDustImpactPage from './pages/FineDustImpactPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/finedust" element={<FineDustPage />} />
                <Route path="/placerec" element={<PlaceRecPage />} />
                <Route path="/manageguide" element={<ManageGuidePage />} />
                <Route path="/todayrec" element={<TodayRecPage />} />
                <Route path="/finedustimpact" element={<FineDustImpactPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
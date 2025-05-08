import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SeasonalChartPage from './pages/SeasonalChartPage';
import FineDustSwitcher from './pages/FineDustSwitcher';
import Header from "./components/Header";

function App() {
    return (
        <BrowserRouter>
            <div className="w-full min-h-screen flex flex-col">
                <Header />
                {/* Header 높이만큼 패딩, 나머지는 flex-grow로 채움 */}
                <div className="flex-grow pt-20 px-0">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/stats" element={<FineDustSwitcher />} />
                        <Route path="/placerec" element={<SeasonalChartPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;

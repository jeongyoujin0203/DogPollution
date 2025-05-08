import React, { useState } from "react";
import YearlyFineDustPage from "./FineDustPage_yearly";
import MonthlyFineDustPage from "./FineDustPage_monthly";
import DailyFineDustPage from "./FineDustPage_Daily";

const FineDustSwitcher = () => {
    const [selectedView, setSelectedView] = useState<"yearly" | "monthly" | "daily">("monthly");

    const renderComponent = () => {
        switch (selectedView) {
            case "yearly":
                return <YearlyFineDustPage />;
            case "monthly":
                return <MonthlyFineDustPage />;
            case "daily":
                return <DailyFineDustPage />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4">
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setSelectedView("yearly")}
                    className={`px-4 py-2 rounded-md ${
                        selectedView === "yearly" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    연도별
                </button>
                <button
                    onClick={() => setSelectedView("monthly")}
                    className={`px-4 py-2 rounded-md ${
                        selectedView === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    월별
                </button>
                <button
                    onClick={() => setSelectedView("daily")}
                    className={`px-4 py-2 rounded-md ${
                        selectedView === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    일별
                </button>
            </div>

            {renderComponent()}
        </div>
    );
};

export default FineDustSwitcher;

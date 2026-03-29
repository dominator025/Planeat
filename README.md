# 🍽️ Planeat - Smart Food Waste Management Platform

Planeat is a modernized, data-driven platform designed for institutions (universities, hostels, cafeterias) to optimize food preparation, predict customer demand, and minimize waste through real-time analytics and staff collaboration.

## 🚀 Features

-   **🔍 AI Demand Forecasting**: Predicts daily customer footfall based on day-of-week, weather conditions, and special events (Exams, Festivals, etc.).
-   **🍱 Menu Optimization**: Suggests cooking quantities for menu items, allowing staff to input real preparation amounts and highlighting overproduction risks.
-   **📊 Reports & Analytics**: Real-time waste tracking, financial impact analysis, and CO₂ savings reports with 7/30/90-day filters.
-   **⚙️ Institution Settings**: Persistent configuration of campus details and notification preferences.
-   **🔐 Secure Access**: Comprehensive Authentication and Authorization system for administrators and staff.

## 🛠️ Technology Stack

-   **Frontend**: React + Vite + Vanilla CSS (Glassmorphism & Modern UI)
-   **Backend**: Node.js + Express
-   **Database**: SQLite (Self-contained persistence)
-   **Charts**: Recharts
-   **Icons**: Lucide-React

## 📦 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16+)
-   [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dominator025/Planeat.git
   cd Planeat
   ```

2. Install dependencies for both client and server:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

The application will run the **Express Server on port 5000** and the **Vite Client on port 5173**.

## 📖 How it Works

1.  **Forecast**: Start by entering the day's parameters in the **Forecasting** page to generate a neural demand prediction.
2.  **Plan**: Go to **Menu Optimization** to see the AI-suggested cooking quantities. Adjust based on kitchen constraints and "Confirm Plan" to save.
3.  **Track**: Visit the **Dashboard** and **Reports** to see your institutional waste trends improve over time!

---

Developed with ❤️ for a Zero-Waste Future.

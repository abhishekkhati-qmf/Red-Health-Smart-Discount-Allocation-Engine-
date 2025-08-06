# Red Health Smart Discount Allocation Engine
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/abhishekkhati-qmf/Red-Health-Smart-Discount-Allocation-Engine-)

This repository contains the source code for the Smart Discount Allocation Engine, a web application designed to help managers intelligently and fairly distribute a discount budget among sales agents. The tool uses a weighted algorithm based on multiple performance indicators to ensure that the allocation is data-driven, transparent, and aligned with business goals.

The application provides a clean, interactive interface for inputting a total budget, managing a list of sales agents with their performance data, and instantly calculating the optimal distribution of funds.

## Features

-   **Dynamic Budget Configuration:** Set the total available discount budget that needs to be distributed.
-   **Full Agent Management:** Easily add, remove, and edit sales agent profiles and their metrics on the fly.
-   **Multi-Factor Evaluation:** Allocations are based on a comprehensive set of metrics for a holistic assessment:
    -   **Performance Score** (0-100)
    -   **Seniority** (in months)
    -   **Target Achievement** (%)
    -   **Number of Active Clients**
-   **Weighted Allocation Algorithm:** A transparent weighting system determines the importance of each metric in the final calculation.
-   **Instant Calculation & Results:** View the allocated discount for each agent, the percentage of the total budget they receive, and a brief justification for the allocation decision.
-   **Dashboard Summary:** Get a quick overview of the total budget, the total allocated amount, and the remaining balance.
-   **Export to JSON:** Download the final allocation results in JSON format for record-keeping or further analysis.
-   **Responsive Interface:** A clean and modern UI built with Tailwind CSS that works seamlessly across all screen sizes.

## How the Allocation Works

The core of the engine is a multi-step calculation process designed for fairness and accuracy:

1.  **Normalization:** To compare different metrics (e.g., a score out of 100 vs. seniority in months), the engine first normalizes each agent's metrics to a common scale (0 to 1). This ensures that no single metric with a large range disproportionately affects the outcome.

2.  **Weighted Composite Score:** A composite score is calculated for each agent by applying predefined weights to their normalized metrics. The current weights are:
    -   `Performance Score`: 35%
    -   `Target Achievement`: 30%
    -   `Seniority`: 20%
    -   `Active Clients`: 15%

3.  **Proportional Distribution:** The total discount budget is then distributed among the agents in proportion to their individual composite scores. Agents with higher composite scores receive a larger share of the budget.

## Technology Stack

-   **Frontend:** React.js
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Icons:** Lucide React
-   **Language:** JavaScript (JSX) & TypeScript (for configuration)
-   **Linting:** ESLint

## Getting Started

To run this project locally, follow these steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or a compatible package manager (Yarn, pnpm)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/abhishekkhati-qmf/Red-Health-Smart-Discount-Allocation-Engine-.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd Red-Health-Smart-Discount-Allocation-Engine-
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Start the development server:**
    ```sh
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:5173` (or the URL provided by Vite in your terminal).

## Available Scripts

In the project directory, you can run the following commands:

-   `npm run dev`: Runs the app in development mode with hot-reloading.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Serves the production build locally to preview the final app.
-   `npm run lint`: Lints the source files using ESLint.

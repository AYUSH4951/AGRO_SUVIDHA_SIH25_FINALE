# Agro Suvidha – Smart Crop Advisory System  
**This project was designed and developed by Team BLACK SYNTEX during the Smart India Hackathon (SIH) 2025 Grand Finale, focusing on scalable, inclusive, and technology-driven agricultural solutions**

---

## Problem Statement

**Title:** Smart Crop Advisory System for Small and Marginal Farmers  
**Problem Statement ID:** 25010  

Small and marginal farmers face persistent challenges due to unpredictable weather, pest infestations, poor soil health, lack of localized advisory services, and limited access to real-time market information. The absence of integrated, multilingual, and AI-driven decision support systems results in reduced crop productivity, increased financial risk, and inefficient resource utilization.

There is a critical need for a unified digital platform that can provide real-time, location-specific, and crop-specific advisories using Artificial Intelligence and Machine Learning. Such a system must be accessible, scalable, multilingual, and capable of operating on low-end devices to ensure inclusivity and impact at the grassroots level.

---

## Project Overview

Agro Suvidha is an AI-powered Progressive Web Application (PWA) developed during the **Smart India Hackathon (SIH) 2025 Grand Finale** by **Team BLACK SYNTEX**.  
The platform addresses Problem Statement ID **25010** by delivering intelligent agricultural assistance through AI-based advisory services, computer vision models, real-time weather intelligence, and market data integration.

The application supports farmers across the complete crop lifecycle, from planning and sowing to harvesting and market decision-making.

---

## Solution Approach

The proposed solution integrates Artificial Intelligence, Machine Learning, and real-time data services into a single farmer-centric platform.

- AI-powered multilingual advisory system
- Image-based pest detection using computer vision
- Soil health and fertilizer recommendation engine
- Weather-based alerts and advisories
- Market price monitoring and insights
- Progressive Web App architecture for accessibility and offline support

---

## Key Features

- **Multilingual AI Chatbot**
  - Powered by Google Gemini API
  - Supports multiple Indian languages
  - Provides crop, weather, pest, and fertilizer guidance

- **AI Pest Detector**
  - Image-based pest identification
  - Implemented using TensorFlow and OpenCV
  - Provides pest classification and control measures

- **Fertilizer and Soil Health Guide**
  - Crop-specific fertilizer recommendations
  - Soil health insights for sustainable agriculture

- **Market Price Tracking**
  - Real-time crop market prices
  - Enables informed selling decisions

- **Weather-Based Alerts**
  - Live weather data and forecasts
  - Extreme weather warnings
  - Crop-specific advisory generation

- **Progressive Web App (PWA)**
  - Installable across devices
  - Offline functionality for critical features
  - Fast and responsive user experience

---

## Technology Stack

### Frontend
- React.js
- Vite
- HTML5
- CSS3
- JavaScript
- Progressive Web App (PWA)

### Backend and APIs
- Google Gemini API
- OpenWeather API
- Location / Geocoding API

### Machine Learning and AI
- Scikit-learn
- TensorFlow
- OpenCV

### Database
- MongoDB

### Authentication and Services
- Firebase Authentication
- Firebase SDK

---

## Project Directory Structure

FINALE_SIH_2025/
│
├── .env                          # Environment variables
├── .env.local.example            # Sample environment configuration
├── .gitignore                    # Git ignored files
├── README.md                     # Project documentation
│
├── public/                       # Public assets
│
├── src/                          # Application source code
│   ├── assets/                   # Images, icons, static assets
│   ├── components/               # Reusable React components
│   ├── context/                  # Global state and language context
│   ├── pages/                    # Application pages
│   ├── styles/                   # CSS stylesheets
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│
├── components/                   # Shared UI components
│
├── firebase/                     # Firebase configuration
│
├── dist/                         # Production build output
│
├── node_modules/                 # Project dependencies
│
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Dependency lock file
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint configuration
└── index.html                    # Main HTML file

---

## Machine Learning Models

- **Pest Detection Model**
  - Image classification using TensorFlow and OpenCV
  - Detects common crop pests and diseases
  - Provides actionable recommendations

- **Decision Support Models**
  - Developed using Scikit-learn
  - Used for advisory logic and predictions

---

## APIs Used

- Google Gemini API  
- OpenWeather API  
- Location / Geocoding API  

---

## Installation and Setup

1. Clone the repository
   ```bash
   git clone <repository-url>

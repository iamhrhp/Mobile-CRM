# Mobile-CRM

A sleek, professional Mobile CRM application built with React Native. It features dynamic and beautifully animated data visualizations for Revenue Growth, Conversion Rates, Total Leads, Client Insights, and Pipeline Management.

## Features
- **Dynamic Dashboards**: Interactive charts using `react-native-svg` to display pie charts and smooth line graphs.
- **Time Filtering**: View data dynamically shifted by selecting specific months or the entire year with fluid scale and fade animations.
- **Beautiful UI/UX**: Custom themed application mimicking top-tier enterprise dashboard aesthetics with smooth transitions.
- **Multi-language Support**: Fully integrated with `react-i18next`.

## Prerequisites

Before you run the app, make sure you have your local environment set up for React Native development:
- **Node.js**: (v18 or newer recommended)
- **Ruby**: For iOS CocoaPods
- **Watchman**: Recommended for macOS users
- **Xcode**: To run the iOS simulator
- **Android Studio**: To run the Android emulator

*If you haven't set up your environment yet, follow the official [React Native CLI Environment Setup guide](https://reactnative.dev/docs/environment-setup).*

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamhrhp/Mobile-CRM.git
   cd Mobile-CRM
   ```

2. **Install JavaScript dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the Application

### Step 1: Start the Metro Bundler
First, you will need to start Metro, the JavaScript bundler that ships with React Native.
```bash
npm run start
```

### Step 2: Run the App on a Simulator/Device

Open a new terminal window inside your project folder and run one of the following commands:

**For Android:**
Make sure you have an Android emulator running, or an Android device connected via USB with debugging enabled.
```bash
npm run android
```

**For iOS (macOS only):**
This will automatically launch the default iPhone simulator via Xcode.
```bash
npm run ios
```

## Technologies Used
- React Native
- React Native SVG (for Charts)
- React i18next (Internationalization)
- React Native Maps
- React Native Async Storage



<img width="1206" height="2622" alt="Screenshot iPhone 17 Pro 27-09-2026 at 4 45 30 PM" src="https://github.com/user-attachments/assets/fd046a8f-627a-4335-9719-869b8d78a41f" />
<img width="1206" height="2622" alt="Screenshot iPhone 17 Pro 27-09-2026 at 4 45 26 PM" src="https://github.com/user-attachments/assets/01a6c7d0-2bb4-49e2-9885-86dc1ef96280" />
<img width="1206" height="2622" alt="Screenshot iPhone 17 Pro 27-09-2026 at 4 45 22 PM" src="https://github.com/user-attachments/assets/0a087728-03d0-4e5f-bb3d-3e418279206c" />
<img width="1206" height="2622" alt="Screenshot iPhone 17 Pro 27-09-2026 at 4 45 20 PM" src="https://github.com/user-attachments/assets/6c72f3a3-c05f-4613-9c1f-0aabaa17d09b" />
<img width="1206" height="2622" alt="Screenshot iPhone 17 Pro 27-09-2026 at 4 45 05 PM" src="https://github.com/user-attachments/assets/f88a88e2-03a7-4b56-9c68-acb5f7a5c7ea" />


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

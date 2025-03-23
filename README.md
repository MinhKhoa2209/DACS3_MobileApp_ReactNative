# My Mobile App Project

This is a mobile application built with **Expo**, **React Native**, **Appwrite**, **TypeScript**, and **Tailwind CSS**.

## Technologies Used

- **Expo**: A framework for developing React Native applications with ease.
- **React Native**: A framework for building native apps using React.
- **Appwrite**: A backend-as-a-service platform for authentication, database, and storage.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for styling.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (LTS version recommended)
- **npm** or **yarn**
- **Expo CLI** (Install globally using `npm install -g expo-cli`)
- **Appwrite Server** (If running locally, follow the [Appwrite installation guide](https://appwrite.io/docs))
- **Android Studio** (for Android emulator) or **Xcode** (for iOS simulator)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your Appwrite configuration:

```bash
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_ENDPOINT=https://your-appwrite-server.com/v1
APPWRITE_API_KEY=your_api_key
```

### 4. Start the Project

Run the Expo development server:

```bash
npx expo start
```

You will see options to:
- Open the app in a **development build**
- Run on an **Android emulator**
- Run on an **iOS simulator**
- Use **Expo Go** for testing on a physical device

### 5. Running on a Device or Emulator

- **On a physical device:**
  - Install the **Expo Go** app from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779)
  - Scan the QR code displayed in the terminal or web interface

- **On an emulator/simulator:**
  - Open **Android Studio** or **Xcode**
  - Ensure a virtual device is running
  - Select the emulator option from the Expo CLI menu

### 6. Reset the Project (if needed)

To start fresh, run:

```bash
npm run reset-project
```

This will move the starter code to the `app-example` directory and create a blank `app` directory for development.

## Project Structure

The project follows a modular and scalable structure:

```
├── app/                 # Main application files
│   ├── screens/         # Screen components
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom hooks
│   ├── services/        # API service handlers
│   ├── navigation/      # Navigation setup
│   ├── styles/          # Global styles (Tailwind CSS)
├── assets/              # Static assets (images, icons, etc.)
├── constants/           # Constant values and configurations
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Learn More

For more details on the technologies used:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Appwrite Documentation](https://appwrite.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Community & Support

- [Expo GitHub](https://github.com/expo/expo)
- [React Native GitHub](https://github.com/facebook/react-native)
- [Appwrite GitHub](https://github.com/appwrite/appwrite)
- [Expo Discord](https://chat.expo.dev)

Happy coding! 🚀


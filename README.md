# BlueOceanWhale - WhatsApp-Style Messenger

## Overview

BlueOceanWhale is a modern chat application inspired by WhatsApp. Built with **React**, **TypeScript**, and **Firebase**, it offers real-time communication with a clean and intuitive user interface.

## Features

- **Real-Time Messaging**: Instantly send and receive messages.
- **User Authentication**: Secure login via email/password, Google, or Facebook.
- **Private & Group Chats**: Connect with individuals or groups.
- **Profile Management**: Personalize display names and profile photos.
- **Theme Customization**: Switch between light and dark mode.
- **Firebase-Powered Backend**: Comprehensive backend integration for authentication, database, and storage.

## Technologies Used

- **React**: For building interactive user interfaces.
- **TypeScript**: For type-safe, maintainable code.
- **Vite**: A fast build tool for modern web applications.
- **Tailwind CSS**: For responsive and utility-first styling.
- **Firebase**: Provides backend functionality like authentication and databases.
- **Lucide React**: Icon library for React.
- **React Hot Toast**: Elegant toast notifications.
- **React Router DOM**: Routing for seamless navigation.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/)).
- **npm**: The default package manager for Node.js.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kundan12218014/blueOceanWhale.git
   cd blueOceanWhale
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration

### Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable the following:
   - Authentication methods: Email/Password, Google, and Facebook.
   - Firestore database in test mode.
   - Storage bucket.
3. Obtain your Firebase configuration object.

### Environment Variables

Create a `.env.local` file in the project root and add your Firebase configuration:
```dotenv
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"
VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
```
Replace the placeholder values with your actual Firebase configuration.

## Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open the app in your browser (e.g., `http://localhost:5173`).

## Building for Production

To build the app:
```bash
npm run build
```
The optimized build will be in the `dist` directory.

## Firebase Deployment

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase**:
   ```bash
   firebase init
   ```

4. **Deploy to Firebase Hosting**:
   ```bash
   firebase deploy --only hosting
   ```

### Firestore Indexes

Deploy Firestore indexes:
```bash
firebase deploy --only firestore:indexes
```

## Running the Application with Docker

You can run the application using Docker to avoid installing dependencies manually. Follow these steps:

### Build the Docker Image

1. Clone the repository:
   ```bash
   git clone https://github.com/Kundan12218014/blueOceanWhale.git
   cd blueOceanWhale
   ```

2. Build the Docker image:
   ```bash
   docker build -t blueoceanwhale .
   ```

### Run the Docker Container

1. Start the container:
   ```bash
   docker run -p 8080:80 blueoceanwhale
   ```

2. Open the application in your browser:
   ```
   http://localhost:8080
   ```

This will serve the built application using an Nginx server.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository: [BlueOceanWhale Repository](https://github.com/Kundan12218014/blueOceanWhale).
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

## License

This project is licensed under the [MIT License](https://github.com/Kundan12218014/blueOceanWhale/blob/main/LICENSE).

---

Feel free to reach out if you have any questions or suggestions for improvement!
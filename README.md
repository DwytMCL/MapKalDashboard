### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/) (for cloning the repository)
- [Firebase](https://firebase.google.com/) (to create a project and obtain credentials)

### Installation

```bash
git clone https://github.com/yourusername/mapkal-dashboard.git
cd mapkal-dashboard
npm install
```

### Environment Setup

Create a `.env` file in the root of the project with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase project credentials.

### Connecting to Firebase

Make sure your Firebase config in the code uses the environment variables from the `.env` file. Example:

```js
// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export default app;
```

### Running Locally

```bash
npm start
```

The app will be available at `http://localhost:3000`.

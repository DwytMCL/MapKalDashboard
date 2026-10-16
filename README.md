# MapKal Dashboard

A React and TypeScript dashboard with Google sign-in and panels for announcements, budget information, project timelines, member activities, and quick links. Firebase supplies authentication and data services; Tailwind CSS provides the interface styling.

## Features

- Google sign-in through Firebase Authentication, with a protected dashboard route.
- Announcement, project, activity, and budget panels.
- Light and dark themes with matching dashboard backgrounds.
- Gmail and Messenger panels that display records from Firestore. Data ingestion for those panels must be supplied separately.

## Run locally

You need Node.js, npm, Git, and a Firebase project. This project uses Create React App through `react-scripts`.

```sh
git clone https://github.com/DwytMCL/MapKalDashboard.git
cd MapKalDashboard
npm ci
```

Create a `.env` file in the repository root with the web app configuration from your Firebase project settings:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Use the storage bucket value shown by your Firebase project; its domain can differ between projects. The configuration is read in [`src/lib/firebase.ts`](src/lib/firebase.ts).

The Realtime Database `databaseURL` is currently hardcoded in that file. Replace it with the database URL shown in your own Firebase console. Changing `.env` alone does not replace this URL.

In Firebase, enable Google as an Authentication sign-in provider and authorize `localhost` for local development. Configure Realtime Database, Cloud Firestore, and Storage for the data services the app initializes, including access rules appropriate to your project. The repository does not provision these Firebase resources or populate your data.

```sh
npm start
```

Open `http://localhost:3000`. Restart the development server after changing `.env` values.

## Developer commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the development server. |
| `npm run build` | Produce the production bundle in `build/`. |
| `npm test` | Run the configured React test runner. |

## Source map

- [`src/App.tsx`](src/App.tsx) — application routes and the protected dashboard.
- [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx) — Google sign-in, sign-out, and authentication state.
- [`src/context/ThemeContext.tsx`](src/context/ThemeContext.tsx) — light/dark theme state.
- [`src/pages/Dashboard.tsx`](src/pages/Dashboard.tsx) — dashboard composition.
- [`src/components/`](src/components/) — individual panels and interface components.
- [`src/lib/firebase.ts`](src/lib/firebase.ts) — Firebase initialization and exported services.

## Configuration notes

Google sign-in requires your own Firebase configuration. The Gmail and Messenger panels read Firestore data; signing in alone does not connect external inboxes. Review the URLs in `BudgetCard.tsx` and `QuickLinks.tsx` before reusing the dashboard for another group.

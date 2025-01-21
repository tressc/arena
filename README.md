# Arena

Arena is a web application where users can play digital board games with each other. Compete with friends and strangers around the world!

## Features

- [x] Sign in with email/password or via Google
- [ ] Create new or join existing games
- [ ] Seamless gameplay
- [ ] View past game records
- [ ] Track your progress in monthly rankings

## Technology

Arena leverages the following technology:

- Firebase for authentication and persistent storage
- Socket.io for realtime user interactions
- Vercel for hosting
- Next.js framework
- Tailwind CSS
- React 19
- TypeScript

## Local Development

This project uses Firebase for authentication and persistant storage. If you would like to run this project locally, you will first need to initialize a Firebase project following [this guide](https://firebase.google.com/docs/web/setup).

Once initialized, from the Firebase project dashboard, enable `Email/Password` and `Google` Sign-in providers under `Authentication > Sign-in methods`. Further, add a database and create a collection called `users` under `Firestore Database > Data`.

Create a `.env` file the root project directory and add the following environment variables. Replace the `***`'s with values copied from your personal Firebase project dashboard under `Project Overview > General` and `Project Overview > Service Accounts`.

```
# client app config
NEXT_PUBLIC_FIREBASE_API_KEY=***
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=***
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=***
NEXT_PUBLIC_FIREBASE_APP_ID=***
NEXT_PUBLIC_FIREBASE_MEAESUREMENT_ID=***

# service account config
NEXT_PUBLIC_FIREBASE_TYPE=***
NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID=***
NEXT_PUBLIC_FIREBASE_PRIVATE_KEY=***
NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL=***
NEXT_PUBLIC_FIREBASE_CLIENT_ID=***
NEXT_PUBLIC_FIREBASE_AUTH_URI=***
NEXT_PUBLIC_FIREBASE_TOKEN_URI=***
NEXT_PUBLIC_FIREBASE_AUTH_CERT_URL=***
NEXT_PUBLIC_FIREBASE_CLIENT_CERT_URL=***
NEXT_PUBLIC_FIREBASE_UNIVERSE_DOMAIN=***
```

Finally, install packages and run the development server:

```bash
npm i && npm run dev
# or
yarn i && yarn dev
# or
pnpm i && pnpm dev
# or
bun i && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

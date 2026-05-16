# 🦊 PetVerse AI | The Future of Pet Care

Welcome to **PetVerse AI**, a premium, futuristic pet care platform designed for the modern pet parent. Powered by advanced AI, interactive 3D companions, and real-time health analytics, PetVerse AI transforms how you care for your furry friends.

![PetVerse AI Dashboard Mockup](https://via.placeholder.com/1200x600?text=PetVerse+AI+Premium+Dashboard)

## ✨ Core Features

- **🐾 Mishri AI Mascot**: A multimodal, genius-level 3D fox companion that listens, speaks, and analyzes your pet's needs through vision and voice.
- **📊 Intelligence Dashboard**: Real-time tracking of activity goals, vaccination schedules, and AI-generated health reports.
- **🛍️ Smart Marketplace**: Curated premium pet products recommended by AI based on your pet's specific profile and health data.
- **🚑 Emergency SOS**: Instant access to nearby veterinary hospitals and emergency protocols with one-tap navigation.
- **🎮 Interactive 3D Companion**: A floating AI "brain" that follows your cursor and reacts to your interactions using Three.js.

## 🚀 Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Backend**: Node.js, Express, Sequelize
- **Database**: SQLite (Local) / MySQL (Production ready)
- **AI**: OpenAI GPT-4o (Vision & Chat)
- **Voice**: Web Speech API

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation
Clone the repository and install dependencies for both the frontend and backend.

```bash
# Frontend
cd petverse-ai
npm install

# Backend
cd ../backend
npm install
```

### 3. Environment Setup
Create a `.env` file in the `backend` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
DB_NAME=petverse_db
```

### 4. Running the Application

```bash
# Start Backend (from /backend)
node index.js

# Start Frontend (from /petverse-ai)
npm run dev
```

Visit `http://localhost:3000` to experience the future of pet care.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---
*Built with ❤️ by the PetVerse AI Team.*

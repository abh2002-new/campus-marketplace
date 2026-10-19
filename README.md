# 🎓 Campus Marketplace

A dedicated mobile & web marketplace application built with **React Native (Expo SDK 57)** and **Firebase** tailored for Sri Lankan university students (University of Colombo, University of Moratuwa, University of Peradeniya, University of Sri Jayewardenepura, University of Kelaniya, and more).

Students can buy and sell textbooks, notes, tech gadgets, bicycles, lab gear, and furniture, negotiate prices, schedule safe on-campus meetups, and verify seller trustworthiness.

---

## 👥 Team Members & Feature Division (5 Core Features)

To ensure clear individual contributions and git history across all 5 team members, each member designed and implemented a dedicated feature module:

| Member | Name / Student ID | Feature Assigned | Source File | Description |
|---|---|---|---|---|
| **Member 1** | *[Member 1 Name]* | **Campus Request Board (WTB)** | `src/features/ItemRequestsModal.tsx` | Allows students to post item requests ("Wanted") with campus filters, target budgets, and urgency badges when items aren't listed. |
| **Member 2** | *[Member 2 Name]* | **Price Bargaining & Offers** | `src/features/MakeOfferModal.tsx` | Enables students to negotiate fair prices with quick percentage discount chips (-10%, -15%, -20%), custom offer calculations, and deal notes. |
| **Member 3** | *[Member 3 Name]* | **Safe Campus Meetup Coordinator** | `src/features/MeetupSchedulerModal.tsx` | Designates verified safe meeting zones inside universities (e.g., Library lobby, Central canteen, Security gate) with date/time slot scheduling and safety guidelines. |
| **Member 4** | *[Member 4 Name]* | **Seller Reviews & Trust System** | `src/features/SellerReviewsModal.tsx` | Builds student trust through 5-star ratings, peer testimonials, category breakdown bars, and badges (*Verified Student*, *Fast Responder*). |
| **Member 5** | *[Member 5 Name]* | **Listing Safety & Moderation** | `src/features/ReportListingModal.tsx` | Protects students from scams, prohibited campus property, fake prices, and exam leak violations through structured reporting and anonymous moderation. |

---

## ✨ Features Overview

### 1. 🔍 Browse, Search & Filter by University
- Real-time search across textbooks, notes, tech, fashion, and furniture.
- Filter listings specifically by university campus and price range in LKR.

### 2. 📢 Campus Request Board (Member 1)
- Students can browse active requests from peers or post their own wanted items.
- Filter requests by campus and reach out directly with *"I have this!"*.

### 3. 🤝 Make an Offer / Bargaining (Member 2)
- Fast discount presets or custom price proposals with instant savings calculation.
- Attach quick meetup notes (e.g. *"Can pick up today"*, *"Cash on delivery"*).

### 4. 📍 Designated Safe Campus Meetups (Member 3)
- Campus-specific safe locations:
  - **University of Moratuwa**: Main Library Lobby, L-Block Canteen, Security Gate, Pavilion.
  - **University of Colombo**: Main Library Lawn, Science Canteen, Arts Quadrangle, Reid Ave Gate.
  - **University of Peradeniya**: Central Library Steps, WUS Canteen, Senate Building.
  - **University of Sri Jayewardenepura**: Sumangala Building, Management Canteen, Main Porch.
- Date and time window scheduling with student safety pledge.

### 5. ⭐ Seller Ratings & Trust Badges (Member 4)
- View average stars, verified student badges, and metric satisfaction scores.
- Interactive 5-star review form with instant peer feedback.

### 6. 🛡️ Content Moderation & Scam Shield (Member 5)
- Category-based violation reports (Scam attempt, bait-and-switch price, prohibited campus property, duplicate spam).
- Anonymous moderation queue.

### 7. 💬 Live Buyer-Seller Chat & Saved Items
- Instant peer-to-peer messaging via Cloud Firestore subcollections.
- Save favorite items for quick access.

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo SDK 57 (Expo Router / Web / iOS / Android)
- **Language**: TypeScript 6.0
- **Backend**: Firebase Auth (Google & Anonymous Sign-in), Cloud Firestore, Firebase Storage
- **UI & Icons**: React Native StyleSheet, `@expo/vector-icons` (Ionicons)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.13 or newer
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_ORGANIZATION_OR_USERNAME/campus-marketplace.git
cd campus-marketplace
```

### 2. Configure Environment Variables

Copy the example environment file and add your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY="your-api-key"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

> **Note**: If `.env` is empty, the app runs in demo mode with sample Sri Lankan university listings.

### 3. Install Dependencies & Run

```bash
npm install
npm run web
```

To run on a physical mobile device or emulator:

```bash
npm run android
# or
npm run ios
```

---

## 🔒 Firebase & Security Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** with Google provider (and Anonymous provider for native testing).
3. Create a **Cloud Firestore** database.
4. Enable **Firebase Storage** for listing photos.
5. Deploy security rules:

```bash
firebase deploy --only firestore,storage
```

---

## 📂 Project Architecture

```
campus-marketplace/
├── assets/                    # App icons and splash images
├── src/
│   ├── components/            # Reusable core UI components
│   │   ├── EmptyState.tsx     # Empty list states
│   │   ├── ListingCard.tsx    # Product card with price, campus, actions
│   │   └── PageTitle.tsx      # Header typography
│   ├── features/              # 5 Team Member Feature Modules
│   │   ├── ItemRequestsModal.tsx      # [Member 1] Campus Request Board
│   │   ├── MakeOfferModal.tsx         # [Member 2] Price Bargaining & Offers
│   │   ├── MeetupSchedulerModal.tsx   # [Member 3] Safe Campus Meetup Coordinator
│   │   ├── SellerReviewsModal.tsx     # [Member 4] Seller Ratings & Badges
│   │   └── ReportListingModal.tsx     # [Member 5] Safety & Content Moderation
│   ├── pages/                 # Main App Views
│   │   ├── ExplorePage.tsx    # Discovery, search, and category feed
│   │   ├── MessagesPage.tsx   # Buyer/seller conversation list
│   │   ├── MyListingsPage.tsx # Manage seller items (edit/delete)
│   │   ├── ProfilePage.tsx    # User settings and meetup preference
│   │   └── SavedPage.tsx      # Shortlisted favorite items
│   ├── App.tsx                # Navigation, state management, modal coordinator
│   ├── data.ts                # Seed listings, categories, Sri Lankan universities
│   ├── firebase.ts            # Firebase client initialization
│   └── types.ts               # TypeScript data models and feature types
├── .env.example               # Environment variables template
├── package.json               # Dependencies and build scripts
└── README.md                  # Project documentation & team breakdown
```

---

## 🐙 GitHub Workflow Guide for Team Members

To demonstrate individual GitHub contributions:

### 1. Initialize Git & First Commit (Team Lead)

```bash
git init
git add .
git commit -m "feat: initial campus marketplace baseline with core modules"
git branch -M main
git remote add origin https://github.com/YOUR_TEAM/campus-marketplace.git
git push -u origin main
```

### 2. Feature Branching for Each Member

Each member creates a branch, commits their assigned feature file, and opens a Pull Request:

- **Member 1 (Request Board)**:
  ```bash
  git checkout -b feature/item-requests
  git add src/features/ItemRequestsModal.tsx
  git commit -m "feat(member-1): implement campus wanted and student request board"
  git push origin feature/item-requests
  ```

- **Member 2 (Price Bargaining)**:
  ```bash
  git checkout -b feature/make-offer
  git add src/features/MakeOfferModal.tsx
  git commit -m "feat(member-2): implement price negotiation and offer proposals"
  git push origin feature/make-offer
  ```

- **Member 3 (Safe Meetup)**:
  ```bash
  git checkout -b feature/safe-meetup
  git add src/features/MeetupSchedulerModal.tsx
  git commit -m "feat(member-3): implement safe campus meetup coordinator and locations"
  git push origin feature/safe-meetup
  ```

- **Member 4 (Seller Reviews)**:
  ```bash
  git checkout -b feature/seller-reviews
  git add src/features/SellerReviewsModal.tsx
  git commit -m "feat(member-4): implement seller reviews, star ratings, and trust badges"
  git push origin feature/seller-reviews
  ```

- **Member 5 (Moderation & Report)**:
  ```bash
  git checkout -b feature/report-moderation
  git add src/features/ReportListingModal.tsx
  git commit -m "feat(member-5): implement listing safety, moderation, and scam report system"
  git push origin feature/report-moderation
  ```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

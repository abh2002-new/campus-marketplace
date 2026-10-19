# 🎓 Campus Marketplace - Team Contribution & Feature Division Report

**Project Title**: Campus Marketplace (Sri Lankan University Community)  
**Framework**: React Native (Expo SDK 57) + Cloud Firestore + Firebase Storage  
**Team Size**: 5 Members (Equal 20% Contribution Each)

---

## 📊 Summary of Initial Project vs. Modified Final Project

| Component / Flow | Initial Base Project (`New folder (2)`) | Our Final Modified Project | Key Upgrades |
|---|---|---|---|
| **Campus Localization & Search** | Generic "North/South Campus", basic title search | 17 Sri Lankan Universities + Min/Max LKR Price filter | Realistic campus matching, budget filtering |
| **Messaging & Chat** | Static placeholder with zero chat functionality (`MessagesPage.tsx` was 20 lines) | Live real-time Firestore conversation & subcollection messaging engine | Direct peer-to-peer negotiation & meeting chats |
| **Listing CRUD & Photos** | Could only publish with hardcoded static photo, no edit or delete | Full CRUD: Edit listings, delete with alert, ImagePicker camera roll & Firebase Storage upload | True seller dashboard |
| **Authentication** | Anonymous only / popup | Email & Password signup/login toggle with validation + Google Sign-In | Full student credential management |
| **Campus Wanted (WTB)** | ❌ Not available | ✅ **Student Request Board** (`ItemRequestsModal.tsx`) | Allows requesting unlisted books/notes |
| **Price Negotiation** | ❌ Not available | ✅ **Make an Offer Engine** (`MakeOfferModal.tsx`) | -10%, -15%, -20% quick bargaining |
| **Campus Safety** | ❌ Not available | ✅ **Safe Meetup Coordinator** (`MeetupSchedulerModal.tsx`) | Library/Canteen safe zones & time picker |
| **Trust & Reputation** | ❌ Not available | ✅ **Seller Reviews & Badges** (`SellerReviewsModal.tsx`) | 5-Star reviews, verified student badges |
| **Content Moderation** | ❌ Not available | ✅ **Report & Scam Shield** (`ReportListingModal.tsx`) | Academic leak/counterfeit reporting |

---

## 👥 Detailed 5-Member Work Breakdown

### 👤 Member 1: Campus Discovery & Student Request Board (WTB)
- **Role**: Search, Filtering & Demand-side Request System
- **Files Assigned**:
  - `src/features/ItemRequestsModal.tsx` *(New Dedicated Feature)*
  - `src/pages/ExplorePage.tsx` *(Upgraded)*
  - `src/data.ts` *(University & Category Seed Data)*
- **What Was in Initial Project**:
  - Simple query search, static category list, and generic campus strings.
- **What Member 1 Built & Modified**:
  - **Student Request Board (WTB)**: Created the campus wanted board where students can post items they need with target budget, category, and urgency level (`urgent` vs `normal`).
  - **Campus & Price Filtering**: Implemented Sri Lankan University campus chip selector and Min/Max LKR price range filters.
  - **Interactive Banners**: Integrated the top Explore page banner linking directly to the student request board.
- **Git Branch**: `feature/item-requests`

---

### 👤 Member 2: Live Chat Subsystem & Price Bargaining Engine
- **Role**: Peer-to-Peer Communication & Price Negotiation
- **Files Assigned**:
  - `src/features/MakeOfferModal.tsx` *(New Dedicated Feature)*
  - `src/pages/MessagesPage.tsx` *(Upgraded from empty stub)*
- **What Was in Initial Project**:
  - `MessagesPage.tsx` had only 20 lines of empty placeholder code without any database connectivity.
- **What Member 2 Built & Modified**:
  - **Real-Time Chat Engine**: Built full Firestore conversations query, message subcollections, timestamp sorting, and conversation list rendering.
  - **Make an Offer (Bargaining Flow)**: Created the price negotiation modal with quick discount chips (-5%, -10%, -15%, -20%), instant savings calculation, deal notes, and offer message dispatch to sellers.
  - **Offer State Tracking**: Support for pending/accepted offer structures.
- **Git Branch**: `feature/make-offer`

---

### 👤 Member 3: Listing CRUD, Storage & Safe Campus Meetup Coordinator
- **Role**: Seller Inventory Management & Safe Campus Exchange
- **Files Assigned**:
  - `src/features/MeetupSchedulerModal.tsx` *(New Dedicated Feature)*
  - `src/pages/MyListingsPage.tsx` *(Upgraded)*
  - `src/components/ListingCard.tsx` *(Upgraded with actions)*
- **What Was in Initial Project**:
  - Could only view static listings. No way to edit or delete existing listings. Images were hardcoded to `seedListings[0].image`.
- **What Member 3 Built & Modified**:
  - **Listing CRUD Operations**: Implemented Edit listing pre-fill, Firestore `updateDoc`, and `deleteDoc` with native confirmation alerts.
  - **Photo Upload**: Integrated `expo-image-picker` and Firebase Cloud Storage blob uploads.
  - **Safe Campus Meetup Coordinator**: Built university-specific safe exchange points (Moratuwa, Colombo, Peradeniya, etc.) with date/time slot selection and student safety pledge.
- **Git Branch**: `feature/safe-meetup`

---

### 👤 Member 4: Account Security, Auth & Seller Reputation System
- **Role**: Authentication, Profile Settings & Student Trust
- **Files Assigned**:
  - `src/features/SellerReviewsModal.tsx` *(New Dedicated Feature)*
  - `src/pages/ProfilePage.tsx` *(Upgraded)*
- **What Was in Initial Project**:
  - Only anonymous login was functional natively; basic profile without email credentials.
- **What Member 4 Built & Modified**:
  - **Email/Password Authentication**: Implemented Firebase email & password signup and signin flows with mode toggle and form validation.
  - **Seller Reviews & Reputation**: Created the 5-star student review feed, interactive rating form, metric breakdown bars, and trust badges (*Verified Student*, *Fast Responder*).
  - **Seamless Navigation**: Integrated `← Back to listing` smooth view switching to prevent dual-modal freezing on mobile devices.
- **Git Branch**: `feature/seller-reviews`

---

### 👤 Member 5: Shortlist Management & Content Safety / Moderation
- **Role**: Shortlist Caching, Safety Standards & Scam Defense
- **Files Assigned**:
  - `src/features/ReportListingModal.tsx` *(New Dedicated Feature)*
  - `src/pages/SavedPage.tsx` *(Upgraded)*
  - `src/types.ts` *(Data Models & TypeScript definitions)*
- **What Was in Initial Project**:
  - Basic saved UI without reporting or safety mechanisms. Only basic 12-line `types.ts`.
- **What Member 5 Built & Modified**:
  - **Listing Moderation & Scam Shield**: Implemented the confidential reporting modal with category reasons (Scam attempt, bait price, prohibited/stolen items, pirated exam leaks).
  - **Type Architecture**: Expanded `types.ts` to include strict types for `ItemRequest`, `Offer`, `MeetupPlan`, `SellerReview`, and `ListingReport`.
  - **Saved Items Sync**: Optimized real-time Firestore saved subcollection synchronization with instant heart toggle.
- **Git Branch**: `feature/report-moderation`

---

## 📋 Viva / Evaluation Quick Reference

When evaluating lecturers ask what your team modified from the original project:

1. **Member 1**: *"I upgraded the exploration system with Sri Lankan campus filters and built the Student Request Board (WTB) so students can ask for unlisted course materials."*
2. **Member 2**: *"I transformed the static Messages placeholder into a live real-time Firebase chat and created the Price Bargaining / Make an Offer negotiation engine."*
3. **Member 3**: *"I built the Seller inventory management with Edit/Delete features, Cloud Storage photo uploads, and created the Safe Campus Meetup Coordinator for physical handoffs."*
4. **Member 4**: *"I implemented Email/Password authentication security and designed the Seller Reviews & Reputation System with student trust badges."*
5. **Member 5**: *"I architected the TypeScript data models, optimized saved items synchronization, and created the Content Moderation & Scam Shield to protect students from fraud."*

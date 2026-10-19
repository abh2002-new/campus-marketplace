# 🎤 Campus Marketplace - Team Presentation Script (5 Members)

**Estimated Duration**: 10 – 12 Minutes (~2 mins per member)  
**Project**: Campus Marketplace (Expo SDK 57 React Native + Firebase)  
**Target Audience**: Academic Evaluators, Lecturers, and Viva Panel

---

## 📋 Overview of Presentation Roles & Transitions

| Order | Speaker | Topic / Assigned Module | Key Screen / Demo Cue |
|---|---|---|---|
| **01** | **Member 1** *(Leader / Intro)* | Project Introduction, Problem Statement, Campus Discovery & Request Board (WTB) | Home / Explore Screen, Campus Dropdown, Price Filter, Request Board Banner |
| **02** | **Member 2** | Live Buyer-Seller Chat & Price Bargaining / Make an Offer System | Item Detail Card, "Make Offer" Button, Discount Presets, Messages Page |
| **03** | **Member 3** | Seller Inventory (CRUD), Storage Photo Upload & Safe Campus Meetup Coordinator | "Sell" Flow, My Listings (Edit/Delete), "Safe Meetup" Button & Campus Spots |
| **04** | **Member 4** | User Authentication Security, Profile Management & Seller Reviews / Trust Badges | Auth Modal (Sign up/Sign in), Profile Page, "Seller Reviews" View |
| **05** | **Member 5** *(Closer)* | TypeScript Data Architecture, Shortlist Sync & Content Safety / Scam Moderation | Saved Page, "Report Listing" Modal, Future Enhancements & Conclusion |

---

## 🎬 Act 1: Introduction & Member 1 Presentation

### 👤 Member 1: Opening & Campus Discovery System
**Role**: Team Leader & Explore/Demand-side Engineer  
**Files**: `src/features/ItemRequestsModal.tsx`, `src/pages/ExplorePage.tsx`, `src/data.ts`

#### 🗣️ Spoken Script (English):
> "Good morning / afternoon respected lecturers and panel members.
> 
> Today, our team is excited to present **Campus Marketplace** — a mobile and web application designed specifically for the university student community in Sri Lanka. 
> 
> **The Problem**: University students frequently need second-hand textbooks, senior lecture notes, lab equipment, and tech gear at affordable prices. However, existing public platforms like Facebook Marketplace or Ikman lack university verification, fail to filter by campus, and carry safety risks during meetups.
> 
> **Our Solution**: We built a secure, peer-to-peer campus trading ecosystem using **React Native with Expo SDK 57** on the frontend, and **Google Firebase Cloud Firestore and Storage** on the backend.
> 
> *[Action: Show Explore Page on phone/screen]*
> 
> In the initial base template we evaluated, the app only had generic search and placeholder campus categories like 'North Campus'. My responsibility was twofold:
> 
> 1. **Campus Localization & Price Filtering**: I engineered dynamic filtering supporting **17 Sri Lankan state universities** — including Moratuwa, Colombo, and Peradeniya — combined with real-time **LKR price range filtering** so students can immediately find items on their own campus.
> 2. **Student Request Board (WTB - Want To Buy)**: Often, specific edition textbooks or lab equipment are not listed for sale. I developed the **Request Board**, accessible right from this top banner. Students can post urgent item requests with target budgets and category tags. When other peers have the item, they can instantly connect.
> 
> Now, once a student finds an item or wants to negotiate the price, communication is essential. I will now hand over to **Member 2**, who engineered our Real-time Chat and Price Bargaining system."

---

## 🎬 Act 2: Member 2 Presentation

### 👤 Member 2: Live Chat & Price Bargaining Engine
**Role**: Real-Time Communications & Negotiation Flow Engineer  
**Files**: `src/features/MakeOfferModal.tsx`, `src/pages/MessagesPage.tsx`

#### 🗣️ Spoken Script (English):
> "Thank you, [Member 1 Name].
> 
> In any campus marketplace, student budgets are tight, and bargaining is an essential part of student trading culture. In the base project, the 'Messages' tab was merely an empty 20-line UI stub with zero backend connectivity.
> 
> *[Action: Tap an item card and click '🤝 Make Offer']*
> 
> To solve this, I designed and developed two major subsystems:
> 
> 1. **Price Bargaining & Offer Flow (`MakeOfferModal.tsx`)**:
>    - Rather than awkward haggling, buyers can click **'Make Offer'**.
>    - I implemented quick discount calculation chips for **5%, 10%, 15%, and 20% off**, alongside custom offer inputs that automatically display the buyer's exact savings in LKR.
>    - Buyers can attach preset deal-sweeteners like *'Can pick up today at library'* or *'Cash on delivery'*, dispatching a structured offer proposal directly to the seller.
> 
> 2. **Real-time Firestore Chat Engine (`MessagesPage.tsx`)**:
>    - *[Action: Navigate to Messages Tab]*
>    - I implemented real-time Firestore listeners subscribing to user conversations. Each conversation maintains subcollections for messages, sorted chronologically with automatic timestamps and unread message previews.
> 
> With communication and price agreed upon, the next step is publishing the inventory and coordinating a safe physical handoff. I will now pass the presentation to **Member 3** to demonstrate listing management and safe campus meetups."

---

## 🎬 Act 3: Member 3 Presentation

### 👤 Member 3: Listing CRUD, Storage Uploads & Safe Meetup Coordinator
**Role**: Seller Inventory & Campus Logistics Engineer  
**Files**: `src/features/MeetupSchedulerModal.tsx`, `src/pages/MyListingsPage.tsx`, `src/components/ListingCard.tsx`

#### 🗣️ Spoken Script (English):
> "Thank you, [Member 2 Name].
> 
> For sellers, inventory management must be intuitive, and physical item exchanges must be completely secure. In the initial project, students could only post items using a static hardcoded photo, and there was no way to edit or delete posted items.
> 
> *[Action: Tap 'Sell' or navigate to 'My Listings']*
> 
> I implemented the following key capabilities:
> 
> 1. **Complete Listing CRUD & Cloud Storage**:
>    - Using `expo-image-picker`, sellers can choose photos directly from their camera or mobile gallery.
>    - I connected **Firebase Cloud Storage** to upload image blobs securely and bind download URLs to Firestore documents.
>    - In **My Listings**, sellers can edit existing titles, prices, or descriptions with pre-filled forms, or delete sold items with native confirmation alerts.
> 
> 2. **Safe Campus Meetup Coordinator (`MeetupSchedulerModal.tsx`)**:
>    - *[Action: Open a listing and tap '📍 Safe Meetup']*
>    - Meeting strangers off-campus is dangerous for university students. I mapped out **designated safe meeting zones** tailored to each Sri Lankan university — such as the **Main Library Lobby, Central Canteen, and Security Gate**.
>    - Students can select time windows like *'Lunch Break'* or *'Afternoon'*, review safety guidelines, and generate a confirmed meeting proposal.
> 
> Next, to ensure that sellers and buyers are authentic students, **Member 4** will present our Authentication and Seller Reputation system."

---

## 🎬 Act 4: Member 4 Presentation

### 👤 Member 4: Account Security & Seller Reputation System
**Role**: Auth Security, Profile & Student Trust Engineer  
**Files**: `src/features/SellerReviewsModal.tsx`, `src/pages/ProfilePage.tsx`

#### 🗣️ Spoken Script (English):
> "Thank you, [Member 3 Name].
> 
> Trust is the foundation of peer-to-peer commerce. In the initial base template, user sign-in was restricted to anonymous guest accounts, meaning there was no accountability or seller reputation.
> 
> *[Action: Open Profile Page, then tap '⭐ Reviews' on a listing]*
> 
> My core contributions include:
> 
> 1. **Enhanced User Authentication & Profile Security**:
>    - I implemented full **Email & Password Authentication** with interactive mode-switching between Sign In and Sign Up, client-side validation, and session persistence.
>    - User profiles are automatically synchronized with Firestore user documents to store university affiliations and meetup preferences.
> 
> 2. **Seller Reviews & Reputation System (`SellerReviewsModal.tsx`)**:
>    - To eliminate scammers and reward honest sellers, I built a verified student feedback system.
>    - It features **5-Star Rating breakdown bars** (Item Accuracy, Response Time, Punctuality), peer testimonials, and student trust badges like **'Verified Student'** and **'Fast Responder'**.
> 
> 3. **Architecture Optimization & Bug Fix**:
>    - When testing on mobile devices in Expo Go, opening multiple native modals caused native window manager touch locks. I architected a seamless, single-modal view transition engine with `← Back to listing` navigation, guaranteeing smooth 60fps performance without app freezing.
> 
> Finally, to discuss our backend data modeling, shortlist management, and scam moderation shield, I invite **Member 5** to conclude."

---

## 🎬 Act 5: Member 5 Presentation & Conclusion

### 👤 Member 5: Data Models, Saved Shortlists & Scam Shield
**Role**: Data Architect, Shortlists & Content Moderation Engineer  
**Files**: `src/features/ReportListingModal.tsx`, `src/pages/SavedPage.tsx`, `src/types.ts`

#### 🗣️ Spoken Script (English):
> "Thank you, [Member 4 Name].
> 
> As our application grew from a basic template into a multi-feature enterprise student app, code maintainability and user safety became paramount.
> 
> *[Action: Tap the heart icon to save an item, then open 'Saved' tab]*
> 
> My contributions focused on three essential pillars:
> 
> 1. **TypeScript Data Architecture (`types.ts`)**:
>    - I architected the core data models for the entire application, creating strict TypeScript interfaces for `Listing`, `Conversation`, `Message`, `ItemRequest`, `Offer`, `MeetupPlan`, `SellerReview`, and `ListingReport`. This ensured complete type safety across all team members' modules.
> 
> 2. **Shortlist Synchronization (`SavedPage.tsx`)**:
>    - I optimized real-time Firestore saved-listing subcollections, allowing students to bookmark items with instantaneous optimistic UI toggling.
> 
> 3. **Listing Safety & Content Moderation Shield (`ReportListingModal.tsx`)**:
>    - *[Action: Tap '🚨 Report suspicious listing']*
>    - To protect students from academic integrity violations, stolen campus property, and price-baiting, I built a confidential reporting system. Students can flag suspicious listings under categories like *'Prohibited/Stolen Campus Property'* or *'Exam Leak/Copyright Infringement'*, routing reports directly for administrative review.
> 
> ### 🏁 Conclusion & Summary
> In conclusion, our team took an incomplete, static base prototype and transformed it into a fully-functional, secure, Sri Lankan campus marketplace. Each of the 5 members contributed a distinct, production-ready module with dedicated source files and zero merge conflicts on GitHub.
> 
> Thank you for your time and attention. We are now open for questions!"

---

## 💡 Quick Viva / Q&A Cheatsheet for Each Member

### ❓ Potential Question for Member 1:
- **Lecturer**: *"How does your Request Board handle filtering by campus?"*
- **Answer**: *"We utilize an in-memory and Firestore query filter matching the `university` field on the `ItemRequest` interface against the active campus state, with an 'All Campuses' fallback."*

### ❓ Potential Question for Member 2:
- **Lecturer**: *"How are chat messages structured in Firestore?"*
- **Answer**: *"We use a parent `conversations` collection containing participant UIDs in a `memberIds` array. Individual chat entries are stored in a nested `messages` subcollection ordered by `createdAt` server timestamps."*

### ❓ Potential Question for Member 3:
- **Lecturer**: *"Where are image files stored, and what is stored in Firestore?"*
- **Answer**: *"Image binary blobs are uploaded to Firebase Cloud Storage under `listing-images/{uid}/{timestamp}` using `uploadBytes`. Firestore only stores the lightweight public download URL returned by `getDownloadURL()`."*

### ❓ Potential Question for Member 4:
- **Lecturer**: *"Why was the review modal getting stuck previously, and how did you resolve it?"*
- **Answer**: *"In React Native, presenting two native `<Modal>` components simultaneously causes native Android Dialog window focus collisions. I refactored the listing modal to manage its active view internally with a back navigation button, eliminating dual-modal presentation completely."*

### ❓ Potential Question for Member 5:
- **Lecturer**: *"How does TypeScript help in a 5-member team project?"*
- **Answer**: *"By declaring strict shared data contracts in `types.ts`, all 5 members could develop independent components without runtime type mismatch errors, ensuring seamless integration into `App.tsx`."*

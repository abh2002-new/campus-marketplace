# 🎙️ Campus Marketplace - Solo Presenter Speech Script

**Delivered By**: Single Presenter (Representing the 5-Member Team)  
**Estimated Speaking Time**: 8 – 10 Minutes  
**Target Audience**: Academic Evaluation Panel / University Lecturers  
**Framework & Stack**: React Native (Expo SDK 57), Cloud Firestore, Firebase Storage, TypeScript

---

## 📌 Presenter's Quick Checklist Before Starting:
1. Have the app running on **Expo Go (Phone)** or **Web Browser (`npm run web`)** displayed on screen/projector.
2. Keep this script handy or memorize the key slide/screen transitions in `[brackets]`.
3. Highlight each of the **5 team members' names and contributions** clearly so that all 5 members receive full evaluation credit!

---

## 🎬 Part 1: Introduction & Problem Statement (~1.5 Minutes)

> "Good morning / afternoon respected lecturers and panel members.
>
> My name is **[Your Name]**, and today I am proud to present our software engineering project, **Campus Marketplace**, on behalf of our 5-member team: **[Member 1 Name], [Member 2 Name], [Member 3 Name], [Member 4 Name]**, and myself.
>
> ### 🛑 The Problem:
> Every semester, university students face significant financial hurdles purchasing academic textbooks, engineering drafting boards, lab coats, and tech accessories. While students try using generic platforms like Facebook Marketplace or Ikman, they face three major pain points:
> 1. **Zero Campus Filtering**: Listings are scattered across the whole island rather than localized to specific university campuses.
> 2. **Lack of Student Verification & Trust**: No way to verify if a seller is an authentic student or a scammer.
> 3. **Meetup Safety Concerns**: Meeting unfamiliar buyers in random off-campus areas poses safety risks.
>
> ### 💡 Our Solution:
> We engineered **Campus Marketplace** — a dedicated, hyper-localized mobile and web trading application built with **React Native and Expo SDK 57**, powered by **Google Firebase Cloud Firestore and Cloud Storage**, and strictly typed with **TypeScript**.
>
> Our team took an initial prototype template and expanded it into an enterprise student marketplace. To ensure equal contribution, each of our 5 team members was assigned a core architectural module and built a dedicated feature from scratch. Allow me to walk you through our system and each member's contributions."

---

## 🎬 Part 2: Live Demo & 5-Member Work Breakdown (~6 Minutes)

---

### 👤 Module 1: Campus Discovery & Student Request Board (Member 1's Contribution)
`[Action: Display the Explore Page on screen]`

> "Starting with our discovery layer, engineered by **Member 1**:
>
> In the initial base template, search was rudimentary with placeholder categories and generic 'North Campus' labels. **Member 1** transformed this into a realistic Sri Lankan campus ecosystem:
>
> `[Action: Tap the campus dropdown and select 'University of Moratuwa' or 'University of Colombo']`
>
> - **University Localization**: Member 1 mapped **17 Sri Lankan state universities** into the system, enabling students to instantly view items available strictly on their own campus.
> - **Price Range Filter**: Added real-time **LKR minimum and maximum price filtering**.
>
> `[Action: Tap the top banner '📢 Student Request Board']`
>
> - **The Innovation - Student Request Board (WTB)**: Often, senior notes or specific edition textbooks aren't listed for sale. Member 1 developed this dedicated **Request Board (`ItemRequestsModal.tsx`)**. Students can post requests with target budgets, category tags, and urgency levels like *'Urgent (Exam Soon)'*. When other students have the item, they can tap *'I have this!'* to immediately reach out."

---

### 👤 Module 2: Live Chat Subsystem & Price Bargaining Engine (Member 2's Contribution)
`[Action: Close Request Board, tap any listing card to open item details]`

> "Once a buyer finds an item, communication and bargaining are the next crucial steps. This subsystem was designed and built by **Member 2**:
>
> In the original prototype, the 'Messages' tab was simply an empty static placeholder with zero database connectivity.
>
> `[Action: Tap the '🤝 Make Offer' button under the listing price]`
>
> - **Price Bargaining System (`MakeOfferModal.tsx`)**: Understanding student budgeting, Member 2 implemented a structured bargaining engine. Instead of awkward text negotiations, buyers can select quick discount presets for **5%, 10%, 15%, or 20% off**, or input a custom offer. The modal instantly computes the student's exact savings in LKR. Buyers can also attach quick deal-sweeteners like *'Can pick up today'* or *'Cash on delivery'*.
>
> `[Action: Close Offer and navigate to the bottom 'Messages' Tab]`
>
> - **Real-Time Firestore Chat Engine (`MessagesPage.tsx`)**: Member 2 built the full real-time messaging pipeline. Conversations are indexed by participant UIDs in Cloud Firestore, with individual messages stored in chronological subcollections featuring server timestamps, last-message previews, and live snapshot updates."

---

### 👤 Module 3: Seller Inventory CRUD & Safe Meetup Coordinator (Member 3's Contribution)
`[Action: Navigate to 'My Listings' or tap the '+ Sell' button]`

> "Next, for seller management and physical logistics, **Member 3** led the development:
>
> In the base project, users could only create listings with a hardcoded static photo, and could never edit or delete their items.
>
> - **Listing CRUD & Cloud Storage**: Member 3 integrated `expo-image-picker` and **Firebase Cloud Storage**, enabling sellers to upload authentic photos from their mobile gallery or camera. Member 3 also built the **Edit and Delete flow**, allowing sellers to update prices or mark items as sold with native alert confirmations.
>
> `[Action: Open a listing detail view and tap '📍 Safe Meetup']`
>
> - **The Innovation - Safe Campus Meetup Coordinator (`MeetupSchedulerModal.tsx`)**: Student safety during physical handoffs is paramount. Member 3 mapped out **designated safe meeting zones** inside each university — such as the **Main Library Lobby, Central Student Canteen, and Campus Security Gate**. Students can choose their preferred meeting spot, select date and time slots like *'Lunch Break'* or *'Afternoon'*, review student safety guidelines, and generate a confirmed meeting proposal."

---

### 👤 Module 4: Authentication Security & Seller Reputation System (Member 4's Contribution)
`[Action: Open the Profile tab, then tap '⭐ Reviews' on a listing]`

> "To guarantee student trust and eliminate scammers, **Member 4** engineered our security and reputation layer:
>
> In the initial prototype, authentication only supported anonymous guest logins, meaning sellers had zero accountability.
>
> - **Authentication & Profile Management (`ProfilePage.tsx`)**: Member 4 implemented full **Email and Password Authentication** with form validation, session persistence, and Firestore profile synchronization.
> - **Seller Reviews & Reputation System (`SellerReviewsModal.tsx`)**: To reward trustworthy sellers, Member 4 created a verified student peer review system. It features **5-Star Ratings**, category satisfaction metrics (Item Quality, Communication, Punctuality), and student trust badges like **'Verified Student'** and **'Fast Responder'**.
> - **Technical Problem Solved**: When testing on mobile devices in Expo Go, opening multiple native modals previously caused native Android touch-focus collisions where the app would freeze. Member 4 refactored the listing modal architecture into a seamless **single-modal view navigation** with `← Back to listing` buttons, completely eliminating touch locks and ensuring 60fps responsiveness."

---

### 👤 Module 5: Data Models, Shortlists & Content Moderation Shield (Member 5's Contribution)
`[Action: Tap heart on an item, show Saved tab, then tap '🚨 Report suspicious listing']`

> "Finally, our application's stability and community safety were spearheaded by **Member 5**:
>
> - **TypeScript Data Architecture (`types.ts`)**: Member 5 architected the shared data contracts for the entire application, declaring strict TypeScript models for `Listing`, `Conversation`, `Message`, `ItemRequest`, `Offer`, `MeetupPlan`, `SellerReview`, and `ListingReport`. This ensured all 5 members' code integrated with zero type mismatches.
> - **Shortlist Synchronization (`SavedPage.tsx`)**: Member 5 optimized real-time Firestore saved-items synchronization with instant optimistic UI toggling.
> - **Listing Moderation & Scam Shield (`ReportListingModal.tsx`)**: To protect students from counterfeit course materials, stolen campus equipment, and exam leaks, Member 5 developed a confidential reporting system. Students can report listings under categories like *'Prohibited/Stolen Campus Property'* or *'Exam Leak/Copyright Breach'*, routing flagged items for administrative review."

---

## 🎬 Part 3: Architecture & Engineering Highlights (~1.5 Minutes)

> "### 🛠️ Engineering Highlights:
> To summarize the technical architecture:
> 1. **Modular Code Organization**: In our codebase, each member's feature is isolated in dedicated files under `src/features/` with corresponding pages under `src/pages/`, eliminating git merge conflicts across our repository.
> 2. **Security & Validation**: Client-side Firebase rules ensure authenticated writes, owner-only deletes, and private messaging subcollections.
> 3. **Production Stability**: Our entire TypeScript codebase compiles cleanly with zero warnings or errors using `npx tsc --noEmit`."

---

## 🎬 Part 4: Conclusion & Q&A (~1 Minute)

> "### 🏁 Conclusion:
> In conclusion, our team took an incomplete, static prototype and transformed it into a production-ready, feature-complete Campus Marketplace tailored specifically for Sri Lankan university students.
>
> Each of our 5 team members contributed an equal, production-ready module to achieve this result.
>
> On behalf of our entire team, thank you very much for your time and attention. I am now delighted to answer any questions from the panel!"

---

## 🎯 Quick Q&A Reference for the Solo Presenter:

If the lecturers ask questions about any specific member's part, use these exact concise answers:

1. **If asked about Member 1's part (Campus Filtering & Request Board)**:
   > *"The Request Board uses an `ItemRequest` interface storing `university`, `maxBudget`, and `urgency`. Filtering is executed through active state matching against the selected campus with fallback to 'All Campuses'."*

2. **If asked about Member 2's part (Chat & Offers)**:
   > *"Conversations are stored in a root Firestore `conversations` collection with participant UIDs in a `memberIds` array. Individual messages are stored in an inner `messages` subcollection ordered by `createdAt` server timestamps to support real-time snapshot listeners."*

3. **If asked about Member 3's part (Storage & Photos)**:
   > *"We use `expo-image-picker` to select the photo as a local URI, convert it to a binary blob, and upload it to Firebase Cloud Storage under `listing-images/{uid}/{timestamp}`. Firestore stores only the resulting public download URL."*

4. **If asked about Member 4's part (Modal Freeze Fix & Reviews)**:
   > *"React Native cannot safely stack multiple native `<Modal>` components on Android because native Dialog window focus gets trapped. We solved this by implementing an internal view router (`activeView: 'details' | 'offer' | 'meetup' | 'reviews' | 'report'`) within a single modal, providing smooth `← Back` navigation without freezing."*

5. **If asked about Member 5's part (TypeScript & Moderation)**:
   > *"By defining shared type contracts in `types.ts`, all 5 members could develop independent components without type conflicts. The Report system logs confidential reports into Firestore with predefined violation categories for moderation."*

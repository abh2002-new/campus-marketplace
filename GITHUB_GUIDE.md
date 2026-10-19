# 🚀 GitHub Team Collaboration Guide (5 Members)

මෙම Guide එක මඟින් සාමාජිකයින් 5 දෙනාට කිසිදු merge conflict එකක් නොමැතිව, එක් එක් සාමාජිකයාගේ feature එක තමන්ගේම GitHub account එකෙන් commit කර Pull Request (PR) මඟින් GitHub repository එකට එකතු කරන ආකාරය පියවරෙන් පියවර විස්තර කෙරේ.

---

## 👥 සාමාජිකයින් සහ Features බෙදී ඇති ආකාරය (5 Files / 5 Features)

| Member | Feature | File Path | Branch Name |
|---|---|---|---|
| **Member 1** | Student Request Board (WTB / Wanted Items) | `src/features/ItemRequestsModal.tsx` | `feature/item-requests` |
| **Member 2** | Price Bargaining & Offer Negotiation | `src/features/MakeOfferModal.tsx` | `feature/make-offer` |
| **Member 3** | Safe Campus Meetup Coordinator & Safe Zones | `src/features/MeetupSchedulerModal.tsx` | `feature/safe-meetup` |
| **Member 4** | Seller Rating, Reviews & Trust Badges | `src/features/SellerReviewsModal.tsx` | `feature/seller-reviews` |
| **Member 5** | Listing Moderation, Report & Scam Shield | `src/features/ReportListingModal.tsx` | `feature/report-moderation` |

---

## 📌 පියවර 1: Team Lead / First Member විසින් Git Repo එක සෑදීම

GitHub වෙබ් අඩවියට ගොස් අලුත් repository එකක් (`campus-marketplace`) සාදා පහත command run කරන්න:

```bash
git init
git add .
git commit -m "chore: initial project setup with expo and baseline architecture"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/campus-marketplace.git
git push -u origin main
```

---

## 📌 පියවර 2: අනෙක් සාමාජිකයින් 4 දෙනා Repository එක Clone කර ගැනීම

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/campus-marketplace.git
cd campus-marketplace
npm install
```

---

## 📌 පියවර 3: එක් එක් සාමාජිකයා තම Feature එක Branch එකක් ලෙස Commit කිරීම

> **වැදගත්**: GitHub හි Contribution graph එකේ සහ Repository Insights වල සාමාජිකයින් 5 දෙනාගේම නම් පෙන්වීමට එක් එක් සාමාජිකයා තම පරිගණකයෙන් තමන්ගේ branch එක push කළ යුතුය.

### 👤 Member 1 (Campus Request Board)
```bash
git checkout -b feature/item-requests
git add src/features/ItemRequestsModal.tsx
git commit -m "feat(member-1): implement campus wanted and student request board"
git push -u origin feature/item-requests
```

### 👤 Member 2 (Price Bargaining & Offers)
```bash
git checkout -b feature/make-offer
git add src/features/MakeOfferModal.tsx
git commit -m "feat(member-2): implement price bargaining and offer proposals"
git push -u origin feature/make-offer
```

### 👤 Member 3 (Safe Campus Meetups)
```bash
git checkout -b feature/safe-meetup
git add src/features/MeetupSchedulerModal.tsx
git commit -m "feat(member-3): implement safe campus meetup coordinator and designated zones"
git push -u origin feature/safe-meetup
```

### 👤 Member 4 (Seller Reviews & Badges)
```bash
git checkout -b feature/seller-reviews
git add src/features/SellerReviewsModal.tsx
git commit -m "feat(member-4): implement seller reviews, star ratings, and trust badges"
git push -u origin feature/seller-reviews
```

### 👤 Member 5 (Listing Moderation & Reports)
```bash
git checkout -b feature/report-moderation
git add src/features/ReportListingModal.tsx
git commit -m "feat(member-5): implement listing safety, moderation, and scam report system"
git push -u origin feature/report-moderation
```

---

## 📌 පියවර 4: Pull Request (PR) සාදා Merge කිරීම

1. GitHub Repo එකට යන්න.
2. එක් එක් branch එක සඳහා **Compare & pull request** click කරන්න.
3. PR description එක ලියා **Create pull request** click කරන්න.
4. Team Lead විසින් PR 5 ම **Merge pull request** කර **main** branch එකට එකතු කරන්න.

මෙය සිදු කළ පසු GitHub එකේ:
- Commit count එක 5 දෙනාටම බෙදී යයි.
- Contributors page එකේ සාමාජිකයින් 5 දෙනාගේම profile ඡායාරූප සහ contributions දිස්වේ.
- Course evaluation එකේදී එක් එක් සාමාජිකයාට තමන්ගේම file එකක් සහ feature එකක් presentation එකේදී පෙන්විය හැක.

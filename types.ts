export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  sellerId?: string;
  university?: string;
  campus: string;
  condition: string;
  image: string;
  description?: string;
};

export type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerName: string;
  memberIds: string[];
  updatedAt?: { seconds: number } | null;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt?: { seconds: number } | null;
};

export type Tab = "Explore" | "Saved" | "Messages" | "Profile" | "MyListings";

// --- 5 Team Member Features Types ---

// Member 1 Feature: Item Requests (Campus Wanted / Wishlist)
export type ItemRequest = {
  id: string;
  title: string;
  category: string;
  university: string;
  maxBudget: number;
  urgency: "normal" | "urgent";
  requesterName: string;
  description?: string;
  createdAt: string;
};

// Member 2 Feature: Price Bargaining & Offers
export type Offer = {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  originalPrice: number;
  offerPrice: number;
  note?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
};

// Member 3 Feature: Campus Safe Meetup Coordinator
export type MeetupPlan = {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerName: string;
  campus: string;
  location: string;
  date: string;
  timeSlot: string;
  notes?: string;
};

// Member 4 Feature: Seller Reviews & Reputation
export type SellerReview = {
  id: string;
  sellerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedStudent?: boolean;
};

// Member 5 Feature: Listing Safety & Report Moderation
export type ListingReport = {
  id: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  details: string;
  reportedAt: string;
};

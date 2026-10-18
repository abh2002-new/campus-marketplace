export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  seller: string;
  sellerId?: string;
  campus: string;
  condition: string;
  image: string;
  description?: string;
};

export type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId?: string;
  sellerName: string;
  memberIds?: string[];
};

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

export type Tab = "Explore" | "Saved" | "Messages" | "Profile" | "MyListings";

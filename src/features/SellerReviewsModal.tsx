import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SellerReview } from "../types";

const initialReviews: Record<string, SellerReview[]> = {
  default: [
    {
      id: "rev-1",
      sellerId: "seller-1",
      reviewerName: "Praveen S.",
      rating: 5,
      comment:
        "Book was in pristine condition, exactly as described. Met at the Moratuwa library on time!",
      date: "3 days ago",
      verifiedStudent: true,
    },
    {
      id: "rev-2",
      sellerId: "seller-1",
      reviewerName: "Amaya D.",
      rating: 5,
      comment:
        "Very polite and fast response. Great price for seniors' notes. Highly recommend!",
      date: "1 week ago",
      verifiedStudent: true,
    },
    {
      id: "rev-3",
      sellerId: "seller-1",
      reviewerName: "Tharindu K.",
      rating: 4,
      comment:
        "Good communication, slight delay during meetup because of lecture, but item was 100% genuine.",
      date: "2 weeks ago",
      verifiedStudent: true,
    },
  ],
};

export function SellerReviewsView({
  sellerName,
  sellerId,
  campus,
  currentUserName,
  onBack,
  onClose,
}: {
  sellerName: string;
  sellerId?: string;
  campus?: string;
  currentUserName?: string;
  onBack?: () => void;
  onClose: () => void;
}) {
  const [reviews, setReviews] = useState<SellerReview[]>(initialReviews.default);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isAddingReview, setIsAddingReview] = useState(false);

  const numericAvg = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 5.0;
  const averageRating = (Number.isFinite(numericAvg) ? numericAvg : 5.0).toFixed(1);
  const starCount = Math.max(1, Math.min(5, Math.round(Number(averageRating)) || 5));

  const handleAddReview = () => {
    if (!comment.trim()) {
      Alert.alert("Empty Review", "Please write a few words about your experience.");
      return;
    }

    const newReview: SellerReview = {
      id: `rev-${Date.now()}`,
      sellerId: sellerId || "seller-unknown",
      reviewerName: currentUserName || "Campus Student",
      rating: userRating,
      comment: comment.trim(),
      date: "Just now",
      verifiedStudent: true,
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setIsAddingReview(false);
    Alert.alert("Review Published! ⭐", `Thank you for rating ${sellerName}.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack ? (
            <Pressable style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← Back to listing</Text>
            </Pressable>
          ) : null}
          <Text style={styles.badge}>FEATURE 4 · TRUST & REPUTATION</Text>
          <Text style={styles.title}>Seller Reviews & Trust</Text>
          <Text style={styles.subtitle}>Verified student feedback and badges</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        {/* Seller Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {sellerName.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.sellerName}>{sellerName}</Text>
          <Text style={styles.sellerCampus}>🎓 {campus || "Campus Marketplace Seller"}</Text>

          {/* Rating Star Banner */}
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>{"★".repeat(starCount)}</Text>
            <Text style={styles.scoreText}>{averageRating} / 5.0</Text>
            <Text style={styles.reviewCountText}>({reviews.length} reviews)</Text>
          </View>

          {/* Student Trust Badges */}
          <View style={styles.badgesWrap}>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>✓ Verified Student</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>⚡ Fast Responder</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>⭐ Accurate Listings</Text>
            </View>
          </View>
        </View>

        {/* Satisfaction Metrics */}
        <View style={styles.metricsBox}>
          <MetricBar label="Item Quality & Accuracy" percentage={98} />
          <MetricBar label="Response Time & Friendliness" percentage={100} />
          <MetricBar label="Punctuality at Campus Meetups" percentage={95} />
        </View>

        {/* Reviews Section Header & Add Review Button */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Student Experiences</Text>
          <Pressable
            style={styles.addReviewToggle}
            onPress={() => setIsAddingReview(!isAddingReview)}
          >
            <Text style={styles.addReviewToggleText}>
              {isAddingReview ? "Cancel" : "+ Rate Seller"}
            </Text>
          </Pressable>
        </View>

        {/* Add Review Form */}
        {isAddingReview ? (
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Your Rating for {sellerName}</Text>
            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setUserRating(star)}>
                  <Text
                    style={[
                      styles.pickStar,
                      star <= userRating && styles.pickStarActive,
                    ]}
                  >
                    ★
                  </Text>
                </Pressable>
              ))}
              <Text style={styles.ratingLabel}>{userRating} out of 5 stars</Text>
            </View>

            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={`Write your review about trading with ${sellerName}...`}
              placeholderTextColor="#87918C"
              multiline
              numberOfLines={3}
              style={styles.commentInput}
            />

            <Pressable style={styles.submitReviewBtn} onPress={handleAddReview}>
              <Text style={styles.submitReviewBtnText}>Publish Verified Review</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Reviews List */}
        {reviews.map((rev) => {
          const revStars = Math.max(1, Math.min(5, rev.rating || 5));
          return (
            <View key={rev.id} style={styles.reviewCard}>
              <View style={styles.revHeader}>
                <View>
                  <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                  {rev.verifiedStudent ? (
                    <Text style={styles.verifiedTag}>🎓 Verified Student Peer</Text>
                  ) : null}
                </View>
                <View style={styles.revMeta}>
                  <Text style={styles.revStars}>{"★".repeat(revStars)}</Text>
                  <Text style={styles.revDate}>{rev.date}</Text>
                </View>
              </View>
              <Text style={styles.revComment}>{rev.comment}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function SellerReviewsModal({
  visible,
  sellerName,
  sellerId,
  campus,
  currentUserName,
  onClose,
}: {
  visible: boolean;
  sellerName: string;
  sellerId?: string;
  campus?: string;
  currentUserName?: string;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <SellerReviewsView
          sellerName={sellerName}
          sellerId={sellerId}
          campus={campus}
          currentUserName={currentUserName}
          onClose={onClose}
        />
      </View>
    </Modal>
  );
}

function MetricBar({ label, percentage }: { label: string; percentage: number }) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricLabelRow}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricPercentage}>{percentage}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdropTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: "#F8FAF8",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECE6",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  backButton: {
    paddingBottom: 6,
  },
  backButtonText: {
    fontSize: 13,
    color: "#1F5D4C",
    fontWeight: "800",
  },
  badge: {
    color: "#1F5D4C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#173C34",
  },
  subtitle: {
    fontSize: 12,
    color: "#87918C",
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F2ED",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 20,
    color: "#546059",
    lineHeight: 22,
  },
  body: {
    padding: 20,
  },
  heroCard: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 16,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F5D4C",
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#173C34",
  },
  sellerCampus: {
    fontSize: 12,
    color: "#87918C",
    marginTop: 2,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  stars: {
    color: "#F59E0B",
    fontSize: 18,
    letterSpacing: 2,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173C34",
  },
  reviewCountText: {
    fontSize: 12,
    color: "#87918C",
  },
  badgesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
  },
  trustBadge: {
    backgroundColor: "#EBF3EE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CFDFD4",
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1F5D4C",
  },
  metricsBox: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 18,
    gap: 12,
  },
  metricRow: {
    gap: 4,
  },
  metricLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricLabel: {
    fontSize: 12,
    color: "#546059",
    fontWeight: "600",
  },
  metricPercentage: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1F5D4C",
  },
  barBackground: {
    height: 6,
    backgroundColor: "#E9ECE6",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    backgroundColor: "#1F5D4C",
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173C34",
  },
  addReviewToggle: {
    backgroundColor: "#EBF3EE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addReviewToggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F5D4C",
  },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CFDFD4",
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#173C34",
    marginBottom: 8,
  },
  starPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  pickStar: {
    fontSize: 26,
    color: "#D0D7D3",
  },
  pickStarActive: {
    color: "#F59E0B",
  },
  ratingLabel: {
    fontSize: 12,
    color: "#87918C",
    marginLeft: 8,
  },
  commentInput: {
    backgroundColor: "#F8FAF8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
    padding: 12,
    fontSize: 13,
    color: "#173C34",
    height: 70,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  submitReviewBtn: {
    backgroundColor: "#1F5D4C",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitReviewBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 13,
  },
  reviewCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 10,
  },
  revHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#173C34",
  },
  verifiedTag: {
    fontSize: 10,
    color: "#1F5D4C",
    fontWeight: "600",
    marginTop: 2,
  },
  revMeta: {
    alignItems: "flex-end",
  },
  revStars: {
    color: "#F59E0B",
    fontSize: 12,
  },
  revDate: {
    fontSize: 10,
    color: "#A0AAA4",
    marginTop: 2,
  },
  revComment: {
    fontSize: 13,
    color: "#47544E",
    lineHeight: 18,
  },
});

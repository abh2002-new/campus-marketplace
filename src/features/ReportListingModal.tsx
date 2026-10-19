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
import { Listing, ListingReport } from "../types";

const reportReasons = [
  {
    id: "scam",
    icon: "🚨",
    title: "Suspicious or Scam Attempt",
    desc: "Seller demands upfront deposit or refuses campus meetup",
  },
  {
    id: "price",
    icon: "💰",
    title: "Misleading Price / Bait & Switch",
    desc: "Price listed does not match the actual demanded price",
  },
  {
    id: "prohibited",
    icon: "🚫",
    title: "Prohibited or Stolen Campus Property",
    desc: "University library book, lab equipment, or unauthorized goods",
  },
  {
    id: "copyright",
    icon: "📚",
    title: "Pirated Materials / Exam Leak",
    desc: "Unauthorized exam questions or copyright infringement",
  },
  {
    id: "duplicate",
    icon: "📦",
    title: "Already Sold / Duplicate Spam",
    desc: "Item has already been sold or listed multiple times",
  },
  {
    id: "offensive",
    icon: "⚠️",
    title: "Inappropriate Content / Behavior",
    desc: "Offensive imagery, abusive description, or harassment",
  },
];

export function ReportListingView({
  listing,
  onBack,
  onClose,
  onSubmitReport,
}: {
  listing: Listing | null;
  onBack?: () => void;
  onClose: () => void;
  onSubmitReport: (report: ListingReport) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>("scam");
  const [details, setDetails] = useState("");

  if (!listing) return null;

  const handleSubmit = () => {
    const report: ListingReport = {
      id: `rep-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      reason: selectedReason,
      details: details.trim() || "No extra details provided.",
      reportedAt: new Date().toISOString(),
    };

    onSubmitReport(report);
    Alert.alert(
      "Report Received 🛡️",
      "Thank you for keeping our campus marketplace safe! The listing has been flagged for moderator review."
    );
    setDetails("");
    setSelectedReason("scam");
    onClose();
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
          <Text style={styles.badge}>FEATURE 5 · SAFETY & MODERATION</Text>
          <Text style={styles.title}>Report Listing</Text>
          <Text style={styles.subtitle}>Help keep our student marketplace safe</Text>
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
        {/* Listing Info Card */}
        <View style={styles.listingCard}>
          <Text style={styles.listingTitle} numberOfLines={1}>
            {listing.title}
          </Text>
          <Text style={styles.listingMeta}>
            Listed by {listing.seller} · LKR {listing.price.toLocaleString()} · {listing.campus}
          </Text>
        </View>

        {/* Reasons List */}
        <Text style={styles.sectionLabel}>Select Reason for Reporting</Text>
        <View style={styles.reasonsList}>
          {reportReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;
            return (
              <Pressable
                key={reason.id}
                style={[styles.reasonCard, isSelected && styles.reasonCardActive]}
                onPress={() => setSelectedReason(reason.id)}
              >
                <Text style={styles.reasonIcon}>{reason.icon}</Text>
                <View style={styles.reasonContent}>
                  <Text
                    style={[
                      styles.reasonTitle,
                      isSelected && styles.reasonTitleActive,
                    ]}
                  >
                    {reason.title}
                  </Text>
                  <Text style={styles.reasonDesc}>{reason.desc}</Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleActive,
                  ]}
                >
                  {isSelected ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Additional details */}
        <Text style={styles.sectionLabel}>Additional Explanation (Optional)</Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Provide any evidence or details to help moderators review..."
          placeholderTextColor="#87918C"
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        {/* Safety Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>
            🔒 Your report is 100% confidential. The seller will not be told who submitted this report.
          </Text>
        </View>

        {/* Submit Button */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Confidential Report</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export function ReportListingModal({
  visible,
  listing,
  onClose,
  onSubmitReport,
}: {
  visible: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSubmitReport: (report: ListingReport) => void;
}) {
  if (!visible || !listing) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <ReportListingView
          listing={listing}
          onClose={onClose}
          onSubmitReport={onSubmitReport}
        />
      </View>
    </Modal>
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
    color: "#C3535B",
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
  listingCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 16,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 4,
  },
  listingMeta: {
    fontSize: 12,
    color: "#87918C",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#24483D",
    marginBottom: 8,
    marginTop: 4,
  },
  reasonsList: {
    gap: 8,
    marginBottom: 16,
  },
  reasonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
  },
  reasonCardActive: {
    backgroundColor: "#FDF4F5",
    borderColor: "#C3535B",
  },
  reasonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  reasonContent: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#24483D",
  },
  reasonTitleActive: {
    color: "#C3535B",
  },
  reasonDesc: {
    fontSize: 11,
    color: "#87918C",
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C4CFC7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  radioCircleActive: {
    borderColor: "#C3535B",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C3535B",
  },
  textArea: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
    padding: 12,
    fontSize: 13,
    color: "#173C34",
    height: 70,
    textAlignVertical: "top",
    marginBottom: 14,
  },
  securityNote: {
    backgroundColor: "#F4F6F2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  securityNoteText: {
    fontSize: 11,
    color: "#546059",
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: "#C3535B",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
});

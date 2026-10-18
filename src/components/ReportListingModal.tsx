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
  ["scam", "Suspicious or scam attempt", "Deposit requests or unsafe seller behavior"],
  ["price", "Misleading price / bait and switch", "The final price differs from the listing"],
  ["prohibited", "Prohibited or stolen campus property", "Unauthorized university or campus goods"],
  ["copyright", "Pirated materials / exam leak", "Copyright infringement or unauthorized exams"],
  ["duplicate", "Already sold / duplicate spam", "Sold item or repeated listing"],
  ["offensive", "Inappropriate content / behavior", "Offensive content or harassment"],
];

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
  const [reason, setReason] = useState("scam");
  const [details, setDetails] = useState("");

  if (!listing) return null;

  const submit = () => {
    onSubmitReport({
      id: `report-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      reason,
      details: details.trim() || "No additional details provided.",
      reportedAt: new Date().toISOString(),
    });
    setDetails("");
    setReason("scam");
    onClose();
    Alert.alert(
      "Report received",
      "Thanks for helping keep the campus marketplace safe. A moderator will review this listing.",
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.badge}>SAFETY & MODERATION</Text>
              <Text style={styles.title}>Report listing</Text>
              <Text style={styles.subtitle}>Help keep our student marketplace safe</Text>
            </View>
            <Pressable style={styles.close} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.listing}>
              <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
              <Text style={styles.meta}>
                Listed by {listing.seller} · ${listing.price} · {listing.campus}
              </Text>
            </View>
            <Text style={styles.label}>Select a reason</Text>
            {reportReasons.map(([id, title, description]) => (
              <Pressable
                key={id}
                style={[styles.reason, reason === id && styles.selectedReason]}
                onPress={() => setReason(id)}
              >
                <View style={styles.reasonCopy}>
                  <Text style={[styles.reasonTitle, reason === id && styles.selectedText]}>
                    {title}
                  </Text>
                  <Text style={styles.description}>{description}</Text>
                </View>
                <View style={[styles.radio, reason === id && styles.selectedRadio]}>
                  {reason === id ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            ))}
            <Text style={styles.label}>Additional explanation (optional)</Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              multiline
              placeholder="Add evidence or details for moderators..."
              placeholderTextColor="#87918C"
              style={styles.textArea}
            />
            <Text style={styles.note}>Your report is confidential. The seller will not be told who submitted it.</Text>
            <Pressable style={styles.submit} onPress={submit}>
              <Text style={styles.submitText}>Submit confidential report</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,.5)", justifyContent: "flex-end" },
  backdropTouch: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  sheet: { maxHeight: "88%", backgroundColor: "#F8FAF8", borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#E9ECE6", borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  badge: { color: "#C3535B", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title: { color: "#173C34", fontSize: 21, fontWeight: "800", marginTop: 4 },
  subtitle: { color: "#87918C", fontSize: 12, marginTop: 2 },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F0F2ED", alignItems: "center", justifyContent: "center" },
  closeText: { color: "#546059", fontSize: 20 },
  body: { padding: 20, paddingBottom: 32 },
  listing: { backgroundColor: "#FFF", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#E9ECE6", marginBottom: 16 },
  listingTitle: { color: "#173C34", fontSize: 14, fontWeight: "800" },
  meta: { color: "#87918C", fontSize: 12, marginTop: 4 },
  label: { color: "#24483D", fontSize: 13, fontWeight: "700", marginBottom: 8, marginTop: 4 },
  reason: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E0E5DC" },
  selectedReason: { backgroundColor: "#FDF4F5", borderColor: "#C3535B" },
  reasonCopy: { flex: 1 },
  reasonTitle: { color: "#24483D", fontSize: 13, fontWeight: "700" },
  selectedText: { color: "#C3535B" },
  description: { color: "#87918C", fontSize: 11, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#C4CFC7", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  selectedRadio: { borderColor: "#C3535B" },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#C3535B" },
  textArea: { height: 76, backgroundColor: "#FFF", borderRadius: 12, borderWidth: 1, borderColor: "#E0E5DC", padding: 12, color: "#173C34", textAlignVertical: "top", marginBottom: 14 },
  note: { color: "#546059", backgroundColor: "#F0F3EE", borderRadius: 10, padding: 12, fontSize: 11, lineHeight: 16, marginBottom: 18 },
  submit: { backgroundColor: "#C3535B", borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  submitText: { color: "#FFF", fontWeight: "800", fontSize: 15 },
});

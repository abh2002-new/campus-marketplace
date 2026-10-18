import { useEffect, useState } from "react";
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
import { Listing, Offer } from "../types";

export function MakeOfferModal({
  visible,
  listing,
  currentUserName,
  onClose,
  onSubmitOffer,
}: {
  visible: boolean;
  listing: Listing | null;
  currentUserName?: string;
  onClose: () => void;
  onSubmitOffer: (offer: Offer) => void;
}) {
  const [offerPrice, setOfferPrice] = useState("");
  const [note, setNote] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(10);

  useEffect(() => {
    if (!listing) return;
    setOfferPrice(String(Math.round(listing.price * 0.9)));
    setNote("Can collect at campus library!");
    setSelectedDiscount(10);
  }, [listing]);

  if (!listing) return null;

  const numericOffer = Number(offerPrice);
  const savings = listing.price - numericOffer;
  const discounts = [5, 10, 15, 20];
  const quickNotes = [
    "Can pick up today",
    "Cash on delivery ready",
    "Can meet at campus library",
    "Can meet at student canteen",
  ];

  const applyDiscount = (discount: number) => {
    setSelectedDiscount(discount);
    setOfferPrice(String(Math.round(listing.price * (1 - discount / 100))));
  };

  const submit = () => {
    if (!Number.isFinite(numericOffer) || numericOffer <= 0) {
      Alert.alert("Invalid offer", "Please enter a valid offer amount.");
      return;
    }
    if (numericOffer > listing.price) {
      Alert.alert("Offer too high", "Your offer cannot be higher than the asking price.");
      return;
    }
    if (numericOffer < listing.price * 0.3) {
      Alert.alert("Offer too low", "Offers below 30% of the asking price are usually declined.");
      return;
    }

    onSubmitOffer({
      id: `offer-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      buyerName: currentUserName || "Campus Student",
      originalPrice: listing.price,
      offerPrice: numericOffer,
      note: note.trim() || undefined,
      status: "pending",
      createdAt: "Just now",
    });
    Alert.alert(
      "Offer sent",
      `Your offer of LKR ${numericOffer.toLocaleString()} was sent to ${listing.seller}.`,
    );
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.badge}>PRICE NEGOTIATION</Text>
              <Text style={styles.title}>Make an Offer</Text>
              <Text style={styles.subtitle}>Negotiate a fair student price</Text>
            </View>
            <Pressable style={styles.close} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.summary}>
              <View style={styles.summaryText}>
                <Text style={styles.listingTitle} numberOfLines={1}>{listing.title}</Text>
                <Text style={styles.muted}>Seller: {listing.seller} · {listing.campus}</Text>
              </View>
              <Text style={styles.asking}>LKR {listing.price.toLocaleString()}</Text>
            </View>
            <Text style={styles.label}>Quick discount suggestions</Text>
            <View style={styles.discountRow}>
              {discounts.map((discount) => (
                <Pressable
                  key={discount}
                  style={[styles.discount, selectedDiscount === discount && styles.discountActive]}
                  onPress={() => applyDiscount(discount)}
                >
                  <Text style={styles.discountText}>{discount}% OFF</Text>
                  <Text style={styles.discountPrice}>
                    LKR {Math.round(listing.price * (1 - discount / 100))}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.label}>Your proposed price (LKR)</Text>
            <TextInput
              value={offerPrice}
              onChangeText={(value) => { setOfferPrice(value); setSelectedDiscount(0); }}
              keyboardType="numeric"
              placeholder="Enter offer amount"
              placeholderTextColor="#87918C"
              style={styles.input}
            />
            {savings > 0 && (
              <Text style={styles.savings}>
                You save LKR {savings.toLocaleString()} ({Math.round((savings / listing.price) * 100)}% discount)
              </Text>
            )}
            <Text style={styles.label}>Add a quick note for {listing.seller}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.notes}>
              {quickNotes.map((quickNote) => (
                <Pressable key={quickNote} style={[styles.note, note === quickNote && styles.noteActive]} onPress={() => setNote(quickNote)}>
                  <Text style={styles.noteText}>{quickNote}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              placeholder="Add a message for the seller"
              placeholderTextColor="#87918C"
              style={[styles.input, styles.textArea]}
            />
            <Pressable disabled={!Number.isFinite(numericOffer) || numericOffer <= 0} style={[styles.submit, (!Number.isFinite(numericOffer) || numericOffer <= 0) && styles.disabled]} onPress={submit}>
              <Text style={styles.submitText}>Send offer · LKR {numericOffer > 0 ? numericOffer.toLocaleString() : "0"}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  backdropTouch: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  sheet: { maxHeight: "88%", backgroundColor: "#F8FAF8", borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20, backgroundColor: "#FFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, borderBottomWidth: 1, borderBottomColor: "#E9ECE6" },
  badge: { color: "#1F5D4C", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  title: { color: "#173C34", fontSize: 20, fontWeight: "800", marginTop: 4 },
  subtitle: { color: "#87918C", fontSize: 12, marginTop: 2 },
  close: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#F0F2ED", alignItems: "center", justifyContent: "center" },
  closeText: { color: "#546059", fontSize: 22 },
  body: { padding: 20, paddingBottom: 32 },
  summary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#FFF", borderRadius: 16, borderWidth: 1, borderColor: "#E9ECE6", marginBottom: 16 },
  summaryText: { flex: 1, paddingRight: 8 },
  listingTitle: { color: "#173C34", fontWeight: "800", fontSize: 14 },
  asking: { color: "#173C34", fontWeight: "800" },
  muted: { color: "#87918C", fontSize: 12, marginTop: 4 },
  label: { color: "#24483D", fontSize: 13, fontWeight: "700", marginTop: 8, marginBottom: 8 },
  discountRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  discount: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#E0E5DC", backgroundColor: "#FFF" },
  discountActive: { backgroundColor: "#EBF3EE", borderColor: "#1F5D4C" },
  discountText: { color: "#1F5D4C", fontSize: 11, fontWeight: "800" },
  discountPrice: { color: "#173C34", fontSize: 10, marginTop: 3 },
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E0E5DC", borderRadius: 12, padding: 13, color: "#173C34", fontSize: 14 },
  textArea: { minHeight: 70, textAlignVertical: "top", marginTop: 8 },
  savings: { color: "#23775D", backgroundColor: "#EBF3EE", padding: 10, borderRadius: 10, marginTop: 8, fontSize: 12 },
  notes: { gap: 8, paddingBottom: 2 },
  note: { borderRadius: 18, backgroundColor: "#ECEFE9", paddingHorizontal: 12, paddingVertical: 9 },
  noteActive: { backgroundColor: "#D6E5D7" },
  noteText: { color: "#49635A", fontSize: 11 },
  submit: { backgroundColor: "#1F5D4C", borderRadius: 14, padding: 15, alignItems: "center", marginTop: 16 },
  disabled: { opacity: 0.5 },
  submitText: { color: "#FFF", fontWeight: "800" },
});

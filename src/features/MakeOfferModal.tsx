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

export function MakeOfferView({
  listing,
  currentUserName,
  onBack,
  onClose,
  onSubmitOffer,
}: {
  listing: Listing | null;
  currentUserName?: string;
  onBack?: () => void;
  onClose: () => void;
  onSubmitOffer: (offer: Offer) => void;
}) {
  const [offerPrice, setOfferPrice] = useState("");
  const [note, setNote] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  useEffect(() => {
    if (listing) {
      const defaultDiscount = Math.round(listing.price * 0.9);
      setOfferPrice(String(defaultDiscount));
      setSelectedPreset(10);
      setNote("Can collect at campus library!");
    } else {
      setOfferPrice("");
      setNote("");
      setSelectedPreset(null);
    }
  }, [listing]);

  if (!listing) return null;

  const quickDiscounts = [
    { label: "5% OFF", percent: 5 },
    { label: "10% OFF", percent: 10 },
    { label: "15% OFF", percent: 15 },
    { label: "20% OFF", percent: 20 },
  ];

  const quickNotes = [
    "Can pick up today",
    "Cash on delivery ready",
    "Can meet at campus library",
    "Can meet at student canteen",
  ];

  const applyDiscount = (percent: number) => {
    setSelectedPreset(percent);
    const discounted = Math.round(listing.price * (1 - percent / 100));
    setOfferPrice(String(discounted));
  };

  const handleCustomChange = (val: string) => {
    setOfferPrice(val);
    setSelectedPreset(null);
  };

  const numericOffer = Number(offerPrice);
  const savings = listing.price - (Number.isFinite(numericOffer) ? numericOffer : 0);

  const handleSubmit = () => {
    if (!Number.isFinite(numericOffer) || numericOffer <= 0) {
      Alert.alert("Invalid Offer", "Please enter a valid offer amount.");
      return;
    }
    if (numericOffer > listing.price) {
      Alert.alert(
        "Offer Higher Than Asking Price",
        "Your offer is higher than the seller's asking price. You can buy directly instead!"
      );
      return;
    }
    if (numericOffer < listing.price * 0.3) {
      Alert.alert(
        "Offer Too Low",
        "Campus etiquette: Offers lower than 30% of asking price are usually declined."
      );
      return;
    }

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      buyerName: currentUserName || "Campus Student",
      originalPrice: listing.price,
      offerPrice: numericOffer,
      note: note.trim() || undefined,
      status: "pending",
      createdAt: "Just now",
    };

    onSubmitOffer(newOffer);
    Alert.alert(
      "Offer Sent! 🤝",
      `Your offer of LKR ${numericOffer.toLocaleString()} was sent to ${listing.seller}. You will receive a message if accepted.`
    );
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
          <Text style={styles.badge}>FEATURE 2 · PRICE NEGOTIATION</Text>
          <Text style={styles.title}>Make an Offer</Text>
          <Text style={styles.subtitle}>Negotiate a fair student price</Text>
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
        {/* Listing Summary Card */}
        <View style={styles.listingCard}>
          <View style={styles.listingInfo}>
            <Text style={styles.listingTitle} numberOfLines={1}>
              {listing.title}
            </Text>
            <Text style={styles.sellerText}>
              Seller: <Text style={styles.sellerName}>{listing.seller}</Text> · {listing.campus}
            </Text>
          </View>
          <View style={styles.priceColumn}>
            <Text style={styles.priceLabel}>Asking Price</Text>
            <Text style={styles.originalPrice}>LKR {listing.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Quick Discount Presets */}
        <Text style={styles.sectionLabel}>Quick Discount Suggestions</Text>
        <View style={styles.presetsRow}>
          {quickDiscounts.map((preset) => {
            const discountedPrice = Math.round(listing.price * (1 - preset.percent / 100));
            const isSelected = selectedPreset === preset.percent;
            return (
              <Pressable
                key={preset.percent}
                style={[styles.presetCard, isSelected && styles.presetCardActive]}
                onPress={() => applyDiscount(preset.percent)}
              >
                <Text style={[styles.presetPercent, isSelected && styles.presetPercentActive]}>
                  {preset.label}
                </Text>
                <Text style={[styles.presetPrice, isSelected && styles.presetPriceActive]}>
                  LKR {discountedPrice}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Your Offer Input */}
        <Text style={styles.sectionLabel}>Your Proposed Price (LKR) *</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.currencyPrefix}>LKR</Text>
          <TextInput
            value={offerPrice}
            onChangeText={handleCustomChange}
            keyboardType="numeric"
            placeholder="Enter offer amount"
            placeholderTextColor="#87918C"
            style={styles.field}
          />
        </View>

        {savings > 0 ? (
          <View style={styles.savingsBanner}>
            <Text style={styles.savingsText}>
              🎉 You save <Text style={styles.savingsAmount}>LKR {savings.toLocaleString()}</Text> ({Math.round((savings / listing.price) * 100)}% discount)
            </Text>
          </View>
        ) : null}

        {/* Quick Message Chips */}
        <Text style={styles.sectionLabel}>Add a quick note for {listing.seller}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.notesRow}
        >
          {quickNotes.map((quickNote) => (
            <Pressable
              key={quickNote}
              style={[styles.noteChip, note === quickNote && styles.noteChipActive]}
              onPress={() => setNote(quickNote)}
            >
              <Text style={[styles.noteChipText, note === quickNote && styles.noteChipTextActive]}>
                {quickNote}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Can meet after class today or tomorrow morning..."
          placeholderTextColor="#87918C"
          multiline
          numberOfLines={2}
          style={[styles.field, styles.textArea]}
        />

        {/* Submit Offer Button */}
        <Pressable
          disabled={!offerPrice || numericOffer <= 0}
          style={[
            styles.submitButton,
            (!offerPrice || numericOffer <= 0) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            Send Offer · LKR {numericOffer > 0 ? numericOffer.toLocaleString() : "0"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

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
        <MakeOfferView
          listing={listing}
          currentUserName={currentUserName}
          onClose={onClose}
          onSubmitOffer={onSubmitOffer}
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
  listingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 16,
  },
  listingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 4,
  },
  sellerText: {
    fontSize: 12,
    color: "#87918C",
  },
  sellerName: {
    color: "#1F5D4C",
    fontWeight: "700",
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 10,
    color: "#87918C",
    fontWeight: "600",
  },
  originalPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173C34",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#24483D",
    marginBottom: 8,
    marginTop: 6,
  },
  presetsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  presetCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E0E5DC",
    alignItems: "center",
  },
  presetCardActive: {
    backgroundColor: "#EBF3EE",
    borderColor: "#1F5D4C",
  },
  presetPercent: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1F5D4C",
  },
  presetPercentActive: {
    color: "#1F5D4C",
  },
  presetPrice: {
    fontSize: 12,
    color: "#546059",
    fontWeight: "600",
    marginTop: 2,
  },
  presetPriceActive: {
    color: "#173C34",
    fontWeight: "800",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F5D4C",
    marginRight: 8,
  },
  field: {
    flex: 1,
    fontSize: 16,
    color: "#173C34",
    paddingVertical: 12,
    fontWeight: "700",
  },
  savingsBanner: {
    backgroundColor: "#EAF5EE",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  savingsText: {
    fontSize: 12,
    color: "#1F5D4C",
    fontWeight: "600",
  },
  savingsAmount: {
    fontWeight: "800",
  },
  notesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  noteChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E5DC",
  },
  noteChipActive: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },
  noteChipText: {
    fontSize: 12,
    color: "#546059",
    fontWeight: "600",
  },
  noteChipTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },
  textArea: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#173C34",
    height: 60,
    textAlignVertical: "top",
    fontWeight: "normal",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#A0B5AC",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
});

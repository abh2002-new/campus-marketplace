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
import { Listing, MeetupPlan } from "../types";

const campusSafeSpots: Record<string, string[]> = {
  "University of Moratuwa": [
    "📚 Main Library Entrance & Lobby",
    "☕ L-Block Central Canteen",
    "🛡️ Main Security Gate & Post",
    "🏟️ Gymnasium Ground Pavilion",
  ],
  "University of Colombo": [
    "📚 Main Library Lawn / Porch",
    "☕ Science Faculty Canteen",
    "🏛️ Arts Faculty Quadrangle",
    "🛡️ Reid Avenue Main Gate",
  ],
  "University of Peradeniya": [
    "📚 University Central Library Steps",
    "☕ WUS Building & Canteen",
    "🏛️ Senate Building Front Entrance",
    "🛡️ Galaha Junction Security Post",
  ],
  "University of Sri Jayewardenepura": [
    "📚 Main Library Entrance Lobby",
    "🏛️ Sri Sumangala Building Front",
    "☕ Management Faculty Canteen",
    "🛡️ Main Campus Security Gate",
  ],
  "University of Kelaniya": [
    "📚 Central Library Main Steps",
    "☕ Dharmaloka Hall Canteen",
    "🏛️ Science Faculty Ground Floor",
    "🛡️ Colombo-Kandy Road Gate",
  ],
};

const defaultSpots = [
  "📚 University Main Library Entrance",
  "☕ Student Union & Central Canteen",
  "🛡️ Campus Main Security Gate",
  "🏛️ Faculty Administrative Lobby",
];

export function MeetupSchedulerView({
  listing,
  onBack,
  onClose,
  onConfirmMeetup,
}: {
  listing: Listing | null;
  onBack?: () => void;
  onClose: () => void;
  onConfirmMeetup: (plan: MeetupPlan) => void;
}) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Lunch Break (12:00 - 01:30 PM)");
  const [notes, setNotes] = useState("");

  const uniName = listing?.university || listing?.campus || "Campus";
  const availableSpots = campusSafeSpots[uniName] || defaultSpots;

  useEffect(() => {
    if (availableSpots.length > 0) {
      setSelectedLocation(availableSpots[0]);
      setSelectedDate("Today");
      setSelectedTimeSlot("Lunch Break (12:00 - 01:30 PM)");
      setNotes("");
    }
  }, [uniName]);

  if (!listing) return null;

  const dateOptions = ["Today", "Tomorrow", "In 2 Days", "This Friday"];
  const timeSlots = [
    "Morning (09:30 - 11:00 AM)",
    "Lunch Break (12:00 - 01:30 PM)",
    "Afternoon (02:30 - 04:00 PM)",
    "Evening (04:30 - 06:00 PM)",
  ];

  const handleConfirm = () => {
    const plan: MeetupPlan = {
      id: `meetup-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      sellerName: listing.seller,
      campus: uniName,
      location: selectedLocation,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes: notes.trim() || undefined,
    };

    onConfirmMeetup(plan);
    Alert.alert(
      "Safe Meetup Scheduled! 🤝",
      `Location: ${selectedLocation}\nDate: ${selectedDate}\nTime: ${selectedTimeSlot}\n\nA proposal has been sent to ${listing.seller}.`
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
          <Text style={styles.badge}>FEATURE 3 · SAFE CAMPUS EXCHANGE</Text>
          <Text style={styles.title}>Safe Meetup Coordinator</Text>
          <Text style={styles.subtitle}>
            Exchange items safely on campus with verified meeting spots
          </Text>
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
        {/* Listing details */}
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>{listing.title}</Text>
          <Text style={styles.itemSub}>
            Meeting with: <Text style={styles.sellerName}>{listing.seller}</Text> · 📍 {uniName}
          </Text>
        </View>

        {/* Designated Safe Zones */}
        <Text style={styles.sectionLabel}>
          1. Choose a Safe Campus Exchange Spot
        </Text>
        <Text style={styles.sectionHelp}>
          Public campus zones with high student foot-traffic & security presence.
        </Text>
        <View style={styles.spotsList}>
          {availableSpots.map((spot) => {
            const isSelected = selectedLocation === spot;
            return (
              <Pressable
                key={spot}
                style={[styles.spotCard, isSelected && styles.spotCardActive]}
                onPress={() => setSelectedLocation(spot)}
              >
                <Text style={[styles.spotText, isSelected && styles.spotTextActive]}>
                  {spot}
                </Text>
                {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>

        {/* Date Selection */}
        <Text style={styles.sectionLabel}>2. Meetup Date</Text>
        <View style={styles.dateRow}>
          {dateOptions.map((date) => (
            <Pressable
              key={date}
              style={[styles.dateChip, selectedDate === date && styles.dateChipActive]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dateChipText,
                  selectedDate === date && styles.dateChipTextActive,
                ]}
              >
                {date}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Time Slot Selection */}
        <Text style={styles.sectionLabel}>3. Time Window</Text>
        <View style={styles.timeSlots}>
          {timeSlots.map((slot) => (
            <Pressable
              key={slot}
              style={[
                styles.slotCard,
                selectedTimeSlot === slot && styles.slotCardActive,
              ]}
              onPress={() => setSelectedTimeSlot(slot)}
            >
              <Text
                style={[
                  styles.slotText,
                  selectedTimeSlot === slot && styles.slotTextActive,
                ]}
              >
                {slot}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Safety Pledge */}
        <View style={styles.safetyBox}>
          <Text style={styles.safetyTitle}>🛡️ Student Safety Guidelines</Text>
          <Text style={styles.safetyItem}>
            • Meet only in daytime / well-lit public campus buildings
          </Text>
          <Text style={styles.safetyItem}>
            • Inspect item condition thoroughly before transferring payment
          </Text>
          <Text style={styles.safetyItem}>
            • Never invite unfamiliar buyers/sellers into private dorms/boarding rooms
          </Text>
        </View>

        {/* Optional Meetup note */}
        <Text style={styles.sectionLabel}>Notes / Landmark (Optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. I will be wearing a blue hoodie near the library turnstiles..."
          placeholderTextColor="#87918C"
          style={styles.field}
        />

        {/* Confirm button */}
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>
            Propose Safe Meetup with {listing.seller}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export function MeetupSchedulerModal({
  visible,
  listing,
  onClose,
  onConfirmMeetup,
}: {
  visible: boolean;
  listing: Listing | null;
  onClose: () => void;
  onConfirmMeetup: (plan: MeetupPlan) => void;
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
        <MeetupSchedulerView
          listing={listing}
          onClose={onClose}
          onConfirmMeetup={onConfirmMeetup}
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
  itemCard: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 12,
    color: "#87918C",
  },
  sellerName: {
    color: "#1F5D4C",
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#24483D",
    marginBottom: 4,
    marginTop: 6,
  },
  sectionHelp: {
    fontSize: 11,
    color: "#87918C",
    marginBottom: 10,
  },
  spotsList: {
    gap: 8,
    marginBottom: 16,
  },
  spotCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
  },
  spotCardActive: {
    backgroundColor: "#EBF3EE",
    borderColor: "#1F5D4C",
  },
  spotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#24483D",
    flex: 1,
  },
  spotTextActive: {
    fontWeight: "800",
    color: "#1F5D4C",
  },
  checkMark: {
    color: "#1F5D4C",
    fontWeight: "900",
    fontSize: 16,
    marginLeft: 8,
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  dateChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E5DC",
    alignItems: "center",
  },
  dateChipActive: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#546059",
  },
  dateChipTextActive: {
    color: "#FFF",
  },
  timeSlots: {
    gap: 8,
    marginBottom: 16,
  },
  slotCard: {
    backgroundColor: "#FFF",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
  },
  slotCardActive: {
    backgroundColor: "#EBF3EE",
    borderColor: "#1F5D4C",
  },
  slotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#24483D",
  },
  slotTextActive: {
    color: "#1F5D4C",
    fontWeight: "800",
  },
  safetyBox: {
    backgroundColor: "#F3F7F4",
    borderWidth: 1,
    borderColor: "#CFDFD4",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1F5D4C",
    marginBottom: 6,
  },
  safetyItem: {
    fontSize: 11,
    color: "#3F584C",
    lineHeight: 16,
    marginBottom: 4,
  },
  field: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: "#173C34",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 16,
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
});

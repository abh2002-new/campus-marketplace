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
import { categories, universities } from "../data";
import { ItemRequest } from "../types";

const initialRequests: ItemRequest[] = [
  {
    id: "req-1",
    title: "Engineering Mathematics Volume 2 (K.A. Stroud)",
    category: "Textbooks",
    university: "University of Moratuwa",
    maxBudget: 2500,
    urgency: "urgent",
    requesterName: "Kavindu P.",
    description: "Urgent for semester 2 midterms. Clean copy preferred.",
    createdAt: "2 hours ago",
  },
  {
    id: "req-2",
    title: "Casio fx-991EX ClassWiz Calculator",
    category: "Tech",
    university: "University of Colombo",
    maxBudget: 4500,
    urgency: "urgent",
    requesterName: "Sanduni M.",
    description: "Looking for an original scientific calculator in working condition.",
    createdAt: "5 hours ago",
  },
  {
    id: "req-3",
    title: "Medical Lab Coat (Size Medium) & Goggles",
    category: "Fashion",
    university: "University of Peradeniya",
    maxBudget: 1800,
    urgency: "normal",
    requesterName: "Nisith F.",
    description: "For 1st year biochemistry lab practicals.",
    createdAt: "Yesterday",
  },
  {
    id: "req-4",
    title: "T-Square & A1 Drafting Board",
    category: "Furniture",
    university: "University of Moratuwa",
    maxBudget: 3500,
    urgency: "normal",
    requesterName: "Dinuka T.",
    description: "Architecture 1st year student looking for second hand drawing kit.",
    createdAt: "2 days ago",
  },
];

export function ItemRequestsModal({
  visible,
  onClose,
  currentCampus,
  currentUserName,
  onContactRequester,
}: {
  visible: boolean;
  onClose: () => void;
  currentCampus: string;
  currentUserName?: string;
  onContactRequester: (request: ItemRequest) => void;
}) {
  const [activeTab, setActiveTab] = useState<"browse" | "post">("browse");
  const [requests, setRequests] = useState<ItemRequest[]>(initialRequests);
  const [filterCampus, setFilterCampus] = useState<string>("All Campuses");

  // Post form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [university, setUniversity] = useState(currentCampus || universities[0]);
  const [budget, setBudget] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [description, setDescription] = useState("");

  const handlePostRequest = () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter what you are looking for.");
      return;
    }
    const numBudget = Number(budget);
    if (!budget || isNaN(numBudget) || numBudget <= 0) {
      Alert.alert("Invalid budget", "Please enter your target budget in LKR.");
      return;
    }

    const newRequest: ItemRequest = {
      id: `req-${Date.now()}`,
      title: title.trim(),
      category,
      university,
      maxBudget: numBudget,
      urgency,
      requesterName: currentUserName || "Campus Student",
      description: description.trim() || "No extra notes provided.",
      createdAt: "Just now",
    };

    setRequests([newRequest, ...requests]);
    Alert.alert(
      "Request Posted! 📢",
      "Other campus students can now see what you need and reach out to you."
    );
    setTitle("");
    setBudget("");
    setDescription("");
    setActiveTab("browse");
  };

  const filteredRequests = requests.filter(
    (req) => filterCampus === "All Campuses" || req.university === filterCampus
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.badge}>FEATURE 1 · CAMPUS WANTED</Text>
              <Text style={styles.title}>Student Request Board</Text>
              <Text style={styles.subtitle}>
                Can't find an item? Ask your campus community!
              </Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === "browse" && styles.tabActive]}
              onPress={() => setActiveTab("browse")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "browse" && styles.tabTextActive,
                ]}
              >
                Browse Requests ({requests.length})
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === "post" && styles.tabActive]}
              onPress={() => setActiveTab("post")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "post" && styles.tabTextActive,
                ]}
              >
                + Post Request
              </Text>
            </Pressable>
          </View>

          {activeTab === "browse" ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
              {/* Filter by Campus */}
              <Text style={styles.sectionLabel}>Filter by Campus</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.campusFilters}
              >
                {["All Campuses", ...universities.slice(0, 6)].map((campusName) => (
                  <Pressable
                    key={campusName}
                    onPress={() => setFilterCampus(campusName)}
                    style={[
                      styles.filterChip,
                      filterCampus === campusName && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filterCampus === campusName && styles.filterChipTextActive,
                      ]}
                    >
                      {campusName}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Request Cards */}
              {filteredRequests.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No requests yet for this campus</Text>
                  <Text style={styles.emptySubtitle}>
                    Be the first student to post a request!
                  </Text>
                </View>
              ) : (
                filteredRequests.map((req) => (
                  <View key={req.id} style={styles.requestCard}>
                    <View style={styles.requestHeader}>
                      <View style={styles.urgencyBadgeWrap}>
                        <Text
                          style={[
                            styles.urgencyText,
                            req.urgency === "urgent" && styles.urgentText,
                          ]}
                        >
                          {req.urgency === "urgent" ? "🔥 URGENT NEED" : "📌 REQUEST"}
                        </Text>
                      </View>
                      <Text style={styles.categoryBadge}>{req.category}</Text>
                    </View>

                    <Text style={styles.requestTitle}>{req.title}</Text>
                    {req.description ? (
                      <Text style={styles.requestDesc}>{req.description}</Text>
                    ) : null}

                    <View style={styles.requestMeta}>
                      <Text style={styles.metaCampus}>📍 {req.university}</Text>
                      <Text style={styles.metaTime}>{req.createdAt}</Text>
                    </View>

                    <View style={styles.requestFooter}>
                      <View>
                        <Text style={styles.budgetText}>Target Budget</Text>
                        <Text style={styles.budgetAmount}>
                          LKR {req.maxBudget.toLocaleString()}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.respondButton}
                        onPress={() => onContactRequester(req)}
                      >
                        <Text style={styles.respondButtonText}>I have this! 💬</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
              <Text style={styles.label}>What are you looking for? *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Physics for Scientists & Engineers"
                placeholderTextColor="#87918C"
                style={styles.field}
              />

              <Text style={styles.label}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                {categories
                  .filter((c) => c !== "All items")
                  .map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.chip,
                        category === cat && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          category === cat && styles.chipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
              </ScrollView>

              <Text style={styles.label}>Your University Campus</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                {universities.map((uni) => (
                  <Pressable
                    key={uni}
                    onPress={() => setUniversity(uni)}
                    style={[
                      styles.chip,
                      university === uni && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        university === uni && styles.chipTextActive,
                      ]}
                    >
                      {uni}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.label}>Maximum Budget (LKR) *</Text>
              <TextInput
                value={budget}
                onChangeText={setBudget}
                placeholder="e.g. 2500"
                placeholderTextColor="#87918C"
                keyboardType="numeric"
                style={styles.field}
              />

              <Text style={styles.label}>Urgency Level</Text>
              <View style={styles.urgencyOptions}>
                <Pressable
                  style={[
                    styles.urgencyOption,
                    urgency === "normal" && styles.urgencyOptionActive,
                  ]}
                  onPress={() => setUrgency("normal")}
                >
                  <Text
                    style={[
                      styles.urgencyOptionText,
                      urgency === "normal" && styles.urgencyOptionTextActive,
                    ]}
                  >
                    🌱 Normal (Anytime this month)
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.urgencyOption,
                    urgency === "urgent" && styles.urgencyOptionActiveUrgent,
                  ]}
                  onPress={() => setUrgency("urgent")}
                >
                  <Text
                    style={[
                      styles.urgencyOptionText,
                      urgency === "urgent" && styles.urgencyOptionTextUrgent,
                    ]}
                  >
                    🔥 Urgent (Exams / Deadlines soon)
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Extra Notes / Condition Needed</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. Need with syllabus notes, clean condition..."
                placeholderTextColor="#87918C"
                multiline
                numberOfLines={3}
                style={[styles.field, styles.textArea]}
              />

              <Pressable style={styles.primaryButton} onPress={handlePostRequest}>
                <Text style={styles.primaryButtonText}>Publish Campus Request</Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
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
    maxHeight: "90%",
    minHeight: "75%",
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
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECE6",
  },
  tab: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#1F5D4C",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#87918C",
  },
  tabTextActive: {
    color: "#1F5D4C",
  },
  body: {
    padding: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#546059",
    marginBottom: 8,
  },
  campusFilters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E5DC",
  },
  filterChipActive: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },
  filterChipText: {
    fontSize: 12,
    color: "#546059",
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },
  requestCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  urgencyBadgeWrap: {
    backgroundColor: "#EBF3EE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#1F5D4C",
  },
  urgentText: {
    color: "#C3535B",
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#87918C",
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#173C34",
    marginBottom: 4,
  },
  requestDesc: {
    fontSize: 13,
    color: "#546059",
    lineHeight: 18,
    marginBottom: 10,
  },
  requestMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F4F6F2",
    marginBottom: 12,
  },
  metaCampus: {
    fontSize: 12,
    color: "#87918C",
  },
  metaTime: {
    fontSize: 11,
    color: "#A0AAA4",
  },
  requestFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetText: {
    fontSize: 11,
    color: "#87918C",
    fontWeight: "600",
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1C7057",
  },
  respondButton: {
    backgroundColor: "#1F5D4C",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  respondButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#24483D",
    marginTop: 12,
    marginBottom: 6,
  },
  field: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E5DC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#173C34",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  chips: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E5DC",
  },
  chipActive: {
    backgroundColor: "#1F5D4C",
    borderColor: "#1F5D4C",
  },
  chipText: {
    fontSize: 12,
    color: "#546059",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },
  urgencyOptions: {
    flexDirection: "row",
    gap: 10,
  },
  urgencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E5DC",
    borderRadius: 12,
    alignItems: "center",
  },
  urgencyOptionActive: {
    backgroundColor: "#EBF3EE",
    borderColor: "#1F5D4C",
  },
  urgencyOptionActiveUrgent: {
    backgroundColor: "#FDECEF",
    borderColor: "#C3535B",
  },
  urgencyOptionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#546059",
    textAlign: "center",
  },
  urgencyOptionTextActive: {
    color: "#1F5D4C",
  },
  urgencyOptionTextUrgent: {
    color: "#C3535B",
  },
  primaryButton: {
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#173C34",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#87918C",
    marginTop: 4,
  },
});

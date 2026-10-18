import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListingCard } from "../components/ListingCard";
import { categories } from "../data";
import { Listing } from "../types";

export function ExplorePage({
  items,
  query,
  category,
  campus,
  minPrice,
  maxPrice,
  campuses,
  savedIds,
  onQueryChange,
  onCategoryChange,
  onCampusChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSave,
  onOpen,
  onProfile,
  avatarUrl,
  onRequestBoard,
}: {
  items: Listing[];
  query: string;
  category: string;
  campus: string;
  minPrice: string;
  maxPrice: string;
  campuses: string[];
  savedIds: string[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCampusChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSave: (id: string) => void;
  onOpen: (item: Listing) => void;
  onProfile: () => void;
  avatarUrl?: string | null;
  onRequestBoard?: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>CAMPUS MARKETPLACE</Text>
          <Text style={styles.heading}>
            Find your next{"\n"}favorite thing.
          </Text>
        </View>
        <Pressable style={styles.avatar} onPress={onProfile}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-outline" size={22} color="#225347" />
          )}
        </Pressable>
      </View>
      <View style={styles.search}>
        <Text style={styles.icon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search textbooks, desks, tech..."
          placeholderTextColor="#87918C"
          style={styles.input}
        />
      </View>
      {onRequestBoard ? (
        <Pressable style={styles.requestBanner} onPress={onRequestBoard}>
          <View style={styles.requestBannerIconWrap}>
            <Text style={styles.requestBannerIcon}>📢</Text>
          </View>
          <View style={styles.requestBannerContent}>
            <Text style={styles.requestBannerTitle}>Student Request Board</Text>
            <Text style={styles.requestBannerSubtitle}>
              Can't find what you need? Post a request to campus peers!
            </Text>
          </View>
          <Text style={styles.requestBannerArrow}>›</Text>
        </Pressable>
      ) : null}
      <View style={styles.campusPanel}>
        <Text style={styles.campusEyebrow}>SHOP NEAR YOU</Text>
        <Text style={styles.campusHeading}>Where are you studying?</Text>
        <Text style={styles.campusMessage}>
          Choose your campus to see items available from students nearby.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.campusChoices}
        >
          {campuses.map((value) => (
            <Pressable
              key={value}
              onPress={() => onCampusChange(value)}
              style={[styles.campusChoice, campus === value && styles.selectedCampus]}
            >
              <Text
                style={[
                  styles.campusChoiceText,
                  campus === value && styles.selectedCampusText,
                ]}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={styles.priceFilter}>
        <Text style={styles.filterTitle}>Filter by price (LKR)</Text>
        <View style={styles.priceInputs}>
          <TextInput
            value={minPrice}
            onChangeText={onMinPriceChange}
            placeholder="Minimum"
            placeholderTextColor="#87918C"
            keyboardType="numeric"
            style={styles.priceInput}
          />
          <Text style={styles.priceSeparator}>—</Text>
          <TextInput
            value={maxPrice}
            onChangeText={onMaxPriceChange}
            placeholder="Maximum"
            placeholderTextColor="#87918C"
            keyboardType="numeric"
            style={styles.priceInput}
          />
        </View>
      </View>
      <View style={styles.section}>
        <View>
          <Text style={styles.sectionTitle}>Browse near you</Text>
          <Text style={styles.muted}>Good finds, close by</Text>
        </View>
        <Text style={styles.seeAll}>{items.length} items</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {categories.map((value) => (
          <Pressable
            key={value}
            onPress={() => onCategoryChange(value)}
            style={[
              styles.category,
              category === value && styles.activeCategory,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                category === value && styles.activeText,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.filterLabel}>
        <Text style={styles.filterTitle}>Browse by category</Text>
      </View>
      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {campus
              ? "No items match your search in this campus yet."
              : "Select your campus to see items available nearby."}
          </Text>
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={savedIds.includes(item.id)}
            onSave={() => onSave(item.id)}
            onOpen={() => onOpen(item)}
          />
        )}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 28,
    paddingBottom: 24,
  },
  eyebrow: {
    color: "#65766D",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  heading: {
    color: "#173C34",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 21 },
  avatarText: { color: "#225347", fontWeight: "800" },
  search: {
    height: 52,
    backgroundColor: "#FFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E6E9E2",
  },
  icon: { color: "#49635A", fontSize: 28, marginRight: 8 },
  input: { flex: 1, color: "#173C34", fontSize: 14 },
  requestBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF5EE",
    borderWidth: 1,
    borderColor: "#CFDFD4",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  requestBannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  requestBannerIcon: {
    fontSize: 18,
  },
  requestBannerContent: {
    flex: 1,
  },
  requestBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#173C34",
  },
  requestBannerSubtitle: {
    fontSize: 11,
    color: "#546059",
    marginTop: 2,
  },
  requestBannerArrow: {
    fontSize: 22,
    color: "#1F5D4C",
    fontWeight: "700",
    marginLeft: 6,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#173C34",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  muted: { color: "#87918C", fontSize: 12 },
  seeAll: { color: "#23775D", fontWeight: "700", fontSize: 12 },
  categories: { gap: 8, paddingBottom: 22 },
  campusPanel: {
    backgroundColor: "#E6F0E6",
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },
  campusEyebrow: {
    color: "#23775D",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  campusHeading: {
    color: "#173C34",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 5,
  },
  campusMessage: { color: "#65766D", fontSize: 12, lineHeight: 18, marginTop: 5 },
  campusChoices: { gap: 8, paddingTop: 14 },
  campusChoice: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingHorizontal: 13,
    minHeight: 36,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D2E2D3",
  },
  selectedCampus: { backgroundColor: "#1F5D4C", borderColor: "#1F5D4C" },
  campusChoiceText: { color: "#365B4C", fontSize: 11, fontWeight: "700" },
  selectedCampusText: { color: "#FFF" },
  filterLabel: { marginBottom: 8 },
  filterTitle: { color: "#65766D", fontSize: 11, fontWeight: "700" },
  priceFilter: { marginBottom: 22 },
  priceInputs: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  priceInput: {
    flex: 1,
    height: 42,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E9E2",
    paddingHorizontal: 12,
    color: "#173C34",
    fontSize: 13,
  },
  priceSeparator: { color: "#87918C", marginHorizontal: 8 },
  category: {
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#ECEFE9",
  },
  activeCategory: { backgroundColor: "#1F5D4C" },
  categoryText: { color: "#64736C", fontSize: 12, fontWeight: "700" },
  activeText: { color: "#FFF" },
  grid: { gap: 14 },
  columns: { gap: 14 },
  empty: { textAlign: "center", color: "#87918C", padding: 30 },
});

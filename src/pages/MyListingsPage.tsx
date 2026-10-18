import { FlatList, ScrollView, StyleSheet } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ListingCard } from "../components/ListingCard";
import { PageTitle } from "../components/PageTitle";
import { Listing } from "../types";
export function MyListingsPage({
  items,
  onOpen,
  onSell,
  onEdit,
  onDelete,
}: {
  items: Listing[];
  onOpen: (item: Listing) => void;
  onSell: () => void;
  onEdit: (item: Listing) => void;
  onDelete: (item: Listing) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <PageTitle
        title="My listings"
        subtitle="Items you have posted to campus marketplace"
      />
      <FlatList
        data={items}
        scrollEnabled={false}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <EmptyState
            title="No listings yet"
            message="Publish an item and it will appear here."
            action="Sell an item"
            onAction={onSell}
          />
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            saved={false}
            onSave={() => undefined}
            onOpen={() => onOpen(item)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        )}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  columns: { gap: 14 },
  grid: { gap: 14 },
});

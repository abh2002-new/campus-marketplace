import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { PageTitle } from "../components/PageTitle";
import { Conversation } from "../types";

export function MessagesPage({
  conversations,
  onBrowse,
  onOpen,
}: {
  conversations: Conversation[];
  onBrowse: () => void;
  onOpen: (conversation: Conversation) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <PageTitle title="Messages" subtitle="Keep campus meetups simple" />
      {conversations.length === 0 ? (
        <EmptyState
          title="Your inbox is quiet"
          message="When you message a seller, conversations will show up here."
          action="Browse listings"
          onAction={onBrowse}
        />
      ) : (
        <View style={styles.list}>
          {conversations.map((conversation) => (
            <Pressable
              key={conversation.id}
              style={styles.row}
              onPress={() => onOpen(conversation)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {conversation.sellerName.slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.seller}>{conversation.sellerName}</Text>
                <Text style={styles.listing} numberOfLines={1}>
                  About {conversation.listingTitle}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 110 },
  list: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9ECE6",
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1EC",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D6E5D7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#225347", fontWeight: "800" },
  details: { flex: 1, marginLeft: 12 },
  seller: { color: "#24483D", fontWeight: "800", fontSize: 14 },
  listing: { color: "#87918C", fontSize: 12, marginTop: 5 },
  chevron: { color: "#87918C", fontSize: 24, marginLeft: 12 },
});

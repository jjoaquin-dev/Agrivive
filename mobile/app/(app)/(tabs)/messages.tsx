import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, MessageCircle, Search, SlidersHorizontal, X } from "lucide-react-native";
import { useSellerConversations } from "../../../src/features/conversations/hooks/useSellerConversations";
import { useSellerProductInquiries } from "../../../src/features/messages/hooks/useSellerProductInquiries";
import { ConversationListItem } from "../../../src/features/conversations/components/ConversationListItem";
import { ProductInquiryCard } from "../../../src/features/messages/components/ProductInquiryCard";
import { ConversationFilterModal, type FilterTab, type SortOption } from "../../../src/features/conversations/components/ConversationFilterModal";
import { styles } from "../../../src/features/conversations/components/SellerMessagesStyles";

export default function SellerMessagesScreen() {
  const router = useRouter();
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const direct = useSellerConversations();
  const web = useSellerProductInquiries();

  const totalDirectUnread = useMemo(
    () => direct.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    [direct.conversations],
  );

  const filteredConversations = useMemo(() => {
    let list = direct.conversations;
    if (filterTab === "unread") list = list.filter((c) => c.unreadCount > 0);
    else if (filterTab === "inquiries") list = list.filter((c) => c.contextType !== "order");
    else if (filterTab === "reservations") list = list.filter((c) => c.contextType === "order");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => c.buyerName?.toLowerCase().includes(q) || c.productName?.toLowerCase().includes(q) || c.lastMessageBody?.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      if (sortBy === "unread") {
        if ((b.unreadCount > 0) !== (a.unreadCount > 0)) {
          return b.unreadCount > 0 ? 1 : -1;
        }
      }
      const timeA = new Date(a.lastMessageAt).getTime();
      const timeB = new Date(b.lastMessageAt).getTime();
      return sortBy === "oldest" ? timeA - timeB : timeB - timeA;
    });
  }, [direct.conversations, filterTab, searchQuery, sortBy]);

  const hasCustomFilter = filterTab !== "all" || sortBy !== "newest";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ChevronLeft size={22} color="#111827" />
          </Pressable>
          <View style={styles.titleColumn}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>{totalDirectUnread > 0 ? `${totalDirectUnread} unread` : "All caught up"}</Text>
          </View>
          <View style={styles.actionRow}>
            <Pressable onPress={() => setSearchOpen((prev) => !prev)} style={[styles.iconButton, searchOpen && styles.iconButtonActive]}>
              <Search size={18} color={searchOpen ? "#16A34A" : "#374151"} />
            </Pressable>
            <Pressable onPress={() => setFilterOpen(true)} style={[styles.iconButton, hasCustomFilter && styles.iconButtonActive]}>
              <SlidersHorizontal size={18} color={hasCustomFilter ? "#16A34A" : "#374151"} />
              {hasCustomFilter && <View style={styles.filterDot} />}
            </Pressable>
          </View>
        </View>

        <View style={styles.filterRow}>
          {[
            { key: "all", label: "All" },
            { key: "unread", label: totalDirectUnread > 0 ? `Unread ${totalDirectUnread}` : "Unread" },
            { key: "inquiries", label: "Inquiries" },
            { key: "reservations", label: "Reservations" },
            { key: "web", label: "Web Inquiries" },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setFilterTab(tab.key as FilterTab)}
              style={[styles.filterChip, filterTab === tab.key && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, filterTab === tab.key && styles.filterChipTextActive]}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {searchOpen && (
          <View style={styles.searchBar}>
            <Search size={16} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search conversations..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              autoFocus
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <X size={16} color="#9CA3AF" />
              </Pressable>
            ) : null}
          </View>
        )}
      </View>

      <ConversationFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        activeFilter={filterTab}
        onSelectFilter={setFilterTab}
        activeSort={sortBy}
        onSelectSort={setSortBy}
        onReset={() => {
          setFilterTab("all");
          setSortBy("newest");
        }}
      />

      {filterTab === "web" ? (
        <FlatList
          data={web.inquiries}
          keyExtractor={(item) => item.id}
          onEndReached={web.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={web.loadingMore ? <ActivityIndicator color="#16A34A" style={styles.loader} /> : null}
          refreshControl={<RefreshControl refreshing={web.refreshing} onRefresh={web.refresh} colors={["#16A34A"]} />}
          renderItem={({ item }) => <ProductInquiryCard inquiry={item} onReply={web.reply} isReplying={web.replyingId === item.id} />}
          ListEmptyComponent={
            web.loading ? (
              <ActivityIndicator color="#16A34A" style={styles.loader} />
            ) : (
              <View style={styles.empty}>
                <MessageCircle size={32} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No web inquiries</Text>
                <Text style={styles.muted}>Questions asked on the marketplace will appear here.</Text>
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          onEndReached={direct.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={direct.loadingMore ? <ActivityIndicator color="#16A34A" style={styles.loader} /> : null}
          refreshControl={<RefreshControl refreshing={direct.refreshing} onRefresh={direct.refresh} colors={["#16A34A"]} />}
          renderItem={({ item }) => (
            <ConversationListItem
              conversation={item}
              onPress={() => router.push({ pathname: "/(app)/conversations/[id]", params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={
            direct.loading ? (
              <ActivityIndicator color="#16A34A" style={styles.loader} />
            ) : (
              <View style={styles.empty}>
                <MessageCircle size={36} color="#9CA3AF" />
                <Text style={styles.emptyTitle}>No conversations found</Text>
                <Text style={styles.muted}>Messages with buyers will appear here.</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

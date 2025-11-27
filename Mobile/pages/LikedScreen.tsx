import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Text } from "../components/atoms/Text";
import { Header } from "../components/organisms/Header";
import { Person } from "../types";
import { useLikedPeople } from "../hooks/usePeople";

export const LikedScreen: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLikedPeople();
  const safeAreaTop = Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

  const likedPeople: Person[] = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const renderItem = ({ item }: { item: Person }) => {
    const mainPhoto = item.photos[0]?.url || "http://192.168.1.17:8000/assets/foto2.png";
    
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Image source={{ uri: mainPhoto }} style={styles.image} />
        <View style={styles.overlay}>
          <View style={styles.infoContainer}>
            <Text variant="h3" style={styles.name}>
              {item.name}, {item.age}
            </Text>
            {item.distance && (
              <View style={styles.distanceContainer}>
                <Text style={styles.distanceIcon}>⊙</Text>
                <Text variant="caption" style={styles.distance}>
                  {item.distance}km away
                </Text>
              </View>
            )}
          </View>
          <View style={styles.likeIndicator}>
            <Text style={styles.heartIcon}>♥</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: safeAreaTop, flex: 1, justifyContent: "center", alignItems: "center" }]}>
        <Header />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
          <Text variant="body" style={{ textAlign: "center", color: "#888", fontSize: 16 }}>
            Loading liked people...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaTop }]}>
      <Header />
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text variant="h1" style={styles.title}>
            People You Liked
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {likedPeople.length} {likedPeople.length === 1 ? "person" : "people"}
          </Text>
        </View>

        {isError ? (
          <View style={styles.emptyContainer}>
            <Text variant="h2" style={styles.emptyText}>
              Failed to load liked people
            </Text>
            <Text variant="body" style={styles.emptySubtext}>
              Please try again later.
            </Text>
          </View>
        ) : likedPeople.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>♥</Text>
            <Text variant="h2" style={styles.emptyText}>
              No likes yet
            </Text>
            <Text variant="body" style={styles.emptySubtext}>
              Start swiping to find people you like
            </Text>
          </View>
        ) : (
          <FlatList
            data={likedPeople}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.4}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
  },
  listContainer: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    aspectRatio: 0.75,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceIcon: {
    color: "#fff",
    fontSize: 10,
  },
  distance: {
    color: "#fff",
    fontSize: 12,
  },
  likeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    color: "#fff",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    color: "#f0f0f0",
    marginBottom: 16,
  },
  emptyText: {
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  emptySubtext: {
    color: "#666",
    textAlign: "center",
  },
});


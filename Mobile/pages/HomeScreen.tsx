import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { usePeople, useLikePerson, useDislikePerson } from "../hooks/usePeople";
import { usePeopleContext } from "../store";
import { SwipeDeck } from "../components/organisms/SwipeDeck";
import { Header } from "../components/organisms/Header";
import { Person } from "../types";
import { Text } from "../components/atoms/Text";

export const HomeScreen: React.FC = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePeople();
  const likeMutation = useLikePerson();
  const dislikeMutation = useDislikePerson();
  
  const {
    likedPeople,
    setLikedPeople,
    dislikedPeople,
    setDislikedPeople,
  } = usePeopleContext();

  const safeAreaTop = Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0;

  // Create people array from API data
  const people = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);
  
  const handleSwipeRight = async (person: Person) => {
    try {
      const response = await likeMutation.mutateAsync(person.id);
      // setLikedPeople((prev) => [...prev, person]);

      if (response.match) {
        Alert.alert(
          "It's a Match!",
          `You and ${person.name} liked each other!`
        );
      }

      // Fetch next page jika tinggal sedikit (preload)
      if (people.length <= 2 && hasNextPage) {
        fetchNextPage();
      }
    } catch (error) {
      console.error("Error liking person:", error);
    }
  };

  const handleSwipeLeft = async (person: Person) => {
    try {
      await dislikeMutation.mutateAsync(person.id);
      // setDislikedPeople((prev) => [...prev, person]);

      // Fetch next page jika tinggal sedikit (preload)
      if (people.length <= 2 && hasNextPage) {
        fetchNextPage();
      }
    } catch (error) {
      console.error("Error disliking person:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: safeAreaTop }]}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4458" />
          <Text variant="body" style={styles.loadingText}>
            Loading people...
          </Text>
        </View>
      </View>
    );
  }

  if (people.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: safeAreaTop }]}>
        <Header />
        <View style={styles.emptyContainer}>
          <Text variant="h2" style={styles.emptyText}>
            No more people
          </Text>
          <Text variant="body" style={styles.emptySubtext}>
            Check back later for more matches
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaTop }]}>
      <Header currentIndex={0} totalCards={people.length} />
      <View style={styles.content}>
        <SwipeDeck
          people={people}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          loading={likeMutation.isPending || dislikeMutation.isPending}
        />
        {isFetchingNextPage && (
          <View style={styles.loadingMore}>
            <ActivityIndicator size="small" color="#FF4458" />
          </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    color: "#666",
    textAlign: "center",
  },
  loadingMore: {
    padding: 10,
    alignItems: "center",
  },
});

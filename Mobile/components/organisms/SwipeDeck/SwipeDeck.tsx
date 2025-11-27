import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  PanResponderInstance,
  Image,
} from "react-native";
import { Person } from "../../../types";
import { PersonCard } from "../../molecules/PersonCard";
import { ActionButtons } from "../../molecules/ActionButtons";
import likeImg from "../../../assets/icons/like.png";
import nopeImg from "../../../assets/icons/nope.png";

interface SwipeDeckProps {
  people: Person[];
  onSwipeLeft: (person: Person) => void;
  onSwipeRight: (person: Person) => void;
  loading?: boolean;
}

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;
const SWIPE_VELOCITY = 0.3;

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  people,
  onSwipeLeft,
  onSwipeRight,
  loading = false,
}) => {
  const [swipeAction, setSwipeAction] = useState<"like" | "dislike" | null>(
    null
  );
  const [renderKey, setRenderKey] = useState(0); // Force re-render when internal list changes
  const peopleRef = useRef<Person[]>([]);
  const syncBlockedRef = useRef(false); // Block sync dari props.people sementara setelah swipe
  
  const position = useRef(new Animated.ValueXY()).current;
  const nextCardAnim = useRef(new Animated.Value(0)).current;
  
  /**
   * Sink data dari props.people ke internal deck list:
   * - Pertama kali: isi penuh dari props
   * - Selanjutnya: HANYA append orang baru (mis. dari pagination)
   *   -> Tidak pernah meng-inject kembali orang yang sudah di-swipe
   */
  useEffect(() => {
    if (syncBlockedRef.current) {
      // Saat sedang animasi swipe & update internal list, abaikan perubahan dari props
      return;
    }
    if (!people || people.length === 0) return;

    const current = peopleRef.current;

    // Initial load: kalau deck masih kosong, ambil semua dari props
    if (current.length === 0) {
      peopleRef.current = people;
      setRenderKey((prev) => prev + 1);
      return;
    }

    // Append only new persons (by id) untuk menghindari munculnya kembali card yang sudah di-swipe
    const existingIds = new Set(current.map((p) => p.id));
    const newOnes = people.filter((p) => !existingIds.has(p.id));

    if (newOnes.length > 0) {
      peopleRef.current = [...current, ...newOnes];
      setRenderKey((prev) => prev + 1);
    }
  }, [people]);
  
  // Preload next 5 images untuk smooth transition
  useEffect(() => {
    const preloadPeople = peopleRef.current.slice(0, 5);
    preloadPeople.forEach((person) => {
      const imageUrl = person.photos[0]?.url;
      if (imageUrl) {
        Image.prefetch(imageUrl).catch(() => {
          // Ignore preload errors
        });
      }
    });
  }, [renderKey]);

  const rotate = position.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-30deg", "0deg", "30deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  

  const panResponder = useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });

        // Tentukan aksi saat user MULAI geser (bukan setelah swipe selesai)
        const nextAction: "like" | "dislike" | null =
          gestureState.dx > 20
            ? "like"
            : gestureState.dx < -20
            ? "dislike"
            : null;

        setSwipeAction((prev) => (prev === nextAction ? prev : nextAction));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (
          gestureState.dx > SWIPE_THRESHOLD ||
          gestureState.vx > SWIPE_VELOCITY
        ) {
          // Swipe right (like)
          handleSwipeRight();
        } else if (
          gestureState.dx < -SWIPE_THRESHOLD ||
          gestureState.vx < -SWIPE_VELOCITY
        ) {
          // Swipe left (dislike)
          handleSwipeLeft();
        } else {
          // Return to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipeRight = (source: "gesture" | "button" = "gesture") => {
    const currentPeople = peopleRef.current;
    if (currentPeople.length === 0) return;
    const swipedPerson = currentPeople[0];

    // Block sync dari props selama animasi + sedikit buffer
    syncBlockedRef.current = true;

    // Animasi kartu atas keluar dan kartu bawah naik secara parallel dengan easing yang lebih halus
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: width + 140, y: 20 },
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(nextCardAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Hapus card yang di-swipe dari ref SEBELUM mutation, supaya tidak sempat muncul lagi
      peopleRef.current = currentPeople.slice(1);
      setRenderKey((prev) => prev + 1); // Force re-render
      
      // Reset position
      position.setValue({ x: 0, y: 0 });
      nextCardAnim.setValue(0);
      if (source === "gesture") setSwipeAction(null);
      
      // Panggil mutation dengan person
      onSwipeRight(swipedPerson);

      // Buka kembali sync setelah sedikit delay untuk menghindari flash dari invalidation React Query
      setTimeout(() => {
        syncBlockedRef.current = false;
      }, 350);
    });
  };

  const handleSwipeLeft = (source: "gesture" | "button" = "gesture") => {
    const currentPeople = peopleRef.current;
    if (currentPeople.length === 0) return;
    const swipedPerson = currentPeople[0];

    // Block sync dari props selama animasi + sedikit buffer
    syncBlockedRef.current = true;

    // Animasi kartu atas keluar dan kartu bawah naik secara parallel
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: -width - 140, y: 20 },
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(nextCardAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Hapus card yang di-swipe dari ref SEBELUM mutation
      peopleRef.current = currentPeople.slice(1);
      setRenderKey((prev) => prev + 1); // Force re-render
      
      // Reset position
      position.setValue({ x: 0, y: 0 });
      nextCardAnim.setValue(0);
      if (source === "gesture") setSwipeAction(null);
      
      // Panggil mutation dengan person
      onSwipeLeft(swipedPerson);

      // Buka kembali sync setelah sedikit delay untuk menghindari flash dari invalidation React Query
      setTimeout(() => {
        syncBlockedRef.current = false;
      }, 350);
    });
  };

  const handleDislike = () => {
    // dipanggil dari tombol -> ActionButtons sudah mengurus animasi
    handleSwipeLeft("button");
  };

  const handleLike = () => {
    // dipanggil dari tombol -> ActionButtons sudah mengurus animasi
    handleSwipeRight("button");
  };

  const handleRewind = () => {
    // Rewind functionality would need to be implemented differently
    // without currentIndex - typically would require state management
    // to track swipe history
    position.setValue({ x: 0, y: 0 });
  };

  const currentPeople = peopleRef.current;

  if (currentPeople.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard} />
      </View>
    );
  }

  

  return (
    <View style={styles.container}>
      {/* Render semua cards, dari belakang ke depan */}
      {currentPeople.map((person, index) => {
        const isTopCard = index === 0;
        const scale = 1 - (index * 0.02); // Setiap card 2% lebih kecil
        const translateY = index * 15; // Setiap card 15px lebih ke bawah

        return (
          <Animated.View
            key={person.id}
            style={[
              styles.card,
              {
                zIndex: currentPeople.length - index,
                // opacity: isTopCard ? 1 : 0.8,
                transform: isTopCard
                  ? [
                      { translateX: position.x },
                      { translateY: position.y },
                      { rotate },
                    ]
                  : [
                      { scale },
                      { translateY },
                    ],
              },
            ]}
            pointerEvents={isTopCard ? 'auto' : 'none'}
            {...(isTopCard ? panResponder.panHandlers : {})}
          >
            <View style={styles.cardInner}>
              {isTopCard && (
                <>
                  <Animated.View style={[styles.badgeLike, { opacity: likeOpacity }]}>
                    <Image source={likeImg} style={styles.badgeImage} />
                  </Animated.View>
                  <Animated.View style={[styles.badgeNope, { opacity: nopeOpacity }]}>
                    <Image source={nopeImg} style={styles.badgeImage} />
                  </Animated.View>
                </>
              )}
              <PersonCard person={person} onLikePress={isTopCard ? handleLike : undefined} />
            </View>
          </Animated.View>
        );
      })}

      <View style={styles.actionsWrapper}>
        <ActionButtons
          onRewind={handleRewind}
          onDislike={handleDislike}
          onLike={handleLike}
          loading={loading}
          swipeAction={swipeAction}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: width,
    height: width * 1.5,
    bottom: 75,
  },
  cardInner: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    width: width,
    height: width * 1.5,
    backgroundColor: "#f0f0f0",
  },
  badgeLike: {
    position: "absolute",
    top: 40,
    left: 32,
    zIndex: 1010,
  },
  badgeNope: {
    position: "absolute",
    top: 40,
    right: 32,
    zIndex: 1010,
  },
  badgeImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  actionsWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10000,
  },
});

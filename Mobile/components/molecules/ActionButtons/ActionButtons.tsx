import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Animated,
  Easing,
} from "react-native";
import Refresh from "../../../assets/icons/refresh.png";
import Close from "../../../assets/icons/close.png";
import Love from "../../../assets/icons/love.png";

interface ActionButtonsProps {
  onRewind?: () => void;
  onDislike: () => void;
  onSuperLike?: () => void;
  onLike: () => void;
  onBoost?: () => void;
  loading?: boolean;
  // dipicu dari luar (swipe) hanya untuk animasi visual, tanpa memanggil onLike/onDislike lagi
  swipeAction?: ActiveAction;
}

type ActiveAction = "like" | "dislike" | null;

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRewind,
  onDislike,
  onSuperLike,
  onLike,
  onBoost,
  loading = false,
  swipeAction,
}) => {
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<any>(null);

  const runAnimation = (action: ActiveAction, callback?: () => void) => {
    if (loading || !action) return;

    // Stop animasi sebelumnya jika ada
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // mulai dari sedikit mengecil
    scaleAnim.setValue(0.8);
    setActiveAction(action);

    animationRef.current = Animated.sequence([
      // spring kecil untuk efek pop
      Animated.spring(scaleAnim, {
        toValue: 1.05, // sedikit overshoot
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // kembali ke ukuran normal dengan timing + easing
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]);
    
    animationRef.current.start(() => {
      animationRef.current = null;
      setActiveAction(null);
      callback?.();
    });
  };

  const handleLikePress = () => {
    runAnimation("like", onLike);
  };

  const handleDislikePress = () => {
    runAnimation("dislike", onDislike);
  };

  // Trigger animasi dari swipe (tanpa memanggil onLike/onDislike lagi)
  useEffect(() => {
    if (swipeAction) {
      // Trigger animasi hanya jika ada swipeAction
      runAnimation(swipeAction);
    } else {
      // Reset jika swipeAction null
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      setActiveAction(null);
      scaleAnim.setValue(1);
    }
  }, [swipeAction]);

  // Saat animasi LIKE berjalan: hanya tampilkan tombol like dengan animasi
  if (activeAction === "like") {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.button,
            styles.likeButton,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.likeIcon}>♥</Text>
        </Animated.View>
      </View>
    );
  }

  // Saat animasi DISLIKE berjalan: hanya tampilkan tombol dislike dengan animasi
  if (activeAction === "dislike") {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.button,
            styles.dislikeButton,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Image source={Close} style={{ width: 40, height: 40 }} />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.rewindButton]}
        onPress={onRewind}
        disabled={loading || !onRewind}
        activeOpacity={0.7}
      >
        <Image source={Refresh} style={{ width: 30, height: 30 }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.dislikeButton]}
        onPress={handleDislikePress}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Image source={Close} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.likeButton]}
        onPress={handleLikePress}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.likeIcon}>♥</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    // backgroundColor: '#fff',
  },
  button: {
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  rewindButton: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    width: 40,
    height: 40,
  },
  rewindIcon: {
    fontSize: 24,
    color: "#FF4458",
  },
  dislikeButton: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    width: 56,
    height: 56,
  },
  dislikeIcon: {
    fontSize: 28,
    color: "#FF4458",
    fontWeight: "bold",
  },
  superLikeButton: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    position: "relative",
  },
  superLikeIcon: {
    fontSize: 24,
    color: "#2196F3",
  },
  likeButton: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    width: 56,
    height: 56,
  },
  likeIcon: {
    fontSize: 40,
    color: "#4CAF50",
  },
  boostButton: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    position: "relative",
  },
  boostIcon: {
    fontSize: 24,
    color: "#9C27B0",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledOverlay: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF4458",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledX: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

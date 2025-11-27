import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Person } from "../../../types";
import { Text } from "../../atoms/Text";

interface PersonCardProps {
  person: Person;
  onLikePress?: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export const PersonCard: React.FC<PersonCardProps> = ({
  person,
}) => {
  const mainPhoto =
    person.photos[0]?.url || "http://192.168.1.17:8000/assets/foto2.png";
  const isOnline = true; // Can be from person data

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: mainPhoto }}
        style={styles.image}
        fadeDuration={0}
      />
      <View style={styles.overlay}>
        <View style={styles.infoContainer}>
          {isOnline && (
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text variant="caption" style={styles.onlineText}>
                접속 중
              </Text>
            </View>
          )}
          <Text variant="h2" style={styles.name}>
            {person.name} {person.age}
          </Text>
          {person.distance && (
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceIcon}>⊙</Text>
              <Text variant="body" style={styles.distance}>
                {person.distance}km 거리에 있음
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,

    overflow: "hidden",
    // backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 30,
    paddingHorizontal: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 4,
  },
  onlineText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  name: {
    color: "#fff",
    fontSize: 28,
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
    fontSize: 12,
  },
  distance: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.95,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  likeIcon: {
    color: "#fff",
    fontSize: 28,
  },
});

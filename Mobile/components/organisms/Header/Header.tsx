import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
// Header.tsx
import Logo from "../../../assets/icons/logo.png";
interface HeaderProps {
  currentIndex?: number;
  totalCards?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentIndex = 0,
  totalCards = 0,
}) => {
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    marginTop: 18,
    height: 25,
    width: 105,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    width: "100%",
    maxWidth: 200,
  },
  progressSegment: {
    flex: 1,
    height: 3,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  progressSegmentActive: {
    backgroundColor: "#FF4458",
  },
});

import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import Home from "../../../assets/icons/home.png";

interface BottomNavigationProps {
  activeTab?: "home" | "likes" | "messages" | "profile";
  onTabPress?: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = "home",
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress?.("home")}
        activeOpacity={0.7}
      >
        <Image style={{ width: 45, height: 45 }} source={Home} />
        {activeTab === "home" && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress?.("likes")}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, activeTab === "likes" && styles.activeIcon]}>
          ♥
        </Text>
        {activeTab === "likes" && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    // borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 8,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  disabledTab: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 24,
    color: "#999",
    marginBottom: 4,
  },
  activeIcon: {
    color: "#FF4458",
  },
  tabLabel: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 3,
    backgroundColor: "#FF4458",
    borderRadius: 2,
  },
  disabledOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF4458",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledX: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
  },
});

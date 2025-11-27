import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text } from "react-native";
import { SplashScreenPage } from "../pages/SplashScreen";
import { HomeScreen } from "../pages/HomeScreen";
import { LikedScreen } from "../pages/LikedScreen";
import Home from "../assets/icons/home.png";

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Home: undefined;
  Liked: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          paddingVertical: 8,
          paddingBottom: 20,
          height: 70,
        },
        tabBarActiveTintColor: "#FF4458",
        tabBarInactiveTintColor: "#999",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: 45, height: 45, tintColor: focused ? "#FF4458" : "#999" }}
              source={Home}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Liked"
        component={LikedScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 26, color }}>♥</Text>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreenPage} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

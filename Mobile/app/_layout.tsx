import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  NavigationContainer,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import "react-native-gesture-handler";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppNavigator } from "../navigation/AppNavigator";
// import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from "@/hooks/use-color-scheme";
import { PeopleProvider } from "../store";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PeopleProvider>
      <QueryClientProvider client={queryClient}>
        {/* <NavigationContainer> */}
          <StatusBar style="auto" />
          <AppNavigator />
        {/* </NavigationContainer> */}
      </QueryClientProvider>
    </PeopleProvider>
  );
}

import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { Text } from '../components/atoms/Text';
import { RootStackParamList } from '../navigation/AppNavigator';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

SplashScreen.preventAutoHideAsync();

export const SplashScreenPage: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
      navigation.replace('MainTabs');
    };
    prepare();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Tinder
      </Text>
      <ActivityIndicator size="large" color="#FF4458" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FF4458',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});


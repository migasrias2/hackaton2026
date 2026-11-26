import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Mona-Regular': require('../../assets/fonts/MonaSans-Regular.ttf'),
    'Mona-Medium': require('../../assets/fonts/MonaSans-Medium.ttf'),
    'Mona-SemiBold': require('../../assets/fonts/MonaSans-SemiBold.ttf'),
    'Mona-Bold': require('../../assets/fonts/MonaSans-Bold.ttf'),
    'Mona-ExtraBold': require('../../assets/fonts/MonaSans-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </>
  );
}

/* eslint-disable import/no-duplicates -- entry requires gesture-handler side-effect before named imports */
import 'react-native-gesture-handler';

import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#0B1020' },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

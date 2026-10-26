import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { OrdersProvider } from '@/contexts/orders-context';

import { FavoritesProvider } from '@/contexts/favorites-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import MarketplaceBottomNav from '@/components/marketplace-bottom-nav';
import { CartProvider } from '@/contexts/cart-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <FavoritesProvider>
      <CartProvider>
        <OrdersProvider>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <AnimatedSplashOverlay />
            <View style={styles.container}>
              <View style={styles.content}>
                <Stack screenOptions={{ headerShown: false }} />
              </View>
              <MarketplaceBottomNav />
            </View>
          </ThemeProvider>
        </OrdersProvider>
      </CartProvider>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

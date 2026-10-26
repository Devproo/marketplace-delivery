import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCart } from '@/contexts/cart-context';

const tabs = [
  { icon: '⌂', label: 'Home', path: '/' },
  { icon: '🛒', label: 'Cart', path: '/cart' },
  { icon: '▤', label: 'Orders', path: '/orders' },
  { icon: '♙', label: 'Profile', path: '/profile' },
] as const;

export default function MarketplaceBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const active =
          tab.path === '/'
            ? pathname === '/'
            : pathname === tab.path ||
              pathname.startsWith(`${tab.path}/`);

        return (
          <Pressable
            key={tab.label}
            accessibilityRole="button"
            accessibilityLabel={
              tab.label === 'Cart' && itemCount > 0
                ? `Cart, ${itemCount} items`
                : tab.label
            }
            accessibilityState={{ selected: active }}
            style={styles.navItem}
            onPress={() => router.navigate(tab.path)}
          >
            <View style={styles.iconContainer}>
              <Text style={[styles.navIcon, active && styles.activeNavIcon]}>
                {tab.icon}
              </Text>
              {tab.path === '/cart' && itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.navLabel, active && styles.activeNavLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 72,
    paddingTop: 9,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EEE9',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 23,
    color: '#87928B',
  },
  activeNavIcon: {
    color: '#27834F',
  },
  navLabel: {
    fontSize: 10,
    color: '#87928B',
  },
  activeNavLabel: {
    fontWeight: '700',
    color: '#27834F',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -12,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D94841',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});

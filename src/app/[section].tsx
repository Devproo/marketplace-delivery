import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '@/contexts/favorites-context';
import { useOrders } from '@/contexts/orders-context';

const sections = {
  favorites: {
    title: 'Favorites',
    subtitle: 'Your favorite stores, all in one place.',
    icon: '♡',
  },
  orders: {
    title: 'My Orders',
    subtitle: 'Track your orders and see what you have ordered.',
    icon: '📦',
  },
  profile: {
    title: 'My Profile',
    subtitle: 'Manage your account and preferences.',
    icon: '👤',
  },
} as const;

type Section = keyof typeof sections;

export default function SectionScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const currentSection =
    section && section in sections
      ? sections[section as Section]
      : sections.favorites;

  const activeSection = section as Section;

  const { favoriteStores, toggleFavorite } = useFavorites();
  const { orders } = useOrders();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>YOUR MARKETPLACE</Text>
      <Text style={styles.title}>{currentSection.title}</Text>
      <Text style={styles.subtitle}>{currentSection.subtitle}</Text>

      {activeSection === 'favorites' && (
        <View>
          {favoriteStores.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.largeIcon}>♡</Text>
              <Text style={styles.cardTitle}>Your favorites live here</Text>
              <Text style={styles.description}>
                Save the stores you love and find them quickly whenever you need
                them.
              </Text>
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.primaryButtonText}>Explore stores</Text>
              </Pressable>
            </View>
          ) : (
            favoriteStores.map((storeName) => {
              const store = [
                {
                  name: 'Fresh Market',
                  icon: '🥬',
                  category: 'Groceries',
                  delivery: '15–25 min',
                },
                {
                  name: 'Burger House',
                  icon: '🍔',
                  category: 'Fast food',
                  delivery: '20–30 min',
                },
                {
                  name: 'Daily Pharmacy',
                  icon: '💊',
                  category: 'Health & care',
                  delivery: '10–20 min',
                },
              ].find((item) => item.name === storeName);

              if (!store) return null;

              return (
                <View
                  key={store.name}
                  style={styles.favoriteCard}
                >
                  <Pressable
                    style={styles.favoriteInfo}
                    onPress={() =>
                      router.push({
                        pathname: '/store/[name]',
                        params: { name: store.name },
                      })
                    }
                  >
                    <Text style={styles.favoriteStoreIcon}>{store.icon}</Text>
                    <View style={styles.favoriteStoreDetails}>
                      <Text style={styles.favoriteStoreName}>{store.name}</Text>
                      <Text style={styles.favoriteStoreCategory}>
                        {store.category}
                      </Text>
                      <Text style={styles.favoriteStoreDelivery}>
                        {store.delivery}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={styles.removeFavoriteButton}
                    accessibilityRole='button'
                    accessibilityLabel={`Remove ${store.name} from favorites`}
                    onPress={() => toggleFavorite(store.name)}
                  >
                    <Text style={styles.removeFavoriteIcon}>❤️</Text>
                  </Pressable>
                </View>
              );
            })
          )}
        </View>
      )}

      {activeSection === 'orders' && (
        <View>
          {orders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.largeIcon}>📦</Text>
              <Text style={styles.cardTitle}>No orders yet</Text>
              <Text style={styles.description}>
                Your orders and their delivery status will appear here when you
                start shopping.
              </Text>
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.primaryButtonText}>Start shopping</Text>
              </Pressable>
            </View>
          ) : (
            orders.map((order) => (
              <View
                key={order.id}
                style={styles.orderCard}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderDetails}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.orderDivider} />

                {order.items.map((item, index) => (
                  <View
                    key={`${order.id}-${item.id}-${index}`}
                    style={styles.orderItem}
                  >
                    <Text style={styles.orderItemIcon}>{item.icon}</Text>
                    <View style={styles.orderItemDetails}>
                      <Text style={styles.orderItemName}>{item.name}</Text>
                      <Text style={styles.orderItemQuantity}>
                        Qty: {item.quantity}
                      </Text>
                    </View>
                    <Text style={styles.orderItemPrice}>
                      EGP {(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View style={styles.orderDivider} />

                <Text style={styles.orderAddressLabel}>DELIVERY ADDRESS</Text>
                <Text style={styles.orderAddress}>📍 {order.address}</Text>

                <View style={styles.orderTotalRow}>
                  <Text style={styles.orderTotalLabel}>Items subtotal</Text>
                  <Text style={styles.orderAmount}>
                    EGP {order.subtotal.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.orderTotalRow}>
                  <Text style={styles.orderTotalLabel}>Delivery fee</Text>
                  <Text style={styles.orderAmount}>
                    EGP {order.deliveryFee.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.orderTotalRow}>
                  <Text style={styles.orderGrandTotalLabel}>Order total</Text>
                  <Text style={styles.orderGrandTotal}>
                    EGP {order.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {activeSection === 'profile' && (
        <>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={styles.cardTitle}>Welcome!</Text>
            <Text style={styles.description}>
              Your personal marketplace account
            </Text>
          </View>

          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Account settings</Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>📍 Delivery location</Text>
              <Text style={styles.settingValue}>Banha, Egypt</Text>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>🔔 Notifications</Text>
              <Pressable
                onPress={() => setNotificationsEnabled((enabled) => !enabled)}
                style={[
                  styles.toggle,
                  notificationsEnabled && styles.toggleEnabled,
                ]}
                accessibilityRole='switch'
                accessibilityState={{ checked: notificationsEnabled }}
              >
                <Text style={styles.toggleText}>
                  {notificationsEnabled ? 'On' : 'Off'}
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.settingRow}
              onPress={() => router.push("/favorites")}
              accessibilityRole="button"
              accessibilityLabel="View favorites"
            >
              <Text style={styles.settingLabel}>❤️ My Favorites</Text>
              <Text style={styles.link}>View favorites →</Text>
            </Pressable>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>🛍️ Shopping</Text>
              <Pressable onPress={() => router.push('/')}>
                <Text style={styles.link}>Browse stores →</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  eyebrow: {
    color: '#718078',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: '#183C2B',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#718078',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 26,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EEE9',
    padding: 12,
    marginBottom: 12,
  },
  favoriteInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteStoreIcon: {
    width: 58,
    height: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    backgroundColor: '#F0F5F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  favoriteStoreDetails: {
    flex: 1,
  },
  favoriteStoreName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183C2B',
  },
  favoriteStoreCategory: {
    marginTop: 4,
    fontSize: 12,
    color: '#718078',
  },
  favoriteStoreDelivery: {
    marginTop: 7,
    fontSize: 11,
    color: '#526C5B',
  },
  removeFavoriteButton: {
    minWidth: 40,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFavoriteIcon: {
    fontSize: 22,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  largeIcon: {
    color: '#248653',
    fontSize: 48,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#183C2B',
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: '#718078',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#248653',
    borderRadius: 12,
    marginTop: 22,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EEE9',
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  orderHeaderDetails: {
    flex: 1,
  },
  orderId: {
    color: '#183C2B',
    fontSize: 15,
    fontWeight: '800',
  },
  orderDate: {
    color: '#718078',
    fontSize: 11,
    marginTop: 5,
  },
  statusBadge: {
    backgroundColor: '#E0F2E6',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: '#248653',
    fontSize: 11,
    fontWeight: '700',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#EEF1EE',
    marginVertical: 14,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  orderItemIcon: {
    fontSize: 25,
    width: 34,
    textAlign: 'center',
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    color: '#30463A',
    fontSize: 13,
    fontWeight: '600',
  },
  orderItemQuantity: {
    color: '#718078',
    fontSize: 11,
    marginTop: 4,
  },
  orderItemPrice: {
    color: '#183C2B',
    fontSize: 12,
    fontWeight: '700',
  },
  orderAddressLabel: {
    color: '#718078',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  orderAddress: {
    color: '#30463A',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  orderTotalLabel: {
    color: '#718078',
    fontSize: 12,
  },
  orderAmount: {
    color: '#30463A',
    fontSize: 12,
  },
  orderGrandTotalLabel: {
    color: '#183C2B',
    fontSize: 14,
    fontWeight: '800',
  },
  orderGrandTotal: {
    color: '#248653',
    fontSize: 16,
    fontWeight: '800',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E8F4EC',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 14,
    width: 80,
  },
  avatarText: {
    fontSize: 36,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 18,
    paddingHorizontal: 18,
  },
  settingsTitle: {
    color: '#183C2B',
    fontSize: 16,
    fontWeight: '700',
    paddingTop: 20,
    paddingBottom: 8,
  },
  settingRow: {
    alignItems: 'center',
    borderTopColor: '#EEF1EE',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    gap: 12,
  },
  settingLabel: {
    color: '#30463A',
    fontSize: 14,
    flexShrink: 1,
  },
  settingValue: {
    color: '#718078',
    fontSize: 13,
  },
  link: {
    color: '#248653',
    fontSize: 13,
    fontWeight: '700',
  },
  toggle: {
    backgroundColor: '#EEF1EE',
    borderRadius: 16,
    minWidth: 54,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  toggleEnabled: {
    backgroundColor: '#E0F2E6',
  },
  toggleText: {
    color: '#248653',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});

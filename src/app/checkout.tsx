import { useCart } from '@/contexts/cart-context';
import { useOrders } from '@/contexts/orders-context';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const DELIVERY_FEE = 25;

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, itemCount, total, clearCart } = useCart();
  const [address, setAddress] = useState('');

  const orderTotal = total + DELIVERY_FEE;

  const { placeOrder } = useOrders();

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      Alert.alert(
        'Delivery address required',
        'Please enter your delivery address.',
      );
      return;
    }

    if (items.length === 0) {
      Alert.alert(
        'Your cart is empty',
        'Add some items before placing an order.',
      );
      return;
    }

    const order = placeOrder({
      items: items.map((item) => ({ ...item })),
      address: address.trim(),
      subtotal: total,
      deliveryFee: DELIVERY_FEE,
      total: total + DELIVERY_FEE,
    });

    clearCart();

    Alert.alert(
      'Order placed!',
      `Order ${order.id}\nTotal: EGP ${order.total.toFixed(2)}`,
      [
        {
          text: 'View orders',
          onPress: () => router.replace('/orders'),
        },
      ],
    );
  };
  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Stack.Screen options={{ title: 'Checkout' }} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.mutedText}>
          Add some products before checking out.
        </Text>
        <Pressable
          accessibilityRole='button'
          onPress={() => router.replace('/')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Explore stores</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Checkout' }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Delivery details</Text>

        <Text style={styles.fieldLabel}>Delivery address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder='Street, building, apartment...'
          placeholderTextColor='#929A93'
          multiline
          style={styles.addressInput}
          textAlignVertical='top'
        />

        <Text style={styles.sectionTitle}>Order summary</Text>

        {items.map((item) => (
          <View
            key={`${item.storeName}-${item.id}`}
            style={styles.orderItem}
          >
            <Text style={styles.productEmoji}>{item.icon}</Text>

            <View style={styles.itemInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {item.quantity} × EGP {item.price}
              </Text>
              <Text style={styles.storeName}>{item.storeName}</Text>
            </View>

            <Text style={styles.lineTotal}>
              EGP {(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Items ({itemCount})</Text>
            <Text style={styles.totalValue}>EGP {total.toFixed(2)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery fee</Text>
            <Text style={styles.totalValue}>EGP {DELIVERY_FEE.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              EGP {orderTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.demoNote}>
          Demo checkout only. No payment will be collected.
        </Text>

        <Pressable
          accessibilityRole='button'
          onPress={handlePlaceOrder}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            Place demo order · EGP {orderTotal.toFixed(2)}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#F8FAF8',
  },
  emptyTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#183C2B',
  },
  mutedText: {
    marginTop: 10,
    fontSize: 14,
    color: '#758078',
    textAlign: 'center',
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#183C2B',
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183C2B',
    marginBottom: 9,
  },
  addressInput: {
    minHeight: 105,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E9E2',
    padding: 14,
    fontSize: 15,
    color: '#183C2B',
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#183C2B',
    marginBottom: 14,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 13,
    marginBottom: 10,
  },
  productEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183C2B',
  },
  itemDetails: {
    fontSize: 12,
    color: '#27834F',
    marginTop: 4,
  },
  storeName: {
    fontSize: 11,
    color: '#758078',
    marginTop: 3,
  },
  lineTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#183C2B',
    marginLeft: 8,
  },
  totalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 17,
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  totalLabel: {
    fontSize: 14,
    color: '#758078',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#183C2B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EDE8',
    marginVertical: 10,
  },
  grandTotalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#183C2B',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#27834F',
  },
  demoNote: {
    fontSize: 12,
    color: '#758078',
    textAlign: 'center',
    marginTop: 18,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#27834F',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});

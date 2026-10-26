import { useCart } from '@/contexts/cart-context';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, clearCart, itemCount, total } = useCart();

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Your Cart' }} />

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyMessage}>
            Explore stores and add products to your cart.
          </Text>

          <Pressable
            accessibilityRole='button'
            onPress={() => router.replace('/')}
            style={styles.shopButton}
          >
            <Text style={styles.shopButtonText}>Explore stores</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.headingRow}>
              <Text style={styles.heading}>Your items</Text>
              <Text style={styles.itemCount}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
            </View>

            {items.map((item) => (
              <View
                key={`${item.storeName}-${item.id}`}
                style={styles.itemCard}
              >
                <View style={styles.productIcon}>
                  <Text style={styles.productEmoji}>{item.icon}</Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.storeName}>{item.storeName}</Text>
                  <Text style={styles.price}>EGP {item.price}</Text>

                  <View style={styles.quantityControl}>
                    <Pressable
                      accessibilityRole='button'
                      accessibilityLabel={`Remove one ${item.name}`}
                      onPress={() =>
                        updateQuantity(item.id, item.storeName, -1)
                      }
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>

                    <Text style={styles.quantity}>{item.quantity}</Text>

                    <Pressable
                      accessibilityRole='button'
                      accessibilityLabel={`Add one ${item.name}`}
                      onPress={() => updateQuantity(item.id, item.storeName, 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <Text style={styles.lineTotal}>
                  EGP {item.price * item.quantity}
                </Text>
              </View>
            ))}

            <Pressable
              accessibilityRole='button'
              onPress={clearCart}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear cart</Text>
            </Pressable>
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalAmount}>EGP {total}</Text>
            </View>

            <Text style={styles.deliveryNote}>
              Delivery fees are not included.
            </Text>

            <Pressable
              accessibilityRole='button'
              onPress={() => router.push('/checkout')}
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutButtonText}>
                Continue to checkout
              </Text>
            </Pressable>
          </View>
        </>
      )}
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
    paddingBottom: 28,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#183C2B',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#758078',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },
  shopButton: {
    backgroundColor: '#27834F',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#183C2B',
  },
  itemCount: {
    fontSize: 13,
    color: '#758078',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  productIcon: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#F2F6F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productEmoji: {
    fontSize: 27,
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183C2B',
  },
  storeName: {
    fontSize: 12,
    color: '#758078',
    marginTop: 3,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27834F',
    marginTop: 5,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 9,
  },
  quantityButton: {
    width: 27,
    height: 29,
    borderRadius: 8,
    backgroundColor: '#EAF4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27834F',
  },
  quantity: {
    minWidth: 27,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#183C2B',
  },
  lineTotal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#183C2B',
    marginLeft: 6,
  },
  clearButton: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B54747',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8EDE8',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#183C2B',
  },
  totalAmount: {
    fontSize: 21,
    fontWeight: '800',
    color: '#183C2B',
  },
  deliveryNote: {
    fontSize: 12,
    color: '#758078',
    marginTop: 6,
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: '#27834F',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

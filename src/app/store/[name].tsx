import { useCart } from '@/contexts/cart-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const stores = [
  {
    name: 'Fresh Market',
    icon: '🥬',
    category: 'Groceries',
    delivery: '15–25 min',
    products: [
      {
        id: '1',
        name: 'Fresh Apples',
        description: '1 kg',
        price: 65,
        icon: '🍎',
      },
      {
        id: '2',
        name: 'Fresh Bananas',
        description: '1 kg',
        price: 45,
        icon: '🍌',
      },
      {
        id: '3',
        name: 'Whole Milk',
        description: '1 litre',
        price: 40,
        icon: '🥛',
      },
      {
        id: '4',
        name: 'Fresh Bread',
        description: '1 pack',
        price: 25,
        icon: '🍞',
      },
    ],
  },
  {
    name: 'Burger House',
    icon: '🍔',
    category: 'Fast food',
    delivery: '20–30 min',
    products: [
      {
        id: '5',
        name: 'Classic Burger',
        description: 'Beef burger',
        price: 150,
        icon: '🍔',
      },
      {
        id: '6',
        name: 'Cheese Burger',
        description: 'Beef and cheese',
        price: 175,
        icon: '🍔',
      },
      {
        id: '7',
        name: 'French Fries',
        description: 'Regular portion',
        price: 60,
        icon: '🍟',
      },
      {
        id: '8',
        name: 'Soft Drink',
        description: '330 ml',
        price: 30,
        icon: '🥤',
      },
    ],
  },
  {
    name: 'Daily Pharmacy',
    icon: '💊',
    category: 'Health & care',
    delivery: '10–20 min',
    products: [
      {
        id: '9',
        name: 'Hand Sanitizer',
        description: '100 ml',
        price: 45,
        icon: '🧴',
      },
      {
        id: '10',
        name: 'Tissue Pack',
        description: 'Pocket tissues',
        price: 20,
        icon: '🧻',
      },
      {
        id: '11',
        name: 'Vitamin C',
        description: 'Sample product',
        price: 90,
        icon: '🍊',
      },
      {
        id: '12',
        name: 'First Aid Kit',
        description: 'Basic essentials',
        price: 180,
        icon: '🩹',
      },
    ],
  },
];

export default function StoreScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const { items, addItem, updateQuantity, itemCount, total } = useCart();

  const store = stores.find((item) => item.name === name);
  const storeItems = items.filter((item) => item.storeName === store?.name);

  if (!store) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Store' }} />
        <Text style={styles.notFound}>Store not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: store.name }} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.storeHeader}>
          <View style={styles.storeIcon}>
            <Text style={styles.storeEmoji}>{store.icon}</Text>
          </View>

          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.category}>{store.category}</Text>

          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryText}>
              🚚 Delivery in {store.delivery}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular products</Text>
          <Text style={styles.productCount}>{store.products.length} items</Text>
        </View>

        {store.products.map((product) => {
          const quantity =
            storeItems.find((item) => item.id === product.id)?.quantity ?? 0;

          return (
            <View
              key={product.id}
              style={styles.productCard}
            >
              <View style={styles.productIcon}>
                <Text style={styles.productEmoji}>{product.icon}</Text>
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <Text style={styles.productPrice}>EGP {product.price}</Text>
              </View>

              {quantity === 0 ? (
                <Pressable
                  accessibilityRole='button'
                  onPress={() =>
                    addItem({
                      id: product.id,
                      storeName: store.name,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      icon: product.icon,
                    })
                  }
                  style={styles.addButton}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </Pressable>
              ) : (
                <View style={styles.quantityControl}>
                  <Pressable
                    accessibilityRole='button'
                    accessibilityLabel={`Remove one ${product.name}`}
                    onPress={() => updateQuantity(product.id, store.name, -1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </Pressable>

                  <Text style={styles.quantity}>{quantity}</Text>

                  <Pressable
                    accessibilityRole='button'
                    accessibilityLabel={`Add one ${product.name}`}
                    onPress={() => updateQuantity(product.id, store.name, 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {itemCount > 0 && (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Open cart'
          onPress={() => router.push('/cart')}
          style={styles.cartBar}
        >
          <View>
            <Text style={styles.cartCount}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'} added
            </Text>
            <Text style={styles.cartTotal}>EGP {total}</Text>
          </View>

          <Text style={styles.cartHint}>View cart →</Text>
        </Pressable>
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
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAF8',
  },
  notFound: {
    fontSize: 18,
    color: '#183C2B',
    fontWeight: '600',
  },
  storeHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  storeIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#EAF4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  storeEmoji: {
    fontSize: 44,
  },
  storeName: {
    fontSize: 25,
    fontWeight: '800',
    color: '#183C2B',
  },
  category: {
    fontSize: 14,
    color: '#758078',
    marginTop: 6,
  },
  deliveryBadge: {
    backgroundColor: '#EAF4EC',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 14,
  },
  deliveryText: {
    color: '#27834F',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#183C2B',
  },
  productCount: {
    fontSize: 13,
    color: '#758078',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  productIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F2F6F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productEmoji: {
    fontSize: 29,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#183C2B',
  },
  productDescription: {
    fontSize: 12,
    color: '#858D86',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#27834F',
    marginTop: 7,
  },
  addButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#27834F',
    marginLeft: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  quantityButton: {
    width: 28,
    height: 32,
    borderRadius: 9,
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
    minWidth: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#183C2B',
  },
  cartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 16,
    backgroundColor: '#183C2B',
  },
  cartCount: {
    fontSize: 12,
    color: '#D9E9DD',
  },
  cartTotal: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 3,
  },
  cartHint: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

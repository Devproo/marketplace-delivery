import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFavorites } from '@/contexts/favorites-context';

const categories = [
  { icon: '🍔', name: 'Food' },
  { icon: '🛒', name: 'Groceries' },
  { icon: '💊', name: 'Pharmacy' },
  { icon: '📦', name: 'More' },
];

const stores = [
  {
    icon: '🥬',
    name: 'Fresh Market',
    category: 'Groceries',
    delivery: '15–25 min',
  },
  {
    icon: '🍔',
    name: 'Burger House',
    category: 'Fast food',
    delivery: '20–30 min',
  },
  {
    icon: '💊',
    name: 'Daily Pharmacy',
    category: 'Health & care',
    delivery: '10–20 min',
  },
];

const categoryFilters: Record<string, string> = {
  Food: 'Fast food',
  Groceries: 'Groceries',
  Pharmacy: 'Health & care',
};

export default function HomeScreen() {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredStores = stores.filter((store) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = `${store.name} ${store.category}`
      .toLowerCase()
      .includes(query);

    const matchesCategory =
      selectedCategory === null ||
      selectedCategory === 'More' ||
      store.category === categoryFilters[selectedCategory];

    return matchesSearch && matchesCategory;
  });

  if (!isMounted) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.locationHeader}>
          <Text style={styles.locationLabel}>DELIVERING TO</Text>
          <Text style={styles.location}>📍 Banha, Egypt ⌄</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroIcon}>🛍️</Text>
          <Text style={styles.heroTitle}>
            Everything you need,{'\n'}delivered to you.
          </Text>
          <Text style={styles.subtitle}>
            Your neighborhood, at your fingertips.
          </Text>
        </View>

        <View style={styles.search}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder='Search food, stores and products'
            placeholderTextColor='#87928B'
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize='none'
            autoCorrect={false}
            accessibilityLabel='Search stores'
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore categories</Text>
          <Text style={styles.link}>See all</Text>
        </View>

        <View style={styles.categoriesRow}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.name;

            return (
              <Pressable
                key={category.name}
                style={[
                  styles.categoryItem,
                  isSelected && styles.selectedCategoryItem,
                ]}
                accessibilityRole='button'
                accessibilityState={{ selected: isSelected }}
                onPress={() =>
                  setSelectedCategory(
                    category.name === 'More' || isSelected
                      ? null
                      : category.name,
                  )
                }
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryName,
                    isSelected && styles.selectedCategoryName,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.offer}>
          <View style={styles.offerText}>
            <Text style={styles.offerLabel}>WELCOME OFFER</Text>
            <Text style={styles.offerTitle}>
              Your first delivery{'\n'}is on us!
            </Text>
            <Text style={styles.offerSubtitle}>
              Discover local favorites today.
            </Text>
          </View>
          <Text style={styles.offerIcon}>🛵</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular near you</Text>
          <Text style={styles.link}>View all</Text>
        </View>

        {filteredStores.map((store) => {
          const favorite = isFavorite(store.name);

          return (
            <View
              key={store.name}
              style={styles.store}
            >
              <Pressable
                style={styles.storeInfo}
                accessibilityRole='button'
                accessibilityLabel={`View ${store.name}`}
                onPress={() =>
                  router.push({
                    pathname: '/store/[name]',
                    params: { name: store.name },
                  })
                }
              >
                <Text style={styles.storeIcon}>{store.icon}</Text>

                <View style={styles.storeDetails}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeCategory}>{store.category}</Text>
                  <Text style={styles.storeDelivery}>{store.delivery}</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.favoriteButton}
                accessibilityRole='button'
                accessibilityLabel={
                  favorite
                    ? `Remove ${store.name} from favorites`
                    : `Add ${store.name} to favorites`
                }
                accessibilityState={{ selected: favorite }}
                onPress={() => toggleFavorite(store.name)}
              >
                <Text style={styles.favoriteIcon}>{favorite ? '❤️' : '♡'}</Text>
              </Pressable>
            </View>
          );
        })}

        {filteredStores.length === 0 && (
          <Text style={styles.emptyMessage}>No matching stores found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  locationHeader: {
    marginBottom: 26,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#718078',
  },
  location: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    color: '#183C2B',
  },
  hero: {
    marginBottom: 22,
  },
  heroIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    color: '#183C2B',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#718078',
    marginTop: 6,
  },
  search: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5EBE6',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#183C2B',
    paddingVertical: 0,
  },
  searchIcon: {
    fontSize: 24,
    color: '#718078',
    marginRight: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#183C2B',
  },
  link: {
    color: '#27834F',
    fontSize: 13,
    fontWeight: '600',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '23%',
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EEE9',
  },
  selectedCategoryItem: {
    backgroundColor: '#E5F3E8',
    borderColor: '#27834F',
  },
  categoryIcon: {
    fontSize: 23,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34483B',
  },
  selectedCategoryName: {
    color: '#27834F',
  },
  offer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    padding: 18,
    backgroundColor: '#E5F3E8',
    borderRadius: 14,
  },
  offerText: {
    flex: 1,
  },
  offerLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#27834F',
  },
  offerTitle: {
    marginTop: 7,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: '#183C2B',
  },
  offerSubtitle: {
    marginTop: 6,
    fontSize: 11,
    color: '#526C5B',
  },
  offerIcon: {
    fontSize: 38,
    marginLeft: 10,
  },
  store: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EEE9',
  },
  storeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeIcon: {
    width: 58,
    height: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 28,
    backgroundColor: '#F0F5F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183C2B',
  },
  storeCategory: {
    marginTop: 4,
    fontSize: 12,
    color: '#718078',
  },
  storeDelivery: {
    marginTop: 7,
    fontSize: 11,
    color: '#526C5B',
  },
  favoriteButton: {
    minWidth: 40,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 25,
  },
  emptyMessage: {
    paddingVertical: 20,
    textAlign: 'center',
    color: '#718078',
    fontSize: 14,
  },
});

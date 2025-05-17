"use client";

import { useState, useEffect, useRef, SetStateAction } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { addWishList, getProducts, removeWishList } from "../api/product";
import { Product } from "../type/productType";
import { useUser } from "../contexts/UserContext";
import ProductItem from "../components/ProductItem";

const { width } = Dimensions.get("window");
const productWidth = (width - 40 - 10) / 2; // 40 for padding, 10 for gap
const numColumns = 1; // Default number of columns for FlatList

export default function SearchScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Search">>();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [resultCount, setResultCount] = useState(0);
  const searchInputRef = useRef<TextInput>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUser();
  const userId = userData.id;

  // Function to simulate fetching search results from an API
  const fetchSearchResults = async (query: string) => {
    // In a real app, this would be an actual API call
    const reponse = await getProducts({ keyword: query });
    if (reponse.status === 200) {
      const data = reponse.data;
      const toatalCount = data.length || 0;

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            products: data,
            totalCount: toatalCount || 0,
          });
        }, 300);
      });
    }
  };
  const mapItems = (items: any[]): Product[] => {
    return items.map((item) => ({
      ...item,
      id: item._id, // Sử dụng productId._id thay vì _id của mục
    }));
  };

  const addToRecentSearches = (term: any) => {
    // Don't add duplicates
    if (!recent.includes(term)) {
      // In a real app, you would store this in AsyncStorage or similar
      setRecent((prevRecent) => [term, ...prevRecent.slice(0, 7)]);

      // Here you would also save to persistent storage:
      AsyncStorage.setItem(
        "recentSearches",
        JSON.stringify([term, ...recent.slice(0, 7)])
      );
    }
  };
  // Function to load recent searches (would use AsyncStorage in a real app)
  const loadRecentSearches = () => {
    // In a real app, you would load from AsyncStorage:
    AsyncStorage.getItem("recentSearches").then((value) => {
      if (value) setRecent(JSON.parse(value));
    });

    // For now, we'll use some sample data
    setRecent([]);
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    // Focus the search input when the screen mounts
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length <= 2) {
      setResults([]);
      setIsSearching(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      fetchSearchResults(searchQuery)
        .then((data) => {
          const { products, totalCount } = data as {
            products: Product[];
            totalCount: number;
          };
          const productss = mapItems(products);

          setResults(
            productss.map((product) => ({
              ...product,
              isFavorite: product.isFavorite ?? false,
            }))
          );
          setResultCount(totalCount);
          setIsSearching(true);
          setIsLoading(false);

          addToRecentSearches(searchQuery);
        })
        .catch((error) => {
          console.error("Search error:", error);
          setIsLoading(false);
        });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearAll = () => {
    setRecent([]);
    // Clear recent searches from AsyncStorage

    const clearRecent = async () => {
      try {
        await AsyncStorage.removeItem("recentSearches");
        setRecent([]);
      } catch (error) {
        console.error("Error clearing recent searches:", error);
      }
    };
    // In a real app, you would also clear from AsyncStorage:
    // AsyncStorage.removeItem('recentSearches');
    clearRecent();
  };

  const handleSearchItemPress = (item: string) => {
    setSearchQuery(item);
    // The search term will be added to recents via the search effect
  };
  // Replace the renderProductItem function with:
  const renderProductItem = ({
    item,
    index,
  }: {
    item: Product;
    index: number;
  }) => (
    <ProductItem
      product={item}
      onToggleFavorite={toggleFavorite}
      index={index}
      isLastInRow={index % 2 === 1}
    />
  );

  const toggleFavorite = async (id: string) => {
    console.log("Toggle favorite for product ID:", id);
    const currentProduct = results.find((p) => p.id === id);
    if (!currentProduct) return;

    const newFavoriteState = !currentProduct.isFavorite;

    try {
      // Gọi API tương ứng: thêm hoặc xóa khỏi wishlist
      if (newFavoriteState) {
        const added = await addWishList({
          product_id: id,
          user_id: userId,
        });
        if (!added) throw new Error("Failed to add to wishlist");
      } else {
        const removed = await removeWishList({
          product_id: id,
          user_id: userId,
        });
        if (!removed) throw new Error("Failed to remove from wishlist");
      }

      // Cập nhật lại state nếu API thành công
      setResults((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, isFavorite: newFavoriteState }
            : product
        )
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // TODO: thông báo lỗi cho user nếu cần
    }
  };

  const renderRecentItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleSearchItemPress(item)}
    >
      <Text style={styles.recentItemText}>{item}</Text>
      <Ionicons name="time-outline" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!isSearching ? (
        // Recent searches view
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Gần đây</Text>
            {recent.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearAllText}>Xóa tất cả</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            key={numColumns} // Thêm key để ép FlatList re-render
            numColumns={numColumns} // numColumns có thể thay đổi
            data={recent}
            renderItem={renderRecentItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        // Search results view
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Kết quả cho "{searchQuery}"</Text>
            <Text style={styles.resultsCount}>
              {resultCount.toLocaleString()} tìm được
            </Text>
          </View>

          <FlatList
            data={results}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
  },
  placeholder: {
    width: 34,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    paddingVertical: 5,
  },
  clearButton: {
    padding: 5,
  },
  recentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  recentTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
  },
  clearAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#8B6E4E",
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  recentItemText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  resultsTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
  },
  resultsCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#999",
  },
  productRow: {
    justifyContent: "space-between",
  },
  productList: {
    padding: 20,
    paddingLeft: 0,
  },
  productItem: {
    width: productWidth,
    marginBottom: 20,
  },
  productImageContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    height: 150,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  ratingText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  productPrice: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
  },
});

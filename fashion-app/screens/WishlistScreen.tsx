"use client";

import { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useUser } from "../contexts/UserContext";
import { addWishList, getWishList, removeWishList } from "../api/product";
import ProductItem from "../components/ProductItem";
import { Product } from "../type/productType";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
const productWidth = (width - 40 - 10) / 2; // 40 for padding, 10 for gap

// Sample filter categories

export default function WishlistScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Wishlist">>();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = userData.id;
  const fetchWishlist = useCallback(async () => {
    try {
      const response = await getWishList(userId);
      const productsData = Array.isArray(response?.data) ? response.data : [];

      const formattedProducts = productsData.map(
        (product: { _id: any; id: any }) => ({
          ...product,
          id: product._id ?? product.id, // Handle both _id and id cases
        })
      );

      setWishlistItems(formattedProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load wishlist",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);
  // Refresh control handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWishlist();
  }, [fetchWishlist]);

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
      return () => {}; // Cleanup if needed
    }, [fetchWishlist])
  );

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const success = await removeWishList({
        product_id: productId,
        user_id: userId,
      });

      if (success) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.id !== productId)
        );
        Toast.show({
          type: "success",
          text1: "Removed",
          text2: "Product removed from wishlist",
        });
      } else {
        throw new Error("Failed to remove");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove product",
      });
    }
  };

  const renderProductItem = ({
    item,
    index,
  }: {
    item: Product;
    index: number;
  }) => (
    <ProductItem
      product={item}
      onToggleFavorite={handleRemoveFromWishlist}
      index={index}
      isLastInRow={index % 2 === 1}
      isWishlistScreen={true}
    />
  );
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>Your wishlist is empty</Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#8B6E4E" style={styles.loader} />
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={wishlistItems}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={[
          styles.productList,
          wishlistItems.length === 0 && styles.emptyListContainer,
        ]}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Cart")}
        >
          <Feather name="shopping-bag" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="heart" size={24} color="#8B6E4E" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather name="user" size={24} color="#999" />
        </TouchableOpacity>
      </View>
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
  filterContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: "#8B6E4E",
  },
  filterText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  productItem: {
    width: productWidth,
    marginBottom: 20,
  },

  productList: {
    padding: 20,
  },
  productRow: {
    justifyContent: "space-between",
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
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#222",
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 30,
  },
  activeNavItem: {
    borderRadius: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#8B6E4E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    flex: 1,
  },
});

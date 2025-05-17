"use client";

import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { addWishList, getProducts, removeWishList } from "../api/product";
import ProductItem from "../components/ProductItem";
import { useUser } from "../contexts/UserContext";

import { Product } from "../type/productType";

const { width } = Dimensions.get("window");
const productWidth = (width - 40 - 10) / 2; // 40 for padding, 10 for gap

type CaProuctRouteProp = RouteProp<
  { CategoryProduct: { category: any } },
  "CategoryProduct"
>;

export default function CategoryProductScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "CategoryProduct">
    >();

  const route = useRoute<CaProuctRouteProp>(); // Sử dụng kiểu đã định nghĩa
  const { category } = route.params || {
    category: { _id: "", name: "Jacket" },
  };
  const [loading, setLoading] = useState(true);

  const [productsList, setProductsList] = useState<Product[]>([]);
  const { userData } = useUser();
  const userId = userData.id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryId = category._id; // Assuming category has an id property
        const data = await getProducts({ category_id: categoryId });
        const productsData = data.data;
        console.log("Products data:", productsData);
        const products = productsData.map((p: { _id: any }) => ({
          ...p,
          id: p._id,
        }));

        setProductsList(products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const toggleFavorite = async (id: string) => {
    const currentProduct = productsList.find((p) => p.id === id);
    if (!currentProduct) return;

    const newFavoriteState = !currentProduct.isFavorite;

    try {
      // Gọi API tương ứng: thêm hoặc xóa khỏi wishlist
      if (newFavoriteState) {
        const added = await addWishList({
          product_id: id,
          user_id: userId,
        });
        if (!added) throw new Error("Lỗi khi thêm vào danh sách yêu thích");
      } else {
        const removed = await removeWishList({
          product_id: id,
          user_id: userId,
        });
        if (!removed) throw new Error("Lỗi khi xóa khỏi danh sách yêu thích");
      }

      // Cập nhật lại state nếu API thành công
      setProductsList((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, isFavorite: newFavoriteState }
            : product
        )
      );
    } catch (error) {
      console.error("Lỗi khi ấn vào nút thích sản phẩm", error);
      // TODO: thông báo lỗi cho user nếu cần
    }
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
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : productsList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>Không có sản phẩm yêu thích</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopNowText}>Xem sản phẩm </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={productsList}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      )}

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
        <TouchableOpacity style={[styles.navItem]}>
          <Ionicons name="heart-outline" size={24} color="#999" />
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
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
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
  productList: {
    padding: 20,
  },
  productRow: {
    justifyContent: "space-between",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
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
    marginTop: 10,
    textAlign: "center",
  },
  shopNowButton: {
    marginTop: 20,
    backgroundColor: "#8B6E4E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shopNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

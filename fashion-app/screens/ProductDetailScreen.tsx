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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Product } from "../type/productType";
import {
  addToCart,
  addWishList,
  getWishList,
  removeWishList,
} from "../api/product";
import { useUser } from "../contexts/UserContext";
import Toast from "react-native-toast-message";
interface ToggleFavoriteProps {
  userId: string;
  product: Product;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
}

const useToggleFavorite = ({
  userId,
  product,
  isFavorite,
  setIsFavorite,
}: ToggleFavoriteProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const toggleFavorite = useCallback(
    async (newFavoriteState: boolean) => {
      if (!userId || !product.id) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "User or product not found",
        });
        return;
      }
      try {
        setLoading(true);

        if (newFavoriteState) {
          const response = await addWishList({
            product_id: product.id,
            user_id: userId,
          });

          if (response.status !== 200) {
            throw new Error(response.message || "Failed to add to wishlist");
          }

          Toast.show({
            type: "success",
            text1: "Added to Wishlist",
            text2: `${product.name} has been added.`,
          });
        } else {
          // Xóa khỏi danh sách yêu thích
          const response = await removeWishList({
            product_id: product.id,
            user_id: userId,
          });

          if (response.status !== 200) {
            throw new Error(
              response.message || "Failed to remove from wishlist"
            );
          }

          Toast.show({
            type: "success",
            text1: "Removed from Wishlist",
            text2: `${product.name} has been removed.`,
          });
        }

        setIsFavorite(newFavoriteState);
      } catch (error: any) {
        console.error("Error toggling favorite:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2:
            error.message ||
            `Failed to ${newFavoriteState ? "add to" : "remove from"} wishlist`,
        });
      } finally {
        setLoading(false);
      }
    },
    [userId, product, isFavorite, setIsFavorite]
  );

  return { toggleFavorite, loading };
};

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params as { product: Product };
  const { userData } = useUser();
  const userId = userData.id;
  const [added, setAdded] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [mainImage, setMainImage] = useState(product.image); // State for main image
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { toggleFavorite, loading } = useToggleFavorite({
    userId,
    product,
    isFavorite,
    setIsFavorite,
  });

  // const toggleFavorite = async (id: string) => {
  //   try {
  //     const itemInWishLis = await getWishList(userId);
  //     const productsData = Array.isArray(itemInWishLis.data)
  //       ? itemInWishLis.data
  //       : [];
  //     const products = productsData.map((p: { _id: any }) => ({
  //       ...p,
  //       id: p._id,
  //     }));
  //     const currentProduct = products.find((p) => p.id === id);
  //     if (!currentProduct) return;

  //     if (newFavoriteState) {
  //       const added = await addWishList({
  //         product_id: id,
  //         user_id: userId,
  //       });
  //       if (!added) throw new Error("lỗi khi thêm vào danh sách yêu thích");
  //       Toast.show({
  //         type: "success",
  //         text1: "Thêm vào danh sách yêu thích",
  //         text2: `${product.name} đã được thêm.`,
  //       });
  //     } else {
  //       const removed = await removeWishList({
  //         product_id: id,
  //         user_id: userId,
  //       });
  //       if (!removed) throw new Error("Lỗi khi xóa khỏi danh sách yêu thích");
  //       Toast.show({
  //         type: "success",
  //         text1: "Đã xóa khỏi danh sách",
  //         text2: `${product.name} đã xóa khỏi danh sách.`,
  //       });
  //     }

  //     setIsFavorite(newFavoriteState);
  //   } catch (error) {
  //     console.error("Lỗi khi ấn vào nút thích sản phẩm:", error);
  //     Toast.show({
  //       type: "error",
  //       text1: "Error",
  //       text2: `Lỗi ${
  //         !isFavorite ? "thêm vào" : "xóa khỏi"
  //       } danh sách yêu thích.`,
  //     });
  //   }
  // };

  const handleAddToCart = async () => {
    setAdded(true);
    try {
      const add = await addToCart({
        product_id: product._id,
        user_id: userId,
        quantity: 1,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleGalleryItemPress = (image: any) => {
    setMainImage(image);
  };

  const renderGalleryItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() => handleGalleryItemPress(item)}
    >
      <Image
        source={typeof item === "string" ? { uri: item } : item}
        style={styles.galleryImage}
        resizeMode="cover"
      />
      {index === 5 && (
        <View style={styles.moreOverlay}>
          <Text style={styles.moreText}>+10</Text>
        </View>
      )}
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
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => product._id && toggleFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF6B6B" : "#333"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainImageContainer}>
          <Image
            source={{ uri: mainImage }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.galleryContainer}>
          <FlatList
            data={product.carouselImages || []}
            renderItem={renderGalleryItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryList}
          />
        </View>

        <View style={styles.productInfoContainer}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>
              {product.isMan ? "Male's Style" : "Female's Style"}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
            <Text style={styles.descriptionText}>
              {expanded
                ? product.description || "Không có mô tả"
                : `${(product.description || "Không có mô tả").slice(0, 100)}${
                    (product.description?.length || 0) > 100 ? "... " : ""
                  }`}
            </Text>
            {(product.description?.length || 0) > 100 && (
              <Text
                style={styles.readMoreText}
                onPress={() => setExpanded(!expanded)}
              >
                {expanded ? " Ngắn lại" : " Nhiều hơn"}
              </Text>
            )}
          </View>

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Giá sản phẩm</Text>
              <Text style={styles.priceValue}>${product.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" />
              <Text style={styles.addToCartText}>
                {added ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  favoriteButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  mainImageContainer: {
    width: "100%",
    height: 350,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  galleryContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  galleryList: {
    paddingVertical: 5,
  },
  galleryItem: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 8,
    overflow: "hidden",
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  moreOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    fontFamily: "InteremiBold",
    fontSize: 14,
    color: "#fff",
  },
  productInfoContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#999",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  productName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 22,
    color: "#333",
    marginBottom: 15,
  },
  detailsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  readMoreText: {
    fontFamily: "Inter-Medium",
    color: "#8B6E4E",
  },
  sizeSection: {
    marginBottom: 20,
  },
  sizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSizeOption: {
    backgroundColor: "#8B6E4E",
    borderColor: "#8B6E4E",
  },
  sizeText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
  },
  selectedSizeText: {
    color: "#fff",
  },
  colorSection: {
    marginBottom: 25,
  },
  colorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedColorText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
    marginBottom: 10,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: "#8B6E4E",
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  priceLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  priceValue: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
  },
  addToCartButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  addToCartText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
  },
});

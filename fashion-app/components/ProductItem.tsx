import type React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Product } from "../type/productType";

const { width } = Dimensions.get("window");
const productWidth = (width - 40 - 10) / 2; // 40 for padding, 10 for gap

interface ProductItemProps {
  product: Product;
  onToggleFavorite: (id: string) => void;
  index?: number;
  isLastInRow?: boolean;
  isWishlistScreen?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onToggleFavorite,
  index,
  isLastInRow = false,
  isWishlistScreen = false,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  const handleProductPress = () => {
    navigation.navigate("ProductDetail", { product });
  };

  const imageSource = product.image
    ? typeof product.image === "string"
      ? { uri: product.image }
      : typeof product.image === "number"
      ? { uri: `` }
      : product.image
    : require("../assets/product1.jpg");

  return (
    <View
      style={[
        styles.productItem,
        !isLastInRow && index !== undefined && index % 2 === 0
          ? { marginRight: 10 }
          : {},
      ]}
    >
      <TouchableOpacity
        style={styles.productImageContainer}
        onPress={handleProductPress}
      >
        <Image source={imageSource} style={styles.productImage} />
        {isWishlistScreen && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(product.id)}
          >
            <Ionicons
              name={product.isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={product.isFavorite ? "#FF6B6B" : "#666"}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.productInfo} onPress={handleProductPress}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{product.rating}</Text>
        </View>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ProductItem;

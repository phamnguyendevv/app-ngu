"use client";

import { useState, useEffect, SetStateAction } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useUser } from "../contexts/UserContext";
import { getCart, removeItemFromCart, updateCart } from "../api/product";
import { Product, ProductCart } from "../type/productType";
import Toast from "react-native-toast-message";

export default function CartScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Cart">>();
  const [cartItems, setCartItems] = useState<ProductCart[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(25.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { userData } = useUser();
  const user_id = userData.id;
  const [productToRemove, setProductToRemove] = useState<ProductCart | null>(
    null
  );

  const mapCartItems = (items: any[]): ProductCart[] => {
    return items.map((item) => ({
      ...item,
      id: item.productId._id, // Sử dụng productId._id thay vì _id của mục
    }));
  };

  // Lấy dữ liệu giỏ hàng
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user_id) {
        setError("Người dùng không hợp lệ");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await getCart(user_id);
        if (response.status !== 200) {
          throw new Error(response.message || "Failed to fetch cart");
        }
        if (!response.data.products) {
          setCartItems([]);
        } else {
          const data = mapCartItems(response.data.products);
          setCartItems(data);
        }
      } catch (error: any) {
        console.error("Error fetching cart items:", error);
        setError(error.message || "Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user_id]);
  // Tính toán tổng
  useEffect(() => {
    const calculateTotals = () => {
      const newSubtotal = cartItems.reduce(
        (sum, item) => sum + (item.productId.price || 0) * item.quantity,
        0
      );
      setSubtotal(newSubtotal);
      setTotal(newSubtotal + deliveryFee);
    };
    calculateTotals();
  }, [cartItems, deliveryFee]);

  const handleQuantityChange = async (id: string, change: number) => {
    try {
      setLoading(true);
      setError(null);

      const item = cartItems.find((item) => item.id === id);
      if (!item) {
        throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
      }
      // Tính số lượng mới
      const newQuantity = Math.max(1, item.quantity + change);

      // Gọi API để cập nhật
      const response = await updateCart({
        user_id,
        product_id: item.productId._id, // Sử dụng productId._id
        quantity: newQuantity,
      });

      const updatedItems = mapCartItems(response.data.products);
      const productRemove = updatedItems.find(
        (item) => item.productId._id === productToRemove?.productId._id
      );

      setCartItems(updatedItems);
      setProductToRemove(productRemove || null);
    } catch (error: any) {
      console.error("Error updating cart quantity:", error);
      setError(error.message || "Lỗi cập nhật số lượng sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveItem = (item: ProductCart) => {
    setProductToRemove(item);
    setShowRemoveModal(true);
  };

  const handleRemoveItem = async () => {
    if (!productToRemove) return;

    try {
      setLoading(true);
      setError(null);
      const item = cartItems.find(
        (item) => item.id === productToRemove.productId._id
      );

      // Gọi API để xóa sản phẩm
      const response = await removeItemFromCart({
        user_id,
        product_id: productToRemove.productId._id,
      });

      if (response.status !== 200) {
        throw new Error(response.message || "Lỗi xóa sản phẩm");
      }

      // Cập nhật state
      const updatedItems = mapCartItems(response.data.products);

      setCartItems(updatedItems);
      setShowRemoveModal(false);
      setProductToRemove(null);

      Toast.show({
        type: "success",
        text1: "Sản phẩm đã được xóa khỏi giỏ hàng",
      });
    } catch (error: any) {
      setError(error.message || "Lỗi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }
    // Navigate to checkout screen
    navigation.navigate("Checkout", { cartItems });
  };

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
        <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cube-outline" size={60} color="#999" />
            <Text style={styles.emptyCartText}>
              Không có sản phẩm trong giỏ hàng
            </Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.shopNowText}>Xem sản phẩm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image
                source={{ uri: item.productId.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.productId.name}</Text>
                {/* <Text style={styles.productSize}>Size : {item.size}</Text> */}
                <Text style={styles.productPrice}>${item.productId.price}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, -1)}
                >
                  <Feather name="minus" size={16} color="#666" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, 1)}
                >
                  <Feather name="plus" size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmRemoveItem(item)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))
        )}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền sản phẩm</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>${deliveryFee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng chi phí</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Tiếp tục thanh toán</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Feather name="shopping-bag" size={24} color="#8B6E4E" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Wishlist")}
        >
          <Ionicons name="heart-outline" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather name="user" size={24} color="#999" />
        </TouchableOpacity>
      </View>
      <Modal visible={showRemoveModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Xóa khỏi giỏ hàng?</Text>

            {productToRemove && (
              <View style={styles.modalItemContainer}>
                <Image
                  source={{ uri: productToRemove.productId.image }}
                  style={styles.modalItemImage}
                />
                <View style={styles.modalItemInfo}>
                  <Text style={styles.modalItemName}>
                    {productToRemove.productId.name}
                  </Text>
                  {/* <Text style={styles.modalItemSize}>
                    Size : {productToRemove.size}
                  </Text> */}
                  <Text style={styles.modalItemPrice}>
                    ${productToRemove.productId.price}
                  </Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(productToRemove.id, -1)}
                  >
                    <Feather name="minus" size={16} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>
                    {productToRemove.quantity}
                  </Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(productToRemove.id, 1)}
                  >
                    <Feather name="plus" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRemoveModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveItem}
              >
                <Text style={styles.removeButtonText}>Đồng ý, Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#666",
  },

  emptyCartText: {
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
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    position: "relative",
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  productSize: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginHorizontal: 10,
  },
  deleteButton: {
    padding: 5,
  },
  promoContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  promoInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#fff",
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
  },

  totalRow: {
    marginTop: 5,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  totalLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
  },
  totalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#333",
  },
  checkoutButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  checkoutButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#fff",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  modalItemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  modalItemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  modalItemName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  modalItemSize: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  modalItemPrice: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    flex: 1,
    backgroundColor: "#8B6E4E",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },
  removeButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#fff",
  },
});

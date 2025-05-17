import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { getAddress } from "../api/user";
import { useUser } from "../contexts/UserContext";
import { Address, ProductCart } from "../type/productType";

// Sample cart items for the order list

export default function CheckoutScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Checkout">>();
  const route = useRoute();
  const { userData } = useUser();
  const user_id = userData.id;
  const addressData = userData.addresses;
  const [deliveryFee, setDeliveryFee] = useState(25.0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  type CheckoutScreenRouteProp = RouteProp<
    {
      params: {
        cartItems: ProductCart[];
        subtotal?: number;
      };
    },
    "params"
  >;
  const { cartItems } = (route as CheckoutScreenRouteProp).params || {
    cartItems: [],
  };

  const [address, setAddress] = useState<Address | undefined>(addressData);

  useFocusEffect(() => {
    const fetchAddress = async () => {
      try {
        setAddress(addressData);
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  });

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

  const handleContinueToPayment = () => {
    navigation.navigate("PaymentMethods", { cartItems });
  };

  const handleChangeAddress = () => {
    // Navigate to address selection/edit screen
    navigation.navigate("ShippingAddress");
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
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          <View style={styles.addressContainer}>
            <View style={styles.addressLeft}>
              <Ionicons name="location-outline" size={20} color="#8B6E4E" />
              <View style={styles.addressDetails}>
                {address ? (
                  <>
                    <Text style={styles.addressType}>{address.type}</Text>
                    <Text style={styles.addressText}>
                      {address.address} {address.city} {address.country}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.addressText}>
                    Không tìm thấy địa chỉ.
                  </Text>
                )}
              </View>
            </View>

            {address ? (
              <TouchableOpacity onPress={handleChangeAddress}>
                <Text style={styles.changeText}>Thay đổi</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleChangeAddress}>
                <Text style={styles.changeText}>Thêm địa chỉ</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách đặt hàng</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image
                source={{ uri: item.productId.image }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.productId.name}</Text>
                <Text style={styles.productPrice}>${item.productId.price}</Text>
                <Text style={styles.productSize}>
                  Số lượng: {item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </View>

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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueToPayment}
        >
          <Text style={styles.continueButtonText}>Tiếp tục thanh toán</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLeft: {
    flexDirection: "row",
    flex: 1,
  },
  addressDetails: {
    marginLeft: 15,
    flex: 1,
  },
  addressType: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  addressText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  changeText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#8B6E4E",
  },
  shippingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shippingLeft: {
    flexDirection: "row",
    flex: 1,
  },
  shippingDetails: {
    marginLeft: 15,
    flex: 1,
  },
  shippingType: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  shippingText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productDetails: {
    marginLeft: 15,
    justifyContent: "center",
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
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  continueButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
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
});

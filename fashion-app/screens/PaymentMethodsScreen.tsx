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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { ProductCart } from "../type/productType";
import { useUser } from "../contexts/UserContext";
import { addOrder } from "../api/product";

// Payment method options
const paymentOptions = [
  {
    id: "cash",
    title: "Thanh toán tiền mặt",
    options: [
      {
        id: "cash",
        name: "Thanh toán tiền mặt",
        icon: require("../assets/card-icon.jpg"),
        isCard: false,
      },
    ],
  },
  {
    id: "more",
    title: "Các phương thức thanh toán khác",
    options: [
      {
        id: "paypal",
        name: "Thanh toán bằng Paypal",
        icon: require("../assets/paypal-icon.png"),
        isCard: false,
      },
    ],
  },
];

export default function PaymentMethodsScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "PaymentMethods">
    >();
  const route = useRoute();
  const [selectedMethod, setSelectedMethod] = useState("");
  const {
    userData: { id, addresses },
  } = useUser();
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

  interface HandlePaymentMethodPressParams {
    methodId: string;
    isCard: boolean;
  }

  const handlePaymentMethodPress = (
    id: string,
    { methodId, isCard }: HandlePaymentMethodPressParams
  ) => {
    if (isCard) {
      navigation.navigate("AddCard");
    } else {
      setSelectedMethod(methodId);
    }
  };

  const handleConfirmPayment = () => {
    if (selectedMethod) {
      try {
        const subtotal = cartItems.reduce(
          (total, item) => total + item.productId.price * item.quantity,
          0
        );
        const deliveryFee = 25.0;
        const total = subtotal + deliveryFee;

        if (selectedMethod === "paypal") {
          const orderDetails = {
            userId: id,
            cartItems,
            payment: "Paypal",
            subtotal,
            deliveryFee,
            total,
            shippingAddress: addresses,
            paymentMethod: selectedMethod,
          };
          // Handle PayPal payment
          console.log("Processing PayPal payment...");
          navigation.navigate("PaypalConfirmation", {
            orderData: orderDetails,
          });
        }
        if (selectedMethod === "cash") {
          const orderDetails = {
            userId: id,
            cartItems,
            payment: "Cash",
            subtotal,
            deliveryFee,
            total,
            shippingAddress: addresses,
            paymentMethod: selectedMethod,
          };
          // Handle cash payment

          const oder = addOrder(orderDetails);
          navigation.navigate("PaymentSuccess");
        }
      } catch (error) {
        console.error("Lỗi khi order", error);
      }

      console.log("Selected payment method:", selectedMethod);
    } else {
      alert("Chọn phương thức thanh toán");
    }
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
        <Text style={styles.headerTitle}>Phương thức thanh</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {paymentOptions.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.paymentOption}
                onPress={() =>
                  handlePaymentMethodPress(option.id, {
                    methodId: option.id,
                    isCard: option.isCard,
                  })
                }
              >
                <View style={styles.optionLeft}>
                  <Image source={option.icon} style={styles.optionIcon} />
                  {"name" in option && option.name && (
                    <Text style={styles.optionName}>{option.name}</Text>
                  )}
                </View>
                {option.isCard ? (
                  <Ionicons name="chevron-forward" size={20} color="#8B6E4E" />
                ) : (
                  <View
                    style={[
                      styles.radioButton,
                      selectedMethod === option.id &&
                        styles.radioButtonSelected,
                    ]}
                  >
                    {selectedMethod === option.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
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
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  optionName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#8B6E4E",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#8B6E4E",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  confirmButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
  },
});

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

export default function PaymentSuccessScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "PaymentSuccess">
    >();

  const handleViewOrder = () => {
    // Navigate to order details screen
    navigation.navigate("MyOrders");
  };

  const handleHome = () => {
    // Navigate to receipt screen or show receipt
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>

        <Text style={styles.successTitle}>Thanh toán thành công!</Text>
        <Text style={styles.successMessage}>Cảm ơn bạn đã mua hàng.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.viewOrderButton}
          onPress={handleViewOrder}
        >
          <Text style={styles.viewOrderButtonText}>Đơn đã đặt hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.viewReceiptButton} onPress={handleHome}>
          <Text style={styles.viewReceiptButtonText}>Trang chủ</Text>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8B6E4E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
  },
  successMessage: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  viewOrderButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  viewOrderButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
  },
  viewReceiptButton: {
    alignItems: "center",
  },
  viewReceiptButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
  },
});

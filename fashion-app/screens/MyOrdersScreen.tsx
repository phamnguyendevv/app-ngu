"use client";

import { use, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Order, Product, ProductCart } from "../type/productType";
import { useUser } from "../contexts/UserContext";
import { getOrders } from "../api/product";
import { format } from "date-fns";
import Toast from "react-native-toast-message";
// Sample order data

export default function MyOrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "MyOrders">>();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();
  const user_id = userData.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders(user_id);
        const rawOrders: Order[] = response.data;

        setActiveOrders(
          rawOrders.filter((order) => order.status.toLowerCase() === "pending")
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load orders",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user_id]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>
          {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
        </Text>
        <Text style={styles.orderStatus}>Đang chờ xử lý</Text>
      </View>

      {item.products.map((prod) => (
        <View key={prod.id} style={styles.productItem}>
          <Image
            source={{ uri: prod.product.image }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{prod.product.name}</Text>
            <Text style={styles.productDetails}>Số lượng: {prod.quantity}</Text>
            <Text style={styles.productPrice}>₫{prod.priceAtOrder}</Text>
          </View>
        </View>
      ))}

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>
          Tổng tiền: ₫{item.totalPrice.toFixed(2)}
          {item.deliveryFee > 0
            ? `\nBao gồm ₫${item.deliveryFee.toFixed(2)} phí giao hàng`
            : ""}
        </Text>
        <Text style={styles.orderStatus}>
          Thanh toán: {item.paymentMethod === "cash" ? "Tiền mặt" : "PayPal"}
        </Text>
      </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {activeOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopNowText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={activeOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                const fetchOrders = async () => {
                  try {
                    const response = await getOrders(user_id);
                    const rawOrders = response.data;
                    setActiveOrders(
                      rawOrders.filter(
                        (order: any) => order.status === "Pending"
                      )
                    );
                  } catch (error) {
                    console.error("Error refreshing orders:", error);
                  }
                };
                fetchOrders();
              }}
            />
          }
        />
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
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
  shopNowButton: {
    backgroundColor: "#8B6E4E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowText: {
    color: "#fff",
    fontWeight: "600",
  },
  ordersList: {
    padding: 16,
  },
  orderContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B6E4E",
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "600",
  },
  orderFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 15,
    fontWeight: "600",
  },
  trackButton: {
    backgroundColor: "#8B6E4E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  trackButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#8B6E4E",
  },
  tabText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#999",
  },
  activeTabText: {
    color: "#8B6E4E",
  },

  orderItem: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },

  orderDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 15,
  },
  orderInfo: {
    flex: 1,
    justifyContent: "center",
  },

  actionButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignSelf: "center",
  },
  actionButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#fff",
  },
});

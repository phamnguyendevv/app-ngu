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
// Sample order data

const activeOrders = [
  {
    id: "1",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product1.jpg"),
  },
  {
    id: "2",
    name: "Brown Suite",
    size: "XL",
    quantity: 10,
    price: 120,
    image: require("../assets/product2.jpg"),
  },
  {
    id: "3",
    name: "Brown Suite",
    size: "XL",
    quantity: 10,
    price: 120,
    image: require("../assets/product3.jpg"),
  },
  {
    id: "4",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product1.jpg"),
  },
  {
    id: "5",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product2.jpg"),
  },
  {
    id: "6",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product3.jpg"),
  },
];

const completedOrders = [
  {
    id: "1",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product4.jpg"),
  },
  {
    id: "2",
    name: "Brown Suite",
    size: "XL",
    quantity: 10,
    price: 120,
    image: require("../assets/product1.jpg"),
  },
  {
    id: "3",
    name: "Brown Suite",
    size: "XL",
    quantity: 10,
    price: 120,
    image: require("../assets/product2.jpg"),
  },
  {
    id: "4",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product3.jpg"),
  },
  {
    id: "5",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product4.jpg"),
  },
  {
    id: "6",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product1.jpg"),
  },
];

const cancelledOrders = [
  {
    id: "1",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product2.jpg"),
  },
  {
    id: "2",
    name: "Brown Suite",
    size: "XL",
    quantity: 10,
    price: 120,
    image: require("../assets/product3.jpg"),
  },
  {
    id: "3",
    name: "Brown Suite",
    size: "XL",
    quantity: 10,
    price: 120,
    image: require("../assets/product4.jpg"),
  },
  {
    id: "4",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product1.jpg"),
  },
  {
    id: "5",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product2.jpg"),
  },
  {
    id: "6",
    name: "Brown Jacket",
    size: "XL",
    quantity: 10,
    price: 83.97,
    image: require("../assets/product3.jpg"),
  },
];

export default function MyOrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "MyOrders">>();
  const [activeTab, setActiveTab] = useState("Active");
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<Order[]>([]);
  const { userData } = useUser();
  const user_id = userData.id;
  const mapCartItems = (items: any[]): ProductCart[] => {
    return items.map((item) => ({
      ...item,
      id: item.productId._id, // Sử dụng productId._id thay vì _id của mục
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders(user_id);
        const rawOrders = response.data;

        const orders: Order[] = rawOrders.map((order: any) => ({
          id: order.id,
          status: order.status,
          totalPrice: order.totalPrice,
          deliveryFee: order.deliveryFee,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          shippingAddress: order.shippingAddress,
          products: order.products.map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            priceAtOrder: item.priceAtOrder,
            product: {
              id: item.product.id,
              name: item.product.name,
              image: item.product.image,
              price: item.product.price,
            },
          })),
        }));
        console.log("orders", orders);

        setActiveOrders(orders.filter((order) => order.status === "Pending"));
        setCompletedOrders(
          orders.filter((order) => order.status === "completed")
        );
        setCancelledOrders(
          orders.filter((order) => order.status === "cancelled")
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [user_id]);

  const handleCancelOrder = (orderId: any) => {
    // Cancel order logic
    alert(`Order ${orderId} cancelled`);
  };

  const handleTrackOrder = (order: any) => {
    // Navigate to order tracking screen
    navigation.navigate("TrackOrder", { order });
  };

  const handleLeaveReview = (orderId: any) => {
    // Navigate to review screen
    alert(`Leave review for order ${orderId}`);
  };

  const handleReOrder = (orderId: any) => {
    // Add to cart and navigate to cart
    alert(`Re-ordering order ${orderId}`);
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    let actionButton;

    if (activeTab === "Active") {
      actionButton = (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleTrackOrder(item)}
        >
          <Text style={styles.actionButtonText}>Track Order</Text>
        </TouchableOpacity>
      );
    } else if (activeTab === "Completed") {
      actionButton = (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLeaveReview(item.id)}
        >
          <Text style={styles.actionButtonText}>Leave Review</Text>
        </TouchableOpacity>
      );
    } else {
      actionButton = (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleReOrder(item.id)}
        >
          <Text style={styles.actionButtonText}>Re-Order</Text>
        </TouchableOpacity>
      );
    }

    // Render each product in the order
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.productName}>
          Order in {format(new Date(item.createdAt), "yyyy:MM:dd HH:mm:ss")}{" "}
        </Text>
        <Text style={styles.productDetails}>Status: {item.status}</Text>
        {item.products.map((prod) => (
          <View key={prod.id} style={styles.orderItem}>
            <Image
              source={{ uri: prod.product.image }}
              style={styles.productImage}
            />
            <View style={styles.orderDetails}>
              <View style={styles.orderInfo}>
                <Text style={styles.productName}>{prod.product.name}</Text>
                <Text style={styles.productDetails}>
                  Quantity : {prod.quantity}
                </Text>
                <Text style={styles.productPrice}>${prod.priceAtOrder}</Text>
              </View>
              {actionButton}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const getOrdersData = () => {
    switch (activeTab) {
      case "Active":
        return activeOrders;
      case "Completed":
        return completedOrders;
      case "Cancelled":
        return cancelledOrders;
      default:
        return activeOrders;
    }
  };
  const ordersData = getOrdersData();

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
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabsContainer}>
        {["Active", "Completed", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {ordersData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>
            No {activeTab.toLowerCase()} orders
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={ordersData}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
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
    fontFamily: "InteremiBold",
    fontSize: 18,
    color: "#333",
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
  ordersList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  orderItem: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
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
  productName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  productDetails: {
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
});

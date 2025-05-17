import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getMe } from "../api/user";

// Menu items for profile
const menuItems = [
  {
    id: "1",
    title: "Trang cá nhân",
    icon: <Feather name="user" size={20} color="#666" />,
    screen: "EditProfile",
  },
  {
    id: "2",
    title: "Phương thức thanh toán",
    icon: <Ionicons name="card-outline" size={20} color="#666" />,
    screen: "PaymentMethods",
  },
  {
    id: "3",
    title: "Đơn hàng của tôi",
    icon: <Feather name="shopping-bag" size={20} color="#666" />,
    screen: "MyOrders",
  },
  {
    id: "4",
    title: "Cài đặt",
    icon: <Ionicons name="settings-outline" size={20} color="#666" />,
    screen: "Settings",
  },
  {
    id: "8",
    title: "Đăng xuất",
    icon: <Feather name="log-out" size={20} color="#666" />,
    screen: "Logout",
  },
];

export default function ProfileScreen() {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Profile">>();
  const [loading, setLoading] = useState(true);
  const { userData, logout } = useUser();

  const [name, setName] = useState("");
  const userId = userData.id;
  const email = userData.email;

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMe(userId);
      setName(response.data.name);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sẽ chạy mỗi khi màn hình được focus (bao gồm cả khi goBack trở lại)
  useFocusEffect(
    useCallback(() => {
      fetchUserData();

      // Cleanup function (optional)
      return () => {
        console.log("Screen unfocused");
      };
    }, [fetchUserData])
  );

  const handleMenuItemPress = (screen: string) => {
    if (screen === "Logout") {
      // Show logout confirmation modal
      setLogoutModalVisible(true);
    } else {
      // Navigate to the selected screen
      navigation.navigate(screen as never);
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(false);
    // Perform logout actions
    navigation.navigate("Welcome");
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
        <Text style={styles.headerTitle}>Trang cá nhân</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/boad1.png")}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Feather name="edit-2" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{name}</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Wishlist")}
        >
          <Ionicons name="heart-outline" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Feather name="user" size={24} color="#8B6E4E" />
        </TouchableOpacity>
      </View>
      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Đăng xuất</Text>
            <Text style={styles.modalMessage}>
              Bạn có muốn đăng xuất không?
            </Text>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Đồng ý</Text>
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
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8B6E4E",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginLeft: 15,
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  modalMessage: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  logoutButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#fff",
  },
});

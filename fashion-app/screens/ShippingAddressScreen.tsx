import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useUser } from "../contexts/UserContext";
import { addAdrress, getAddress, removeAddress } from "../api/user";
import { Address } from "../type/productType";

export default function ShippingAddressScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ShippingAddress">
    >();
  const {
    userData: { id, email, isLoggedIn },
    setUserData,
    setAddresses,
  } = useUser();
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<Address[]>([]);

  const { userData, logout } = useUser();
  const userId = userData.id;

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAddress(userId);
      setAddress(response.address); // Assuming response.address is the correct field
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Use only one useFocusEffect to avoid redundant fetches
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      return () => {
        console.log("Screen unfocused");
      };
    }, [fetchUserData])
  );
  const handleEditAddress = (address: Address) => {
    // Navigate to EditAddress screen with the address data
    // navigation.navigate("EditAddress", { address });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();

      return () => {
        console.log("Screen unfocused");
      };
    }, [fetchUserData])
  );

  const handleRemoveAddress = async (id: string) => {
    try {
      setLoading(true);
      const data = {
        userId: userId,
        addressId: id,
      };

      Alert.alert(
        "Xác nhận xoá",
        `Bạn có chắc muốn xoá địa chỉ này không?`,
        [
          {
            text: "Huỷ",
            style: "cancel",
          },
          {
            text: "Xoá",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                const data = {
                  userId: userId,
                  addressId: id,
                };
                const response = await removeAddress(data);
                fetchUserData(); // refresh lại danh sách
              } catch (error) {
                console.error("Error removing address:", error);
              } finally {
                setLoading(false);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error removing address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (id: string): void => {
    setSelectedAddress(id);
  };

  const handleApply = () => {
    // Navigate back to checkout with the selected address
    const selected = address.find((addr) => addr._id === selectedAddress);
    if (selected) {
      setAddresses(selected);

      navigation.goBack();
    } else {
      Alert.alert("Vui lòng chọn địa chỉ giao hàng.");
    }
  };
  const handleAddNewAddress = () => {
    // Navigate to add new address screen
    navigation.navigate("AddNewAddress");
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
        <Text style={styles.headerTitle}>Địa chỉ giao hàng</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.addNewText}>Đang tải địa chỉ...</Text>
        ) : address.length === 0 ? (
          <Text style={styles.emptyText}>Không tìm thấy địa chỉ</Text>
        ) : (
          address.map((address) => (
            <TouchableOpacity
              key={address._id}
              style={styles.addressItem}
              onPress={() => handleAddressSelect(address._id)}
            >
              <View style={styles.addressLeft}>
                <Ionicons name="location-outline" size={22} color="#8B6E4E" />
                <View style={styles.addressInfo}>
                  <Text style={styles.addressType}>{address.type}</Text>
                  <Text style={styles.addressText}>
                    {address.address}, {address.city}, {address.country}
                  </Text>
                </View>
              </View>

              <View style={styles.addressRight}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditAddress(address)}
                >
                  <Ionicons name="create-outline" size={18} color="#8B6E4E" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveAddress(address._id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                </TouchableOpacity>
                <View
                  style={[
                    styles.radioButton,
                    selectedAddress === address._id &&
                      styles.radioButtonSelected,
                  ]}
                >
                  {selectedAddress === address._id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={styles.addNewButton}
          onPress={handleAddNewAddress}
        >
          <Ionicons name="add" size={20} color="#8B6E4E" />
          <Text style={styles.addNewText}>Thêm mới địa chỉ</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Xác nhận</Text>
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
  addressRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    padding: 8,
    marginRight: 10,
  },
  addressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  addressLeft: {
    flexDirection: "row",
    flex: 1,
  },
  addressInfo: {
    marginLeft: 15,
    flex: 1,
  },
  addressType: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  editButton: {
    padding: 8,
    marginRight: 8, // Space between edit and delete buttons
  },
  addressText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
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
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 10,
  },
  addNewText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#8B6E4E",
    marginLeft: 10,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  applyButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#8B6E4E",
    marginLeft: 10,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

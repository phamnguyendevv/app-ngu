"use client";

import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useUser } from "../contexts/UserContext";
import { addAdrress } from "../api/user";

export default function AddNewAddressScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Cart">>();
  const [addressType, setAddressType] = useState("Home");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const addressTypes = ["Home", "Office", "Other"];

  const { userData, logout } = useUser();

  const userId = userData.id;

  const handleSaveAddress = () => {
    // Validate inputs
    if (!name.trim()) {
      alert("Nhập tên địa chỉ của bạn");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Nhập số điện thoại của bạn");
      return;
    }

    if (!address.trim()) {
      alert("Nhập địa chỉ của bạn");
      return;
    }

    if (!city.trim()) {
      alert("Nhập thành phố của bạn");
      return;
    }

    if (!country.trim()) {
      alert("Nhập quốc gia của bạn");
      return;
    }

    // Create new address object
    const newAddress = {
      userId: userId,
      type: addressType,
      address: address,
      name: name,
      phoneNumber: phoneNumber,
      country: country,
      city: city,
    };

    try {
      const response = addAdrress(newAddress);
      alert("Địa chỉ đã được thêm thành công");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Có lỗi xảy ra khi thêm địa chỉ");
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
        <Text style={styles.headerTitle}>Thêm địa chỉ mới</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.addressTypeContainer}>
          <Text style={styles.sectionTitle}>Loại địa chỉ</Text>
          <View style={styles.addressTypeOptions}>
            {addressTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.addressTypeChip,
                  addressType === type && styles.activeAddressTypeChip,
                ]}
                onPress={() => setAddressType(type)}
              >
                <Text
                  style={[
                    styles.addressTypeText,
                    addressType === type && styles.activeAddressTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tên địa chỉ</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên địa chỉ "
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nhập địa chỉ chi tiết</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ chi tiết"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Thành phố</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập thành phố"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.inputLabel}>Quốc gia</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập quốc gia"
                placeholderTextColor="#999"
                value={country}
                onChangeText={setCountry}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
          <Text style={styles.saveButtonText}>Lưu địa chỉ</Text>
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
  addressTypeContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  addressTypeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  addressTypeChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
    marginBottom: 10,
  },
  activeAddressTypeChip: {
    backgroundColor: "#8B6E4E",
  },
  addressTypeText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#666",
  },
  activeAddressTypeText: {
    color: "#fff",
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#333",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 4,
    width: 20,
    height: 20,
  },
  checkboxLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  saveButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
  },
});

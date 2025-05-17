"use client";

import { SetStateAction, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import { getMe, updateMe } from "../api/user";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { userData, logout } = useUser();

  const [name, setName] = useState("");
  const userId = userData.id;
  const email = userData.email;
  useEffect(() => {
    console.log("userData", userData.id);
    const getUserData = async () => {
      try {
        const response = await getMe(userId);
        setName(response.data.name);
        console.log("response", response.data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, [setName]);

  const handleCompleteProfile = () => {
    // Validate inputs
    if (!name.trim()) {
      alert("Nhập tên của bạn");
      return;
    }

    try {
      const userData = {
        name,
        email,
      };
      const response = updateMe(userData);
      alert("Cập nhật thành công");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Cập nhật thất bại");
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
        <Text style={styles.appName}>Xuan Quy</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Chỉnh sửa thông tin người dùng</Text>
        <Text style={styles.subtitle}>
          Yên tâm nhé, chỉ bạn mới có thể thấy dữ liệu cá nhân của mình. Người
          khác sẽ không xem được.
        </Text>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              source={require("../assets/boad1.png")}
              style={styles.avatar}
            />
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <Feather name="edit-2" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên của bạn"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteProfile}
          >
            <Text style={styles.completeButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
  },
  appName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#ccc",
    opacity: 0.7,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 30,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8B6E4E",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  form: {
    width: "100%",
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
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
  },
  countryCodeContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  countryCodeText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
  },
  phoneInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#333",
  },
  genderSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  genderText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  completeButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  completeButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
  },
});

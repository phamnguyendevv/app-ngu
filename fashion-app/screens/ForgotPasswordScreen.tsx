"use client";

import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { forgetPassword } from "../api/user";
import { useUser } from "../contexts/UserContext";

export default function ForgotPasswordScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "ForgotPassword">
    >();
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    // Validate email input
    if (!email.trim()) {
      alert("Nhập email của bạn");
      return;
    }

    // Simple email format validation (optional)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert("Nhập email hợp lệ");
      return;
    }

    try {
      // Call API to send reset password email
      const response = await forgetPassword({ email: email.trim() });

      navigation.navigate("VerifyCode", { email });
    } catch (error) {
      console.error("Reset password error:", error);
      if ((error as any).response?.status === 400) {
        // Lỗi từ server (email không tồn tại, sai định dạng, etc.)
        alert("Email không tồn tại hoặc không hợp lệ");
        return;
      }
      // Handle network or server errors
    } finally {
      setEmail("");
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
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email để nhận mã đặt lại mật khẩu
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@gmail.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Tạo lại mật khẩu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToSignInButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToSignInText}>Quay về đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.divider} />
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
    fontFamily: "InteremiBold",
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
    paddingTop: 40,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    color: "#333",
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 30,
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
  resetButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  resetButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
  },
  backToSignInButton: {
    alignItems: "center",
    padding: 10,
  },
  backToSignInText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#8B6E4E",
  },
  footer: {
    paddingBottom: 30,
    alignItems: "center",
  },
  divider: {
    height: 4,
    width: 60,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },
});
function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

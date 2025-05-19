import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { loginApi } from "../api/user";
import { useUser } from "../contexts/UserContext";

export default function SignInScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "SignIn">>();

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handleSignIn = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert("Error", "Nhập email của bạn");
      return;
    }

    //vaidate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Nhập email hợp lệ");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Nhập mật khẩu của bạn");
      return;
    }

    try {
      const response = await loginApi({ email, password });
      const name = response.data.data.user.name;
      const id = response.data.data.user._id;
      const address = response.data.data.user.addresses[0];
      if (!address) {
        login(id, email, name);
      }
      login(id, email, name, address);

      console.log("Login response:", name);
      if (response.status === 200) {
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", "Đăng nhập không thành công");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Đăng nhập không thành công");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.appName}>Xuan Quy</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Chào bạn! Chào mừng bạn quay lại</Text>

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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={togglePasswordVisibility}
              >
                <Feather
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text>Bạn chưa có tài khoản? </Text>
            <Text style={styles.signUpText} onPress={handleSignUp}>
              Đăng kí
            </Text>
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  appName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#ccc",
    opacity: 0.7,
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
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
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
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 12,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#8B6E4E",
  },
  signInButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  signInButtonText: {
    fontFamily: "Inter-Medium",
    color: "#fff",
    fontSize: 16,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  orText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#999",
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  footerText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  signUpText: {
    fontFamily: "Inter-Medium",
    color: "#8B6E4E",
  },
});

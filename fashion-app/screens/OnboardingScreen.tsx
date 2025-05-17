import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "Onboarding">
    >();

  const handleGetStarted = () => {
    navigation.navigate("Onboarding2");
  };

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.appName}>Xuan Quy</Text>
        <TouchableOpacity style={styles.skipButton} onPress={handleSignIn}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.phoneContainer}>
        <Image
          source={require("../assets/boad2.png")}
          style={styles.phoneFrame}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.onboardingTitle}>
          Trải nghiệm mua sắm không gián đoạn
        </Text>
        <Text style={styles.onboardingDescription}>
          Đau đớn chính là điều chúng ta yêu thương, khi được gắn kết với nhau
          bởi tình bạn, nhưng chúng ta bị làm cho mệt mỏi bởi thời gian.
        </Text>

        <View style={styles.navigationControls}>
          <View style={styles.paginationDotsBottom}>
            <View style={[styles.dotBottom, styles.activeDotBottom]} />
            <View style={styles.dotBottom} />
            <View style={styles.dotBottom} />
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleGetStarted}
          >
            <Ionicons name="arrow-forward" size={24} color="#fff" />
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
  appName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#ccc",
    opacity: 0.7,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20, // Nếu muốn bo góc
  },

  skipButton: {
    padding: 5,
  },
  skipText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#8B6E4E",
  },
  phoneContainer: {
    alignItems: "center",
    marginTop: 20,
    height: 400,
  },
  phoneFrame: {
    width: width * 0.7,
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },

  bottomContent: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "flex-end",
    paddingBottom: 120,
  },
  onboardingTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  onboardingDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  navigationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paginationDotsBottom: {
    flexDirection: "row",
  },
  dotBottom: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginRight: 5,
  },
  activeDotBottom: {
    backgroundColor: "#8B6E4E",
  },
  nextButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8B6E4E",
    justifyContent: "center",
    alignItems: "center",
  },
});

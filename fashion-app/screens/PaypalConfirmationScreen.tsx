import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { RootStackParamList } from "../types";
import { addOrder } from "../api/product";

// Get screen dimensions for the Loading component
const { height, width } = Dimensions.get("window");

export default function PaypalConfirmationScreen() {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { orderData } = route.params as {
    orderData: { total: number; cartItems: any[] };
  }; // Define orderData type
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch PayPal approval URL when orderData is available
  const stateChng = (navState) => {
    //  console.log(navState);
    const { url, title } = navState;
    if (title == "PayPal Sucess") {
      console.log("url", url);
      let spliturl = url.split("?");
      // console.log("spliturl",spliturl);
      let splitotherhalf = spliturl[1].split("&");

      console.log("splitotherhalf", splitotherhalf);
      try {
        const oder = addOrder(orderData);
        navigation.navigate("PaymentSuccess");
      } catch (error) {
        console.log("Error adding order:", error);
        setError("Error adding order");
      }
    }
  };

  return (
    <WebView
      startInLoadingState={true}
      onNavigationStateChange={stateChng}
      renderLoading={() => <Loading />}
      source={{
        uri:
          "http://192.168.1.8:7777/api/v0/order/paypal/create-order/" +
          orderData.total,
      }}
    />
  );
}

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <Image
        source={require("../assets/paypal-icon.png")} // Adjust path to your image
        style={styles.paypalLogo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Optional: Add background color
  },
  paypalLogo: {
    width: 250,
    height: 100,
    resizeMode: "contain",
  },
});

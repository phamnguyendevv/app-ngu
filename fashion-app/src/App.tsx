import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import Onboarding2Screen from "../screens/Onboarding2Screen";
import SignInScreen from "../screens/SignInScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import WishlistScreen from "../screens/WishlistScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import CategoryProductScreen from "../screens/CategoryProductScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PasswordManagerScreen from "../screens/PasswordManagerScreen";
import PaymentMethodsScreen from "../screens/PaymentMethodsScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ShippingAddressScreen from "../screens/ShippingAddressScreen";
import AddNewAddressScreen from "../screens/AddNewAddressScreen";
import PaymentSuccessScreen from "../screens/PaymentSuccessScreen";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import { UserProvider } from "../contexts/UserContext";
import EditAddressScreen from "../screens/EditAddressScreen";
import PaypalConfirmationScreen from "../screens/PaypalConfirmationScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen
            name="CategoryProduct"
            component={CategoryProductScreen}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="PasswordManager"
            component={PasswordManagerScreen}
          />
          <Stack.Screen
            name="PaymentMethods"
            component={PaymentMethodsScreen}
          />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen
            name="ShippingAddress"
            component={ShippingAddressScreen}
          />
          <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} />
          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccessScreen}
          />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="EditAddress" component={EditAddressScreen} />
          <Stack.Screen
            name="PaypalConfirmation"
            component={PaypalConfirmationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

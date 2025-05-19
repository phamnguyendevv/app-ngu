export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  Onboarding2: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  NewPassword: { email: string }; // Định nghĩa NewPassword nhận tham số là một đối tượng có email
  ResetPassword: undefined;
  VerifyCode: { email: string }; // Định nghĩa VerifyCode nhận tham số là một đối tượng có email
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
  ProductDetail: { product: any }; // Định nghĩa ProductDetail nhận tham số là một đối tượng có product
  Wishlist: undefined;
  Settings: undefined;
  Search: undefined;
  CategoryProduct: { category: any }; // Added this line
  PasswordManager: undefined;
  PaymentMethods: any;
  Checkout: {
    cartItems?: any[];
    selectedAddress?: any;
    selectedShipping?: any;
  }; // Định nghĩa Checkout nhận tham số là một đối tượng có cartItems
  PrivacyPolicy: undefined;
  HelpCenter: undefined;
  ShippingAddress: any;
  ShippingMethod: undefined;
  AddNewAddress: undefined;
  OrderSummary: undefined;
  ShippingType: undefined;
  AddCard: undefined;
  PaymentSuccess: undefined;
  MyOrders: undefined;
  TrackOrder: any;
  EditProfile: undefined;
  EditAddress: { address: any }; // Định nghĩa EditAddress nhận tham số là một đối tượng có address
  FilterScreen: undefined;
  PaypalConfirmation: { orderData: any }; // Định nghĩa PaypalConfirmation nhận tham số là một đối tượng có orderData
};

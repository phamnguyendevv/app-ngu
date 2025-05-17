"use client";

import { useState, useEffect, useRef, use } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  ViewToken,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useUser } from "../contexts/UserContext";
import { getCategories } from "../api/categories";
import { addWishList, getProducts, removeWishList } from "../api/product";
import { Address, Category, Product } from "../type/productType";
import ProductItem from "../components/ProductItem";

const { width } = Dimensions.get("window");
const productWidth = (width - 40 - 10) / 2; // 40 for padding, 10 for gap

const banners = [
  {
    id: 1,
    title: "Bộ siêu tập mới ",
    subtitle: "Giảm giá 50% cho\nđơn hàng đầu tiên",
    image: require("../assets/banner-image.jpg"),
  },
  {
    id: 2,
    title: "Giảm giá mùa hè",
    subtitle: "Nhận lên tới 70% giảm giá\ntrêm một sản phẩm",
    image: require("../assets/banner-image.jpg"),
  },
  {
    id: 3,
    title: "Ưu đãi độc quyền",
    subtitle: "Ưu đãi có thời hạn\nđặc biệt dành cho bạn!",
    image: require("../assets/banner-image.jpg"),
  },
];

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("Newest");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [address, setAddress] = useState<Address>();
  const [categories, setCategories] = useState([]);
  const flatListRef = useRef(null);
  const {
    userData: { id, email, addresses },
  } = useUser();
  const [countdown, setCountdown] = useState({
    hours: 2,
    minutes: 12,
    seconds: 56,
  });
  const userId = id;
  useFocusEffect(() => {
    const fetchAddress = async () => {
      try {
        setAddress(addresses);
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };
    fetchAddress();
  });
  const toggleFavorite = async (id: string) => {
    return "";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const cate = data.data.data;
        setCategories(cate);
      } catch (err) {
        // setError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ keyword: "" });
        const productsData = data.data;
        const products = productsData.map((p: { _id: any }) => ({
          ...p,
          id: p._id,
        }));
        setProductsList(products);
      } catch (err) {
        // setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [email]); // Chạy lại khi email thay đổi
  const renderProductItem = ({
    item,
    index,
  }: {
    item: Product;
    index: number;
  }) => (
    <ProductItem
      product={item}
      onToggleFavorite={toggleFavorite}
      index={index}
      isLastInRow={index % 2 === 1}
    />
  );

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<{ title: string; subtitle: string; image: any }>[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const setActiveFilterApi = (filter: string) => {
    setLoading(true);
    // Call API to fetch products based on the selected filter
    const fetchFilteredProducts = async () => {
      console.log("Fetching filtered products for:", filter);

      const filterParams: Record<string, { [key: string]: boolean }> = {
        Newest: { isNewProduct: true },
        Popular: { isPopular: true },
        Man: { isMan: true },
        Woman: { isMan: false },
      };

      try {
        if (filter === "All") {
          const data = await getProducts({}); // Fetch all products
          setProductsList(data.data || []);
          setActiveFilter(filter);
          return;
        }

        const params = filterParams[filter];
        if (!params) {
          console.warn(`Invalid filter: ${filter}`);
          setProductsList([]);
          return;
        }

        const data = await getProducts(params);
        setProductsList(data.data || []);
      } catch (err) {
        console.error("Error fetching filtered products:", err);
        setProductsList([]); // Clear list on error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }

      setActiveFilter(filter);
    };
    fetchFilteredProducts();
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCategoryPress = (category: any) => {
    navigation.navigate("CategoryProduct", { category });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryIconContainer}>
        <Image source={{ uri: item.image }} style={styles.categoryIcon} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Vị trí</Text>
          <View style={styles.locationSelector}>
            <Ionicons name="location-outline" size={16} color="#8B6E4E" />
            <TouchableOpacity
              onPress={() => navigation.navigate("ShippingAddress")}
            >
              <Text style={styles.locationText}>
                {address?.address} {address?.city}
              </Text>
            </TouchableOpacity>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.appName}>Xuan Quy</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate("Search")}
        >
          <Feather name="search" size={20} color="#999" />
          <Text style={styles.searchPlaceholder}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <FlatList
            ref={flatListRef}
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={width}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.banner, { width }]}>
                <View style={styles.bannerContent}>
                  <View>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                    <TouchableOpacity style={styles.shopNowButton}>
                      <Text style={styles.shopNowText}>Mua sắm ngay</Text>
                    </TouchableOpacity>
                  </View>
                  <Image source={item.image} style={styles.bannerImage} />
                </View>
              </View>
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          />

          {/* Pagination Dots */}
          <View style={styles.paginationDots}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === currentIndex && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục </Text>
          </View>

          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        <View style={styles.flashSaleSection}>
          <View style={styles.flashSaleHeader}>
            <Text style={styles.sectionTitle}>Khuyến mãi chớp nhoáng</Text>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>Tạm dừng: </Text>
              <View style={styles.countdownTimer}>
                <Text style={styles.countdownDigit}>
                  {countdown.hours.toString().padStart(2, "0")}
                </Text>
                <Text style={styles.countdownSeparator}>:</Text>
                <Text style={styles.countdownDigit}>
                  {countdown.minutes.toString().padStart(2, "0")}
                </Text>
                <Text style={styles.countdownSeparator}>:</Text>
                <Text style={styles.countdownDigit}>
                  {countdown.seconds.toString().padStart(2, "0")}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === "All" && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilterApi("All")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "All" && styles.activeFilterText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === "Newest" && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilterApi("Newest")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "Newest" && styles.activeFilterText,
                ]}
              >
                Mới nhất
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === "Popular" && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilterApi("Popular")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "Popular" && styles.activeFilterText,
                ]}
              >
                Phổ biến
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === "Man" && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilterApi("Man")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "Man" && styles.activeFilterText,
                ]}
              >
                Nam
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === "Woman" && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilterApi("Woman")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "Woman" && styles.activeFilterText,
                ]}
              >
                Phụ nữ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={productsList}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="home" size={24} color="#8B6E4E" />
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

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather name="user" size={24} color="#999" />
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
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    fontFamily: "Interegular",
    fontSize: 12,
    color: "#999",
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontFamily: "Interedium",
    fontSize: 14,
    color: "#333",
    marginHorizontal: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  appName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#ccc",
    opacity: 0.7,
    marginRight: 15,
  },
  productList: {
    padding: 20,
    paddingLeft: 0,
  },
  productRow: {
    justifyContent: "space-between",
  },

  notificationButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#999",
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bannerContainer: {
    marginBottom: 20,
  },
  banner: {
    backgroundColor: "#F5F2EA",
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
    overflow: "hidden",
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  bannerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    lineHeight: 18,
  },
  shopNowButton: {
    backgroundColor: "#8B6E4E",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  shopNowText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#fff",
  },
  bannerImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#8B6E4E",
    width: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
  },
  seeAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#8B6E4E",
  },
  categoryList: {
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryName: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#333",
  },
  flashSaleSection: {
    marginBottom: 20,
  },
  flashSaleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    marginRight: 5,
  },
  countdownTimer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownDigit: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#333",
  },
  countdownSeparator: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#333",
    marginHorizontal: 2,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: "#8B6E4E",
  },
  filterText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productItem: {
    width: productWidth,
    marginBottom: 20,
  },
  productImageContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    height: 150,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  ratingText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  productPrice: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
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
});

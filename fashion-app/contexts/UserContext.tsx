// src/contexts/UserContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { Address } from "../type/productType";

/**
 * Interface định nghĩa cấu trúc dữ liệu người dùng
 */
interface UserData {
  id: string;
  email: string;
  name?: string;
  isLoggedIn: boolean;
  addresses: Address;
  // Có thể thêm các trường khác như: avatar, role,...
}

/**
 * Interface định nghĩa các phương thức và dữ liệu trong Context
 */
interface UserContextType {
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  login: (id: string, email: string, name?: string, address?: Address) => void;
  logout: () => void;
  requestPasswordReset: (email: string) => void;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;

  setAddresses: (addresses: Address) => void;
}

// Trạng thái người dùng mặc định
const initialUserData: UserData = {
  id: "",
  email: "",
  name: "",
  isLoggedIn: false,
  addresses: {
    city: "",
    country: "",
    _id: "",
    type: "",
    address: "",
  },
};

// Tạo Context với giá trị mặc định
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Provider component để bọc các component con
 */
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserDataState] = useState<UserData>(initialUserData);

  /**
   * Cập nhật thông tin người dùng
   */
  const setUserData = useCallback((data: Partial<UserData>) => {
    setUserDataState((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  /**
   * Xử lý đăng nhập
   */
  const login = useCallback(
    (id: string, email: string, name?: string, addresses?: any) => {
      setUserDataState({
        id,
        email,
        name,
        isLoggedIn: true,
        addresses,
      });
    },
    []
  );

  const setAddresses = useCallback((addresses: Address) => {
    setUserDataState((prev) => ({
      ...prev,
      addresses,
    }));
  }, []);

  /**
   * Xử lý yêu cầu đặt lại mật khẩu
   */
  const requestPasswordReset = useCallback((email: string) => {
    setUserDataState((prev) => ({
      ...prev,
      email,
      isLoggedIn: false,
    }));
  }, []);

  /**
   * Xử lý đặt lại mật khẩu (có thể gọi API)
   */
  const resetPassword = useCallback(
    async (email: string, newPassword: string) => {
      try {
        // Gọi API đổi mật khẩu ở đây
        // const response = await api.resetPassword(email, newPassword);
        console.log(`Password reset for ${email}`);
        return true;
      } catch (error) {
        console.error("Reset password failed:", error);
        return false;
      }
    },
    []
  );

  /**
   * Xử lý đăng xuất
   */
  const logout = useCallback(() => {
    setUserDataState(initialUserData);
  }, []);

  // Giá trị cung cấp cho Context
  const contextValue: UserContextType = {
    userData,
    setUserData,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    setAddresses,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

/**
 * Custom hook để sử dụng User Context
 * @throws Error nếu sử dụng bên ngoài UserProvider
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

/**
 * Helper hook để lấy thông tin người dùng hiện tại
 */
export const useCurrentUser = () => {
  const { userData } = useUser();
  return userData;
};

import { View } from "react-native";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  password_confirmation: string;
}

const RegisterScreen = () => {
  return <View className="flex-1 bg-gray-50 relative"></View>;
};

export default RegisterScreen;

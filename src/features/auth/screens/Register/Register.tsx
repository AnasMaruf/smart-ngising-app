import { logoSvg } from "@/assets";
import {
  Box,
  VStack,
  Text,
  Input,
  InputField,
  InputSlot,
  Button,
  ButtonText,
  ButtonSpinner,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Pressable,
} from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SvgUri } from "react-native-svg";

type FormData = {
  fullName: string;
  username: string;
  email: string;
  pin: string;
  confirmPin: string;
};

const RegisterScreen = () => {
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const { register, isRegistering } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { fullName: "", username: "", email: "", pin: "", confirmPin: "" },
  });

  const logoUri = Asset.fromModule(logoSvg).uri;

  const applyServerErrors = (details: unknown) => {
    if (!details || typeof details !== "object") return false;
    let handled = false;
    Object.entries(details as Record<string, unknown>).forEach(([key, value]) => {
      const message = Array.isArray(value) ? value.join(", ") : String(value);
      switch (key) {
        case "fullName":
          setError("fullName", { type: "server", message });
          handled = true;
          break;
        case "username":
          setError("username", { type: "server", message });
          handled = true;
          break;
        case "email":
          setError("email", { type: "server", message });
          handled = true;
          break;
        case "pin":
          setError("pin", { type: "server", message });
          handled = true;
          break;
        case "confirmPin":
          setError("confirmPin", { type: "server", message });
          handled = true;
          break;
        case "general":
          setError("confirmPin", { type: "server", message });
          handled = true;
          break;
        default:
          break;
      }
    });
    return handled;
  };

  const onSubmit = async (data: FormData) => {
    clearErrors();
    if (data.pin !== data.confirmPin) {
      setError("confirmPin", { type: "manual", message: "PINs don't match" });
      return;
    }

    try {
      await register({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        pin: data.pin,
      });
    } catch (error) {
      if (error instanceof Error && applyServerErrors((error as any).details)) {
        return;
      }
      const message = error instanceof Error ? error.message : "Registration failed";
      const normalized = message.toLowerCase();
      if (normalized.includes("name")) {
        setError("fullName", { type: "server", message });
      } else if (normalized.includes("username")) {
        setError("username", { type: "server", message });
      } else if (normalized.includes("email")) {
        setError("email", { type: "server", message });
      } else if (normalized.includes("pin")) {
        setError("pin", { type: "server", message });
      } else {
        setError("confirmPin", { type: "server", message });
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      bounces={false}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="always"
      extraScrollHeight={20}
      enableOnAndroid
      className="flex-1 bg-[#f5f6fa]"
    >
      <VStack className="items-center px-6 py-10" space="xl">
        <VStack className="items-center" space="sm">
          <Box
            className="h-16 w-16 items-center justify-center rounded-full bg-[#0066ff]"
            style={{
              shadowColor: "#000000",
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}
          >
            <SvgUri accessibilityLabel="Smart Ngising logo" uri={logoUri} height={48} width={48} />
          </Box>
          <Text className="text-[28px] font-bold text-[#2f3542]">Smart Ngising</Text>
          <Text className="text-base text-[#57606f]">Create Your Account</Text>
        </VStack>

        <Box
          className="w-full rounded-xl bg-white px-6 py-8"
          style={{
            maxWidth: 360,
            shadowColor: "#000000",
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
          }}
        >
          <VStack space="lg">
            <Text className="text-center text-2xl font-bold text-[#2f3542]">Sign Up</Text>

            <VStack space="md">
              <FormControl isInvalid={!!errors.fullName}>
                <FormControlLabel>
                  <FormControlLabelText className="text-base font-medium text-[#2f3542]">
                    Full Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input className="h-11 rounded-lg border-0 bg-[#f3f3f5]">
                      <InputField
                        value={value}
                        onChangeText={(text) => {
                          if (errors.fullName) clearErrors("fullName");
                          onChange(text);
                        }}
                        onBlur={onBlur}
                        placeholder="John Doe"
                        placeholderTextColor="#717182"
                        className="text-base text-[#2f3542]"
                      />
                    </Input>
                  )}
                />
                {errors.fullName && (
                  <FormControlError>
                    <FormControlErrorText>{errors.fullName.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.username}>
                <FormControlLabel>
                  <FormControlLabelText className="text-base font-medium text-[#2f3542]">
                    Username
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input className="h-11 rounded-lg border-0 bg-[#f3f3f5]">
                      <InputField
                        value={value}
                        onChangeText={(text) => {
                          if (errors.username) clearErrors("username");
                          onChange(text);
                        }}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="johndoe"
                        placeholderTextColor="#717182"
                        className="text-base text-[#2f3542]"
                      />
                    </Input>
                  )}
                />
                {errors.username && (
                  <FormControlError>
                    <FormControlErrorText>{errors.username.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormControlLabel>
                  <FormControlLabelText className="text-base font-medium text-[#2f3542]">
                    Email
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input className="h-11 rounded-lg border-0 bg-[#f3f3f5]">
                      <InputField
                        value={value}
                        onChangeText={(text) => {
                          if (errors.email) clearErrors("email");
                          onChange(text);
                        }}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        placeholder="john@example.com"
                        placeholderTextColor="#717182"
                        className="text-base text-[#2f3542]"
                      />
                    </Input>
                  )}
                />
                {errors.email && (
                  <FormControlError>
                    <FormControlErrorText>{errors.email.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.pin}>
                <FormControlLabel>
                  <FormControlLabelText className="text-base font-medium text-[#2f3542]">
                    PIN
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="pin"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input className="h-11 rounded-lg border-0 bg-[#f3f3f5]">
                      <InputField
                        value={value}
                        onChangeText={(text) => {
                          if (errors.pin) clearErrors("pin");
                          onChange(text);
                        }}
                        onBlur={onBlur}
                        secureTextEntry={!showPin}
                        keyboardType="number-pad"
                        maxLength={6}
                        placeholder="••••••"
                        placeholderTextColor="#717182"
                        className="text-base text-[#2f3542]"
                      />
                      <InputSlot className="pr-3" onPress={() => setShowPin((p) => !p)}>
                        <Ionicons
                          name={showPin ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#8a8e9a"
                        />
                      </InputSlot>
                    </Input>
                  )}
                />
                {errors.pin && (
                  <FormControlError>
                    <FormControlErrorText>{errors.pin.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPin}>
                <FormControlLabel>
                  <FormControlLabelText className="text-base font-medium text-[#2f3542]">
                    Confirm PIN
                  </FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="confirmPin"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input className="h-11 rounded-lg border-0 bg-[#f3f3f5]">
                      <InputField
                        value={value}
                        onChangeText={(text) => {
                          if (errors.confirmPin) clearErrors("confirmPin");
                          onChange(text);
                        }}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirmPin}
                        keyboardType="number-pad"
                        maxLength={6}
                        placeholder="••••••"
                        placeholderTextColor="#717182"
                        className="text-base text-[#2f3542]"
                      />
                      <InputSlot className="pr-3" onPress={() => setShowConfirmPin((p) => !p)}>
                        <Ionicons
                          name={showConfirmPin ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#8a8e9a"
                        />
                      </InputSlot>
                    </Input>
                  )}
                />
                {errors.confirmPin && (
                  <FormControlError>
                    <FormControlErrorText>{errors.confirmPin.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isRegistering}
                className="h-12 rounded-xl bg-[#0066ff]"
                style={{
                  shadowColor: "#000000",
                  shadowOpacity: 0.16,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                }}
              >
                {isRegistering && <ButtonSpinner color="white" />}
                <ButtonText className="text-base font-medium">
                  {isRegistering ? "Creating..." : "Create Account"}
                </ButtonText>
              </Button>
            </VStack>

            <Box className="flex-row justify-center gap-1">
              <Text className="text-base text-[#57606f]">Already have an account?</Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="text-base font-medium text-[#0066ff]">Log In</Text>
                </Pressable>
              </Link>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;

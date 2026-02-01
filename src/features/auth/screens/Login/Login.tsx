import { logoSvg } from "@/assets";
import {
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  InputSlot,
  Pressable,
  Text,
  VStack,
} from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SvgUri } from "react-native-svg";

type FormData = {
  email: string;
  pin: string;
};

const Login = () => {
  const [showPin, setShowPin] = useState(false);
  const { login, isLoggingIn } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: "", pin: "" },
  });

  const logoUri = Asset.fromModule(logoSvg).uri;

  const applyServerErrors = (details: unknown) => {
    if (!details || typeof details !== "object") return false;
    let handled = false;
    Object.entries(details as Record<string, unknown>).forEach(([key, value]) => {
      const message = Array.isArray(value) ? value.join(", ") : String(value);
      if (key === "email" || key === "username") {
        setError("email", { type: "server", message });
        handled = true;
      } else if (key === "pin") {
        setError("pin", { type: "server", message });
        handled = true;
      } else if (key === "general") {
        setError("pin", { type: "server", message });
        handled = true;
      }
    });
    return handled;
  };

  const onSubmit = async (data: FormData) => {
    clearErrors();
    try {
      await login({ email: data.email, pin: data.pin });
    } catch (error) {
      if (error instanceof Error && applyServerErrors((error as any).details)) {
        return;
      }
      const message = error instanceof Error ? error.message : "Unable to login";
      const normalized = message.toLowerCase();
      if (normalized.includes("email") || normalized.includes("username")) {
        setError("email", { type: "server", message });
      } else if (normalized.includes("pin") || normalized.includes("credential")) {
        setError("pin", { type: "server", message });
      } else {
        setError("pin", { type: "server", message });
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
          <Text className="text-base text-[#57606f]">Welcome Back</Text>
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
            <Text className="text-center text-2xl font-bold text-[#2f3542]">Log In</Text>

            <VStack space="md">
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

              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isLoggingIn}
                className="h-12 rounded-xl bg-[#0066ff]"
                style={{
                  shadowColor: "#000000",
                  shadowOpacity: 0.16,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                }}
              >
                {isLoggingIn && <ButtonSpinner color="white" />}
                <ButtonText className="text-base font-medium">
                  {isLoggingIn ? "Logging In..." : "Log In"}
                </ButtonText>
              </Button>
            </VStack>

            <Box className="flex-row justify-center gap-1">
              <Text className="text-base text-[#57606f]">Don&apos;t have an account?</Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text className="text-base font-medium text-[#0066ff]">Sign Up</Text>
                </Pressable>
              </Link>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </KeyboardAwareScrollView>
  );
};

export default Login;

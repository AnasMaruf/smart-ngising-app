import {
  Box,
  Button,
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
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Asset } from "expo-asset";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SvgUri } from "react-native-svg";
import { z } from "zod";

import { logoSvg } from "@/assets";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  pin: z.string().length(6, "PIN must be 6 digits").regex(/^\d+$/, "PIN must be numbers only"),
});

type FormData = z.infer<typeof schema>;

const LoginScreen = () => {
  const [showPin, setShowPin] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", pin: "" },
  });

  const logoUri = Asset.fromModule(logoSvg).uri;

  const onSubmit = (data: FormData) => {
    // TODO: Integrate login API
    console.log("Login data:", data);
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
                        onChangeText={onChange}
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
                        onChangeText={onChange}
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
                className="h-12 rounded-xl bg-[#0066ff]"
                style={{
                  shadowColor: "#000000",
                  shadowOpacity: 0.16,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 6,
                }}
              >
                <ButtonText className="text-base font-medium">Log In</ButtonText>
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

export default LoginScreen;

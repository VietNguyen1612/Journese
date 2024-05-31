import React, { useState } from "react";
import { Button, makeStyles, useTheme } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { LoadingScreen, SuccessAnimation } from "../../components";
import { sendOTP, signup } from "../../api/auth";
import { useLocalSearchParams, router } from "expo-router";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useAuthStore } from "../../store";
const { height, width } = Dimensions.get("window");

const CELL_COUNT = 4;

const VerifyOTP = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>();
  const [isFail, setIsFail] = useState<boolean>();
  const [code, setCode] = useState<string>("");
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const setAuthPayload = useAuthStore((state) => state.setAuthPayload);
  const { firstName, lastName, phone, password } = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
  }>();

  const handleSendOTP = async () => {
    await sendOTP(phone);
    setIsSuccess(true);
    setCode("");
    setTimeout(() => {
      setIsSuccess(false);
    }, 1500);
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const response = await signup({
        firstName,
        lastName,
        phone,
        password,
        code,
      });
      if (response?.statusCode !== 201) {
        setIsLoading(false);
        setIsFail(true);
        return;
      }
      setAuthPayload(response.metadata);
      router.push("/(general)/interest");
    } catch (error) {
      setIsLoading(false);
      setIsFail(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <SafeAreaView style={styles.screenContainer}>
          {isFail && (
            <SuccessAnimation
              isSuccess={false}
              content="Mã xác nhận sai"
              onPress={() => setIsFail(false)}
            />
          )}
          {isSuccess && (
            <SuccessAnimation
              isSuccess={true}
              content="Gửi lại mã thành công!"
              onPress={() => setIsSuccess(false)}
            />
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <View
              style={{
                height: "90%",
                justifyContent: "center",
                paddingHorizontal: 26,
                gap: height / 20,
              }}
            >
              <Text style={styles.title}>Nhập mã xác thực</Text>
              <CodeField
                ref={ref}
                {...props}
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol ||
                      (isFocused ? (
                        <Text
                          style={{
                            lineHeight: height / 15,
                          }}
                        >
                          <Cursor />
                        </Text>
                      ) : null)}
                  </Text>
                )}
              />
              <Pressable onPress={() => handleSendOTP()}>
                <Text
                  style={{
                    textAlign: "center",
                    color: theme.colors.grey3,
                    textDecorationLine: "underline",
                  }}
                >
                  Gửi lại mã xác thực
                </Text>
              </Pressable>
              <Button
                disabled={code.length !== 4}
                radius={40}
                title="Xác thực"
                size="lg"
                onPress={() => handleSignup()}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  screenContainer: {
    backgroundColor: theme.colors.page,
    flex: 1,
  },
  container: {
    marginTop: height / 14,
    marginHorizontal: 16,
  },
  root: { flex: 1, padding: 20 },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    color: theme.colors.grey1,
  },
  codeFieldRoot: {
    marginTop: 20,
  },
  cell: {
    width: width / 6,
    height: height / 13,
    lineHeight: height / 13,
    fontSize: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.grey4,
    textAlign: "center",
    textAlignVertical: "center",
  },
  focusCell: {
    borderColor: theme.colors.brand.primary[600],
    backgroundColor: theme.colors.brand.primary[50],
    borderWidth: 3,
  },
}));

export default VerifyOTP;

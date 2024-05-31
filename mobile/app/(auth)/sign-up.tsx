import React, { useState } from "react";
import { Button, Text, makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LoadingScreen, SuccessAnimation, TextInput } from "../../components";
import { sendOTP, signup, SignupRequest } from "../../api/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import { phoneRegExp } from "../../utils/regex";
import { router } from "expo-router";
import { useAuthStore } from "../../store";
const { height, width } = Dimensions.get("window");

const SignUp = () => {
  const styles = useStyles();
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFail, setIsFail] = useState<boolean>();
  const { setAuthPayload } = useAuthStore();
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <SafeAreaView style={styles.screenContainer}>
          {isFail && (
            <SuccessAnimation
              isSuccess={false}
              content="Số điện thoại đã tồn tại"
              onPress={() => setIsFail(false)}
            />
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    phone: "",
                    password: "",
                    repeatPassword: "",
                  }}
                  validateOnChange={shouldValidateOnChange}
                  onSubmit={async ({
                    firstName,
                    lastName,
                    phone,
                    password,
                  }) => {
                    const response = await sendOTP(phone);

                    if (response?.statusCode !== 200) {
                      setIsFail(true);
                      return;
                    }

                    router.push({
                      pathname: "/(auth)/verify-otp",
                      params: {
                        firstName,
                        lastName,
                        phone,
                        password,
                      },
                    });
                  }}
                  validationSchema={Yup.object().shape({
                    firstName: Yup.string()
                      .max(20, "Độ dài tối đa là 20 kí tự")
                      .required("*Bắt buộc "),
                    lastName: Yup.string()
                      .max(20, "Độ dài tối đa là 20 kí tự")
                      .required("*Bắt buộc "),
                    phone: Yup.string()
                      .length(10)
                      .matches(phoneRegExp, "Số điện thoại không hợp lệ")
                      .required("*Bắt buộc "),
                    password: Yup.string()
                      .min(6, "Độ dài tối thiểu là 6 kí tự")
                      .max(20, "Độ dài tối đa là 20 kí tự")
                      .required("*Bắt buộc"),
                    repeatPassword: Yup.string()
                      .min(6, "Độ dài tối thiểu là 6 kí tự")
                      .max(20, "Độ dài tối đa là 20 kí tự")
                      .required("*Bắt buộc")
                      .oneOf(
                        [Yup.ref("password")],
                        "Mật khẩu không trùng khớp"
                      ),
                  })}
                >
                  {({ handleChange, handleBlur, handleSubmit, errors }) => (
                    <View>
                      <Text headingM style={styles.title}>
                        Đăng ký tài khoản
                      </Text>
                      <TextInput
                        placeholder="Họ"
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        errorMessage={errors.firstName}
                      />
                      <TextInput
                        placeholder="Tên"
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        errorMessage={errors.lastName}
                      />
                      <TextInput
                        placeholder="Số điện thoại"
                        onChangeText={handleChange("phone")}
                        onBlur={handleBlur("phone")}
                        errorMessage={errors.phone}
                      />
                      <TextInput
                        placeholder="Mật khẩu"
                        secureTextEntry
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        errorMessage={errors.password}
                      />
                      <TextInput
                        placeholder="Nhập lại mật khẩu"
                        secureTextEntry
                        onChangeText={handleChange("repeatPassword")}
                        onBlur={handleBlur("repeatPassword")}
                        errorMessage={errors.repeatPassword}
                      />
                      <View style={styles.buttonViewWrapper}>
                        <Button
                          containerStyle={styles.buttonContainer}
                          titleStyle={styles.buttonTitleStyle}
                          title="Đăng ký"
                          color="primary"
                          size="md"
                          onPress={() => {
                            setShouldValidateOnChange(true);
                            handleSubmit();
                          }}
                        />
                      </View>
                    </View>
                  )}
                </Formik>
                <View style={[styles.problemContainer, { height: 100 }]}>
                  <Text style={[styles.problemTitle, styles.footerText]}>
                    Bạn đã có tài khoản?
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/sign-in")}
                  >
                    <Text style={[styles.problemText, styles.footerText]}>
                      Đăng nhập tại đây
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
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
  problemTitle: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 48,
    color: theme.colors.brand.primary["600"],
  },
  problemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginBottom: 32,
  },
  problemText: {
    color: theme.colors.brand.primary["600"],
  },
  buttonViewWrapper: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    borderRadius: 56,
  },
  buttonTitleStyle: {
    fontWeight: "600",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "500",
  },
}));

export default SignUp;

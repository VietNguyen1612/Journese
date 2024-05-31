import React, { useState } from "react";
import { Button, Text, makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, View } from "react-native";
import { LoadingScreen, SuccessAnimation, TextInput } from "../../components";
import { Formik } from "formik";
import * as Yup from "yup";
import { phoneRegExp } from "../../utils/regex";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SigninRequest, signin } from "../../api/auth";
import { useAuthStore, useExpoNotificationStore } from "../../store";

const SignIn = () => {
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldValidateOnChange, setShouldValidateOnChange] = useState(false);
  const [isFail, setIsFail] = useState<boolean>();
  const setAuthPayload = useAuthStore((state) => state.setAuthPayload);
  const { expoToken } = useExpoNotificationStore();
  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <SafeAreaView style={styles.screenContainer}>
          {isFail && (
            <SuccessAnimation
              isSuccess={false}
              content="Đăng nhập thất bại"
              onPress={() => setIsFail(false)}
            />
          )}
          <View style={styles.container}>
            <Formik<SigninRequest>
              initialValues={{ phone: "", password: "", expoToken: expoToken }}
              validateOnChange={shouldValidateOnChange}
              onSubmit={async (values) => {
                setIsLoading(true);
                const response = await signin(values);

                if (response?.statusCode !== 200) {
                  setIsLoading(false);
                  setIsFail(true);
                  return;
                }
                setIsLoading(false);
                setAuthPayload(response.metadata);
                router.push("/(tabs)/(profile)/account-menu");
                router.push("/(tabs)/(profile)/profile");
              }}
              validationSchema={Yup.object().shape({
                phone: Yup.string()
                  .length(10, "Số điện thoại phải gồm chính xác 10 số")
                  .matches(phoneRegExp, "Số điện thoại không hợp lệ")
                  .required("Số điện thoại bắt buộc "),
                password: Yup.string()
                  .min(6, "Độ dài tối thiểu là 6 kí tự")
                  .max(20, "Độ dài tối đa là 20 kí tự")
                  .required("Mật khẩu bắt buộc"),
              })}
            >
              {({ handleChange, handleBlur, handleSubmit, errors }) => (
                <View>
                  <Text headingM style={styles.title}>
                    Đăng nhập
                  </Text>
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
                  {/* <View style={styles.problemContainer}>
                    <Text style={styles.problemTitle}>
                      Gặp vấn đề với việc đăng nhập?
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/(auth)/sign-up")}
                    >
                      <Text style={styles.problemText}>Giải quyết ngay</Text>
                    </TouchableOpacity>
                  </View> */}
                  <View style={styles.buttonViewWrapper}>
                    <Button
                      containerStyle={styles.buttonContainer}
                      titleStyle={styles.buttonTitleStyle}
                      title="Đăng nhập"
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
          </View>
          <View style={[styles.problemContainer, { height: 100 }]}>
            <Text style={[styles.problemTitle, styles.footerText]}>
              Bạn chưa có tài khoản?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={[styles.problemText, styles.footerText]}>
                Đăng ký tại đây
              </Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 110,
    marginHorizontal: 28,
  },
  problemTitle: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 70,
    color: theme.colors.brand.primary["600"],
  },
  problemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    marginBottom: 20,
  },
  problemText: {
    color: theme.colors.brand.primary["600"],
  },
  buttonViewWrapper: {
    paddingHorizontal: 12,
    marginVertical: 18,
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

export default SignIn;

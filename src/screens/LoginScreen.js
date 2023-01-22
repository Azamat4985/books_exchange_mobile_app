import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { THEME } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const loginHandler = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("logged in"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 48, textAlign: "center", marginBottom: 50 }}>Авторизация</Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Email</Text>
      <TextInput style={styles.input} keyboardType="email-address" placeholder="Введите email" onChangeText={(text) => setEmail(text)} />
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Пароль</Text>
      <TextInput style={styles.input} placeholder="Введите пароль" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
      <TouchableOpacity style={styles.btn} activeOpacity={0.4} onPress={loginHandler}>
        <Text style={styles.btnText}>Вход</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "100%" }}>
        <Text style={{ marginRight: 5 }}>Нет аккаунта?</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.replace("SignUpScreen");
          }}
        >
          <Text style={{ color: THEME.MAIN_COLOR }}>Создать сейчас</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "center",
    // alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: THEME.MAIN_COLOR,
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

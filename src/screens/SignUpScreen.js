import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from "react-native";
import React, { useState } from "react";
import { THEME } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, push, set } from "firebase/database";
import { db } from "../../firebase";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();

  const registerHandler = () => {
    if (email !== "" && password !== "" && confirmPassword !== "" && username !== "") {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
          const user = userCredential.user;
          set(ref(db, "users/" + user.uid), {
            email: user.email,
            books: '',
            avatar: '',
            phone: phone,
            username: username,
          });
        });
      } else {
        Alert.alert("Пароли не совпадают");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <Text style={{ fontSize: 48, textAlign: "center", marginBottom: 50 }}>Регистрация</Text>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Email</Text>
          <TextInput style={styles.input} keyboardType="email-address" placeholder="Введите email" onChangeText={(text) => setEmail(text)} />
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Ваше имя</Text>
          <TextInput style={styles.input} keyboardType="default" placeholder="Как вас зовут?" onChangeText={(text) => setUsername(text)} />
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Ваше номер телефона</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Text style={{fontSize: 18, marginRight: 10}}>+7</Text>
            <TextInput style={styles.input2} keyboardType="phone-pad" placeholder="Номер телефона" onChangeText={(text) => setPhone(text)} />
          </View>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Пароль</Text>
          <TextInput style={styles.input} placeholder="Введите пароль" secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Подтвердите пароль</Text>
          <TextInput style={styles.input} placeholder="Введите пароль еще раз" secureTextEntry={true} onChangeText={(text) => setConfirmPassword(text)} />
          <TouchableOpacity style={styles.btn} activeOpacity={0.4} onPress={registerHandler}>
            <Text style={styles.btnText}>Регистрация</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "100%" }}>
            <Text style={{ marginRight: 5 }}>Уже есть аккаунт?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.replace("LoginScreen");
              }}
            >
              <Text style={{ color: THEME.MAIN_COLOR }}>Войдите</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "flex-start",
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
  input2: {
    width: "80%",
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
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

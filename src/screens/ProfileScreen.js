import { StyleSheet, Text, View, Button, ActivityIndicator, Image, TouchableOpacity, TextInput, Alert, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { onValue, ref, push, update } from "firebase/database";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref as sRef, uploadBytesResumable } from "firebase/storage";

import { THEME } from "../../theme";
import { auth, db } from "../../firebase";
import BookCard from "../components/BookCard";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState();
  const [myBooks, setMyBooks] = useState([]);
  const [isReady, setIsReady] = useState();
  const [user, setUser] = useState();
  const [uid, setUid] = useState();
  const navigation = useNavigation();
  
  useEffect(() => {
    onAuthStateChanged(auth, (resUser) => {
      if (resUser) {
        setUid(resUser.uid);
        onValue(ref(db, "books"), (snapshot) => {
          let booksArr = snapshot.val();
          let tempArr = [];
          for (const key in booksArr) {
            booksArr[key].id = key;
            if (booksArr[key].owner == resUser.uid) {
              tempArr.push(booksArr[key]);
            }
          }
          setMyBooks(tempArr);
        });

        onValue(ref(db, "users/" + resUser.uid), (snapshot) => {
          setUser(snapshot.val());
          setIsReady(true);
        });
      } else {
        signOut(auth);
      }
    });
  }, []);
  
  function Modal() {
    const [bookName, setBookName] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookLabel, setBookLabel] = useState('');

    const uploadBook = async () => {
      if (bookName !== "" && bookAuthor !== "") {
        push(ref(db, "books/"), {
          name: bookName,
          author: bookAuthor,
          owner: uid,
          label: bookLabel,
          time: JSON.stringify(new Date().toLocaleString("ru")),
        }).then(() => {
          Alert.alert("Книга успешно добавлена!");
          setModalVisible(false);
        });
      }
    };

    return (
      <View style={styles.modalBg}>
        <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "80%" }}>
          <Text style={{ fontSize: 24, color: "#db4035", alignSelf: "flex-end" }} onPress={() => setModalVisible(false)}>
            x
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 }}>Добавить книгу</Text>
          <TextInput
            style={{ height: 45, backgroundColor: "#eee", borderRadius: 10, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 20, marginBottom: 20 }}
            placeholder="Вставьте ссылку на фото книги"
            onChangeText={setBookLabel}
          />
          <TextInput
            style={{ height: 45, backgroundColor: "#eee", borderRadius: 10, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 20, marginBottom: 20 }}
            placeholder="Введите название книги"
            onChangeText={setBookName}
          />
          <TextInput
            style={{ height: 45, backgroundColor: "#eee", borderRadius: 10, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 20, marginBottom: 20 }}
            placeholder="Введите автора книги"
            onChangeText={setBookAuthor}
          />
          <TouchableOpacity>
            <TouchableOpacity onPress={uploadBook} style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: THEME.MAIN_COLOR, borderRadius: 10 }}>
              <Text style={{ fontWeight: "600", color: "#fff", textAlign: "center" }}>Добавить +</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function RenderProfile() {
    return (
      <View style={{ height: "100%" }}>
        <View style={{ backgroundColor: "#fff", width: "100%", paddingVertical: 20, paddingHorizontal: 40, flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <Image source={require("../../assets/avatar.jpg")} style={{ width: 80, height: 80, borderRadius: 100, marginRight: 15 }} />
          <View>
            <Text style={{ fontSize: 32 }}>{user.username}</Text>
            <Text style={{ color: "#696969" }}>{user.email}</Text>
          </View>
        </View>

        <View style={{ backgroundColor: "#fff", width: "100%", paddingVertical: 20, paddingHorizontal: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 16 }}>Количество книг - </Text>
              <Text style={{ fontSize: 24, color: THEME.MAIN_COLOR, fontWeight: "600" }}>{myBooks.length}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: THEME.MAIN_COLOR, borderRadius: 10 }}
            >
              <Text style={{ fontWeight: "600", color: "#fff" }}>Добавить +</Text>
            </TouchableOpacity>
          </View>

          {myBooks.length == 0 ? (
            <Text>Вы еще не добавили книги</Text>
          ) : (
            <FlatList
              style={{height: '70%'}}
              contentContainerStyle={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: 'stretch' }}
              data={myBooks}
              key={(item) => item.time}
              renderItem={({ item }) => <BookCard book={item} myBooks={myBooks}/>}
            />
          )}
        </View>

        {modalVisible ? Modal() : null}
      </View>
    );
  }

  return <View>{isReady ? <RenderProfile /> : <ActivityIndicator size={48} color={THEME.MAIN_COLOR} />}</View>;
};

export default ProfileScreen;

const styles = StyleSheet.create({
  modalBg: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.56)",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

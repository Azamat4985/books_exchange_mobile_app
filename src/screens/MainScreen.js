import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

import { db, auth } from "../../firebase";
import { THEME } from "../../theme";
import MainCard from "../components/MainCard";

const MainScreen = () => {
  const [allBooks, setAllBooks] = useState();
  const [uid, setUid] = useState();
  const [isModal, setIsModal] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isReady, setIsReady] = useState(false)
  const [currentBook, setCurrentBook] = useState("");
  const [currentReceiver, setCurrentReceiver] = useState();

  useEffect(() => {
    onValue(ref(db, "books"), (snapshot) => {
      let booksArr = snapshot.val();
      let tempArr = [];
      for (const key in booksArr) {
        booksArr[key].id = key;
        tempArr.push(booksArr[key]);
      }
      setAllBooks(tempArr);
    });

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
      }
    });

    setTimeout(() => {
      setIsReady(true)
    }, 5000)
  }, []);

  

  function addBookToChange(bookId) {
    const booksToChange = [];
    booksToChange.push(...selectedBooks);
    if (booksToChange.includes(bookId)) {
      booksToChange.splice(booksToChange.indexOf(bookId), 1);
    } else {
      booksToChange.push(bookId);
    }
    setSelectedBooks(booksToChange);
  }

  const sendChangeRequest = () => {
    let selectedBooksStr = JSON.stringify(selectedBooks);
    push(ref(db, "requests"), {
      from: uid,
      fromBooks: selectedBooksStr,
      to: currentReceiver,
      toBooks: currentBook,
    }).then(() => {
      Alert.alert("Запрос на обмен успешно отправлен!");
      setIsModal(false);
      setCurrentReceiver("");
      setCurrentBook("");
      setSelectedBooks([]);
    });
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {isReady ? <FlatList
          data={allBooks}
          contentContainerStyle={{ flexDirection: "column-reverse" }}
          key={(item) => item.time}
          renderItem={({ item }) => <MainCard item={item} setModal={setIsModal} setCurrentBook={setCurrentBook} setCurrentReceiver={setCurrentReceiver}/>}
        /> : <ActivityIndicator size={24} />}
      </View>
      {isModal ? (
        <TouchableOpacity
          onPress={() => {
            setIsModal(false);
          }}
          style={{ height: "60%", width: "100%", position: "absolute", top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        ></TouchableOpacity>
      ) : null}
      {isModal ? (
        <View style={{ height: "65%", backgroundColor: "#Fff", borderTopRightRadius: 20, borderTopLeftRadius: 20, padding: 30 }}>
          <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600", marginBottom: 20 }}>Выберите книги для обмена</Text>
          <FlatList
            data={myBooks}
            key={(item) => item.time}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  addBookToChange(item.id);
                }}
              >
                <View style={{ paddingLeft: 10, flexDirection: "column", justifyContent: "center" }}>
                  <Image source={{ uri: item.label }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                </View>
                <View style={{ padding: 10, width: "100%" }}>
                  <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, width: "80%" }}>{item.name}</Text>
                  <Text>Автор: {item.author}</Text>
                </View>
                {selectedBooks.includes(item.id) ? (
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      height: "100%",
                      width: 70,
                      borderBottomRightRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  >
                    <Ionicons name="checkmark-circle" color={"rgba(46, 170, 46, 1)"} size={30} />
                  </View>
                ) : null}
              </TouchableOpacity>
            )}
          />
          {selectedBooks.length != 0 ? (
            <TouchableOpacity style={{ backgroundColor: "rgba(46, 170, 46, 1)", marginTop: 20, padding: 20, borderRadius: 10 }} onPress={sendChangeRequest}>
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>Отправить</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: THEME.MAIN_COLOR,
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
  },
});

import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import SegmentControlTab from "react-native-segmented-control-tab";

import { auth, db } from "../../firebase";
import { THEME } from "../../theme";
import { onValue, ref, remove } from "firebase/database";

const RequestsScreen = () => {
  const [allRequests, setAllRequest] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [requestsToShow, setRequestsToShow] = useState([]);
  const [myUid, setMyUid] = useState();
  const [isReady, setIsReady] = useState();

  useEffect(() => {
    onValue(ref(db, "requests"), (snapshot) => {
      let data = snapshot.val();
      let tempArr = [];
      for (const key in data) {
        data[key].id = key;
        tempArr.push(data[key]);
      }
      setAllRequest(tempArr.reverse());
    });
    onAuthStateChanged(auth, (resUser) => {
      if (resUser) {
        setMyUid(resUser.uid);
      }
    });
    setTimeout(() => {
      setIsReady(true)
    }, 10000)
  }, []);

  function getReceiver(receiverID) {
    let userName;
    onValue(ref(db, "users/" + receiverID), (snapshot) => {
      let res = snapshot.val();
      userName = res.username;
    });
    return userName;
  }

  function getBook(bookID) {
    let book;
    onValue(ref(db, "books/" + bookID), (snapshot) => {
      book = snapshot.val();
    });
    return book;
  }

  function getPhone(userID) {
    let phone;
    onValue(ref(db, "users/" + userID), (snapshot) => {
      let user = snapshot.val();
      phone = user.phone;
    });
    console.log(phone)
    return phone;
  }

  function deleteRequest(id){
    Alert.alert(
      "Вы уверены?",
      "Вы уверены что хотите удалить запрос?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        { 
          text: "Да, уверен",
          onPress: () => {
            remove(ref(db, 'requests/' + id))
          },
          style: 'destructive' }
      ]
    );

  }

  function BookItem(bookID) {
    let item = getBook(bookID.bookID);
    return (
      <View style={styles.card}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: "column", justifyContent: "center" }}>
          <Image source={{ uri: item.label }} style={{ width: 50, height: 50, borderRadius: 50 }} />
        </View>
        <View style={{ width: "100%", paddingVertical: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, width: "70%" }}>{item.name}</Text>
          <Text>Автор: {item.author}</Text>
        </View>
      </View>
    );
  }

  function BookItem2(bookID) {
    let item = getBook(bookID);
    return (
      <View style={styles.card}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: "column", justifyContent: "center" }}>
          <Image source={{ uri: item.label }} style={{ width: 50, height: 50, borderRadius: 50 }} />
        </View>
        <View style={{ width: "100%", paddingVertical: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, width: "70%" }}>{item.name}</Text>
          <Text>Автор: {item.author}</Text>
        </View>
      </View>
    );
  }

  function RenderRequests() {
    let requestsArr = [];
    if (selectedTab == 0) {
      for (const key in allRequests) {
        if (allRequests[key].from == myUid) {
          requestsArr.push(allRequests[key]);
        }
      }
      return (
        <FlatList
          data={requestsArr}
          key={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, marginBottom: 20 }}>
              <Text style={{ marginBottom: 10 }}>
                Вы предлагаете <Text style={{ fontWeight: "600" }}>{getReceiver(item.to)}</Text> Ваши книги:
              </Text>
              <FlatList data={JSON.parse(item.fromBooks)} key={(item) => JSON.stringify(item)} renderItem={({ item }) => <BookItem bookID={item} />} />
              <Text style={{ marginBottom: 10 }}>НА</Text>
              {BookItem2(item.toBooks)}
              <TouchableOpacity style={{ padding: 20, borderRadius: 10, backgroundColor: "rgba(219, 48, 48, 1)" }} onPress={() => {deleteRequest(item.id)}}>
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>Удалить запрос</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      );
    } else {
      for (const key in allRequests) {
        if (allRequests[key].to == myUid) {
          requestsArr.push(allRequests[key]);
        }
      }
      return (
        <FlatList
          data={requestsArr}
          key={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, marginBottom: 20 }}>
              <Text style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "600" }}>{getReceiver(item.from)}</Text> предлагает свои книги:
              </Text>
              <FlatList data={JSON.parse(item.fromBooks)} key={(item) => JSON.stringify(item)} renderItem={({ item }) => <BookItem bookID={item} />} />
              <Text style={{ marginBottom: 10 }}>НА ВАШИ</Text>
              {BookItem2(item.toBooks)}
              <TouchableOpacity style={{ padding: 20, borderRadius: 10, backgroundColor: "#4287f5" }} onPress={() => {
                Linking.openURL(`tel:+7${getPhone(item.from)}`)
              }}>
                <Text style={{ textAlign: "center", color: "#fff", fontWeight: "600" }}>Позвонить</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      );
    }
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
      <SegmentControlTab
        values={["Исходящие", "Входящие"]}
        tabsContainerStyle={{ marginBottom: 20 }}
        selectedIndex={selectedTab}
        onTabPress={(index) => {
          setSelectedTab(index);
        }}
      />
      {isReady ? <RenderRequests /> : <ActivityIndicator size={24} />}
    </View>
  );
};

export default RequestsScreen;

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

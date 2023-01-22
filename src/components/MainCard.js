import React, {useState, useEffect} from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

import { ref, onValue, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";
import { THEME } from "../../theme";


const MainCard = ({item, setModal, setCurrentBook, setCurrentReceiver}) => {
    const [uid, setUid] = useState();
    const [owner, setOwner] = useState('')

    useEffect(() => {
        onValue(ref(db, "users/" + item.owner), (snapshot) => {
            let user;
            user = snapshot.val();
            setOwner(user.username)
          });
    }, [])

    console.log(setModal);

    
  const openModal = (bookId, ownerId) => {
    setModal(true);
    setCurrentBook(bookId);
    setCurrentReceiver(ownerId);
  };

  return (
    <View>
      {item.owner != uid ? (
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Image
              source={{ uri: item.label }}
              style={{
                width: 80,
                height: 100,
                resizeMode: "contain",
                marginRight: 10,
              }}
            />
            <View>
              <Text
                style={{ marginBottom: 10, fontSize: 20, fontWeight: "600", maxWidth: 220 }}
              >
                {item.name}
              </Text>
              <Text style={{ marginBottom: 10, maxWidth: 220  }}>
                Автор книги:{" "}
                <Text style={{ fontWeight: "600" }}>{item.author}</Text>
              </Text>
              <Text style={{ marginBottom: 10, maxWidth: 220  }}>
                Владелец книги:{" "}
                <Text style={{ fontWeight: "600" }}>
                  {owner}
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: "#1dad3a",
              borderRadius: 10,
            }}
            onPress={() => openModal(item.id, item.owner)}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Предложить обмен
            </Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 10, color: "#696969" }}>{item.time}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({});

export default MainCard;

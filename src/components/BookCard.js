import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ref, remove } from "firebase/database";

import { THEME } from "../../theme";
import { db } from "../../firebase";

const BookCard = ({ book }) => {
  
  const removeBook = () => {
    Alert.alert("Вы уверены?", "Вы уверены что хотите удалить книгу?", [
      {
        text: "Отмена",
      },
      {
        text: "Да, уверен",
        onPress: () => {
          remove(ref(db, 'books/' + book.id))
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={{marginBottom: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Image source={{uri: book.label}} style={{width: 100, height: 100, resizeMode: 'contain'}}/>
      </View>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>{book.name}</Text>
      <Text>Автор: {book.author}</Text>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity style={{ backgroundColor: "#eb3b3b", padding: 5, borderRadius: 5 }} onPress={removeBook}>
          <Ionicons name="trash" color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookCard;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.MAIN_COLOR,
    width: 160,
    marginBottom: 10,
    borderRadius: 10,
  },
});

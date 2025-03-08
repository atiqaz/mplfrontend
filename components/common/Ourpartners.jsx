import React from "react";
import { View, Text, Image, StyleSheet, FlatList, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const partners = [
    { id: "4", name: "Heaven public school", logo: "https://heavenpublicschoolkairo.com/wp-content/uploads/2018/12/cropped-new-heaven-png.png" },
  { id: "1", name: "Star Sports", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-W0PA4J6LyUiLqHnnnW6TvGNPq9EbUmW07Q&s" },
  { id: "2", name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png" },
  { id: "3", name: "JioHotstar", logo: "https://play-lh.googleusercontent.com/bp4jknyVZ8yDKhER9thIS1p9MBeU2LABqBX-sO8uaL1h5_keqlgMUmXv-CjfRWaqKw=w240-h480-rw" },
]

export default function OurPartners() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Official Partners</Text>
      <FlatList
        data={partners}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: {
    width: width * 0.4,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    margin: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
});

import React, { useCallback, useState } from "react";
import { StyleSheet, FlatList, View, TextInput } from "react-native";
import {
  Card,
  Avatar,
  Text,
  Button,
  Modal,
  Portal,
  Provider,
  IconButton,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import useAxios, { baseUrl } from "../../helper/useAxios";
import Header from "../../components/Header";
import { useData } from "../../context/useData";
import RefreshLayout from "../../helper/RefreshLayout";

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [visible, setVisible] = useState(false);
  const [purse, setPurse] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("green");

  const { selectedAuction } = useData();
  const { fetchData } = useAxios();

  const getTeam = async () => {
    setLoading(true);
    const res = await fetchData({
      url: `/api/users?auctionId=${selectedAuction}`,
      method: "GET",
    });
    setLoading(false);
console.log(`/api/users?auctionId=${selectedAuction}`,res)
    if (res.status) {
      setTeams(res.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getTeam();
    }, [selectedAuction])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "green";
      case "rejected":
        return "red";
      case "pending":
        return "orange";
      default:
        return "black";
    }
  };

  const showModal = (team) => {
    setSelectedTeam(team);
    setVisible(true);
  };

  const hideModal = () => {
    setSelectedTeam(null);
    setVisible(false);
  };

  const updateStatus = async (id, newStatus) => {
    const updatedTeams = teams.map((team) =>
      team._id === id ? { ...team, status: newStatus } : team
    );
    setTeams(updatedTeams);

    const res = await fetchData({
      url: `/api/users/${id}`,
      method: "PATCH",
      data: { status: newStatus },
    });

    if (res.status) {
      showSnackbar("Status updated successfully", "green");
    } else {
      showSnackbar("Failed to update status", "red");
    }
  };

  const handlePurseChange = useCallback((value) => {
    if (/^\d*$/.test(value)) {
      setPurse(value);
    }
  }, []);

  const assignPurse = async () => {
    if (!purse) return showSnackbar("Please enter a purse amount", "orange");

    setLoading(true);
    const { status } = await fetchData({
      url: `/api/users/assignpurse/${selectedAuction}`,
      method: "PATCH",
      data: { purseMoney: purse },
    });
    setLoading(false);

    if (status) {
      setPurse("");
      showSnackbar("Purse assigned successfully", "green");
      getTeam();
    } else {
      showSnackbar("Failed to assign purse", "red");
    }
  };

  const showSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  return (
    <RefreshLayout refreshFunction={getTeam}>
      <View style={styles.container}>
        <Header title={"Registered Team"} />

        {/* Purse Input and Global Button */}
        <View style={styles.purseContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Purse Amount"
            value={purse}
            onChangeText={handlePurseChange}
            keyboardType="numeric"
          />
          <Button mode="contained" onPress={assignPurse} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : "Assign Purse"}
          </Button>
        </View>

        <FlatList
          data={teams}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.name}
                subtitle={
                  <Text style={{ color: getStatusColor(item.status) }}>
                    {`${item.role.toUpperCase()} | Status: ${item.status}`}
                  </Text>
                }
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{
                      uri:`${baseUrl}${item.image}`
                    }}
                  />
                )}
              />
              <Card.Content>
                {/* Show Total Purse and Remaining Purse only if available */}
                {item?.totalPurse && (
                  <Text style={styles.purseText}>
                    Total Purse: {item.totalPurse}
                  </Text>
                )}
                {item?.remainingPurse && (
                  <Text style={styles.purseText}>
                    Remaining Purse: {item.remainingPurse}
                  </Text>
                )}
              </Card.Content>

              <Card.Actions style={styles.actions}>
                {item.status !== "accepted" && (
                  <IconButton
                    icon="check"
                    color="green"
                    size={24}
                    onPress={() => updateStatus(item._id, "accepted")}
                  />
                )}
                {item.status !== "rejected" && (
                  <IconButton
                    icon="close"
                    color="red"
                    size={24}
                    onPress={() => updateStatus(item._id, "rejected")}
                  />
                )}
                <Button onPress={() => showModal(item)}>Details</Button>
              </Card.Actions>
            </Card>
          )}
        />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            {selectedTeam && (
              <>
                <Avatar.Image
                  size={100}
                  source={{
                    uri: `${baseUrl}${selectedTeam.image}`|| "https://via.placeholder.com/100",
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.modalName}>{selectedTeam.name}</Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Email: </Text>
                  {selectedTeam.email}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Phone: </Text>
                  {selectedTeam.phone}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Role: </Text>
                  {selectedTeam.role}
                </Text>
                <Text style={styles.modalDetail}>
                  <Text style={styles.label}>Status: </Text>
                  {selectedTeam.status}
                </Text>
                <Button mode="contained" onPress={hideModal}>
                  Close
                </Button>
              </>
            )}
          </Modal>
        </Portal>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{ backgroundColor: snackbarColor }}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </RefreshLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f5f5" },
  purseText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  actions: { justifyContent: "space-between" },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  input:{
    marginBottom: 10,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    height:50
  },
  card:{
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginTop:10
  }
});



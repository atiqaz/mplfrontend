import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import useAxios, { baseUrl } from '../helper/useAxios';
import { Card, Text, Paragraph, Avatar, Chip, Appbar } from 'react-native-paper';
import { widthPerWidth } from '../helper/dimensions';
import { useData } from '../context/useData';

export default function Lists() {
  const { name } = useLocalSearchParams();
  const { fetchData } = useAxios();
  const { selectedAuction, setSelectedAuction, auctionData } = useData()
  const [listData, setListData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const getData = async () => {
    try {
      const { data } = await fetchData({
        url: `/api/dashboard?type=${name}&auctionId=${selectedAuction}`,
        method: 'GET',
      });
      console.log(data)
      setListData(data);
      setFilteredData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, [name]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(listData);
    } else {
      const filtered = listData.filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  const backgoundC = (status) => {
    switch (status) {
      case "sold":
        return "#4CAF50";
      case "unSold":
        return "#F44336";
      default:
        return "#FFC107";
    }
  }
  const navToTeam =(item)=>{

  }

  const renderPlayer = ({ item }) => (
    <Card style={styles.card} onPress={() => router.push(`playerDetails?playerId=${item._id}`)}>
      <Card.Title
        title={item.name}
        left={(props) => (
          <Avatar.Image size={50} source={{ uri: `${baseUrl}${item.image}` }} />
        )}
        right={(props) => (
          <>{name !== "Teams" && <View>
            <Chip style={{ marginRight: 10 }} onPress={() => console.log('Pressed')}>
              {item.playerRole?.toUpperCase()}
            </Chip>
            <View style={{
              borderRadius: 5, marginRight: 10, marginTop: 5, paddingVertical: 5,
              backgroundColor: backgoundC(item?.biddingDetails?.status)
            }}>
              <Text style={{ textAlign: "center", fontSize: 15 }}>{item?.biddingDetails?.status || "Pending"}</Text>
            </View>
          </View>}</>
        )}
      />
      {name == "Teams" ? <Card.Content>
        <Paragraph>Email: {item.email}</Paragraph>

      </Card.Content>

        :
        <Card.Content>
          <Paragraph>Email: {item.email}</Paragraph>
          <Paragraph>Age: {item.age}</Paragraph>

          <Paragraph>Batting Hand: {item.battingDetails?.handedness}</Paragraph>
          <Paragraph>
            Wicketkeeper: {item.battingDetails?.isWicketkeeper ? 'Yes' : 'No'}
          </Paragraph>

        </Card.Content>}

    </Card>
  );

  const _goBack = () => router.back();

  const _toggleSearch = () => setIsSearching(!isSearching);

  return (
    <SafeAreaView style={[styles.container, { width: widthPerWidth(100) }]}>
      <Appbar.Header mode="center-aligned" elevated={false}>
        <Appbar.BackAction onPress={_goBack} />
        {isSearching ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Search players"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus // Ensures the keyboard opens immediately
          />
        ) : (
          <Appbar.Content
            title={name.toLocaleUpperCase()}
            titleStyle={{
              fontSize: 15,
              fontWeight: 'bold',
            }}
          />
        )}
        <Appbar.Action
          icon={isSearching ? 'close' : 'magnify'}
          onPress={_toggleSearch}
        />
      </Appbar.Header>

      <FlatList
        data={filteredData}
        renderItem={renderPlayer}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No {name.toUpperCase()} found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  card: {
    width: '95%',
    margin: 10,
    borderRadius: 10,
    elevation: 3, // Add shadow for Android
  },
  list: {
    paddingBottom: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginRight: 10,
  },
});

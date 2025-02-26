import { FlatList, StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableHighlight, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useAxios from '../helper/useAxios';
import { Card, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Players() {
    const [players, setPlayers] = useState([]);
    const { fetchData, loading } = useAxios();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const {auctionId} = useLocalSearchParams()
    console.log(auctionId)

    const getData = async () => {

        let url
        if(auctionId){
            url = `/api/players?auctionId=${auctionId}`
        }else{
            url = '/api/players'
        }
        try {
            const response = await fetchData({
                url:url,
                method: 'GET',
            });
            console.log(response.data)

            if (response?.status) {
                setPlayers(response.data);
            }
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // Filter players based on search query
    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header with Search Bar */}
            <View style={styles.header}>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <IconButton
                    icon="refresh"
                    size={24}
                    onPress={getData}
                />
            </View>

            {/* Loader while fetching data */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#6200EE" />
                    <Text style={styles.loadingText}>Loading players...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPlayers}
                    keyExtractor={(player) => player._id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push(`playerDetails?playerId=${item._id}`)}>

                            <Card style={styles.card} >
                                <Card.Content>
                                    <Text style={styles.playerName}>{item.name}</Text>
                                    <Text style={styles.detailText}>{item.battingDetails.handedness} {item.playerRole}</Text>
                                    <Text style={styles.detailText}>Bowling: {item.bowlingDetails.bowlingStyle}</Text>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginLeft: 8,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    card: {
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: '#FFF',
        padding: 12,
        elevation: 3,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    teamText: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    positionText: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
    detailText: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    }
});


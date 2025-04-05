import { FlatList, StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableHighlight, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import useAxios from '../helper/useAxios';
import { Card, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';

export default function Players() {
    const [players, setPlayers] = useState([]);
    const { fetchData, loading } = useAxios();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const {auctionId} = useLocalSearchParams()
    const { colors } = useTheme()
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
        <View style={[styles.container ,{
            backgroundColor: colors.background,
        
        }]}>
            {/* Header with Search Bar */}
            <View style={styles.header}>

                <TextInput
                    style={[styles.searchInput,{
                        color: colors.text,
                        // backgroundColor: colors.overlay(0.12),
                    }]}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={colors.text}

          
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

                            <View style={[styles.card,{
                                backgroundColor: colors.overlay(0.12),
                            }]} >
                                <Card.Content>
                                    <Text style={[styles.playerName,{
                                        color: colors.text,
                                    }]}>{item.name}</Text>
                                    <Text style={[styles.detailText,{
                                        color: colors.text,
                                    }]}>{item.battingDetails.handedness} {item.playerRole}</Text>
                                    <Text style={[styles.detailText,{
                                        color: colors.text,
                                    }]}>Bowling: {item.bowlingDetails.bowlingStyle}</Text>
                                </Card.Content>
                            </View>
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
        backgroundColor: 'red',
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
        // backgroundColor: '#FFF',
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
        paddingVertical:20,
        // elevation: 3,
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


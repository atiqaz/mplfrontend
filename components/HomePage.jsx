import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Appbar, TextInput } from 'react-native-paper';
import useAxios from '../helper/useAxios';
import { router } from 'expo-router';

export default function HomePage({isSearching, setIsSearching,searchQuery, setSearchQuery ,_toggleSearch}) {

    // const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState([]); // Store fetched players
    const { fetchData } = useAxios();
    const name = 'Search';

   

    const getData = async () => {
        try {
            const response = await fetchData({
                url: `/api/players?name=${searchQuery}`,
                method: 'GET',
            });

            if (response?.status) {
                setPlayers(response.data); // Set player data
            }
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            const timer = setTimeout(() => {
                getData();
            }, 400);
            return () => {
                clearTimeout(timer);
            };
        } else {
            setPlayers([]); // Clear list when no search query
        }
    }, [searchQuery]);

    const handleSearch = (text) => {
        setSearchQuery(text);
        setIsSearching(true);
    };

    return (
        <View style={styles.container}>
            
            {/* <Text>{players.length}</Text> */}

            {/* Players List */}
            <FlatList
                data={players}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => router.push(`playerDetails?playerId=${item._id}`)}>
                        <Image
                            source={
                                item.image
                                    ? { uri: item.image }
                                    : ''
                            }
                            style={styles.playerImage}
                        />
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.role}>{item.playerRole}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    searchQuery && players.length === 0 ? (
                        <Text style={styles.noResults}>No players found</Text>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff',
    },
   
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginHorizontal: 10,
        elevation: 2,
    },
    playerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    role: {
        fontSize: 14,
        color: 'gray',
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});

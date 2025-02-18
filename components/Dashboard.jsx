import { router } from 'expo-router';
import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';


export default function Dashboard({ dashboard }) {

    const { registeredPlayers, wicketKeepersCount, batsman, bowlers, allrounders, registeredTeams } = dashboard

    const data = [
        { title: 'Registered Players', value: registeredPlayers?.length },
        { title: 'Wicketkeepers', value: wicketKeepersCount },
        { title: 'All Rounders', value: allrounders },
        { title: 'Batsman', value: batsman },
        { title: 'Bowlers', value: bowlers },
        { title: 'Teams', value: registeredTeams },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => router.push(`lists?name=${item.title}`)} style={styles.card}>
            <Card >
                <Card.Content>
                    <Title style={styles.cardTitle}>{item.title}</Title>
                    <Paragraph style={styles.cardValue}>{item.value}</Paragraph>
                </Card.Content>
                
            </Card>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.title}
            numColumns={2} // 2 items per row in grid
            contentContainerStyle={styles.grid}
        />
    );
}

const styles = StyleSheet.create({
    grid: {
        padding: 10,
        justifyContent: 'space-between',
        // backgroundColor:"green", 
        marginTop:0
    },
    card: {
        flex: 1,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    cardValue: {
        fontSize: 20,
        color: '#4caf50',
        fontWeight: 'bold',
    },
});

import { StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import useAxios from '../../helper/useAxios';
import { ActivityIndicator, Surface } from 'react-native-paper';
import { heightPerHeight } from '../../helper/dimensions';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function AdminDashBoard() {
    const navigation = useNavigation();
    const { fetchData, loading } = useAxios();
    const [totals, setTotal] = useState({
        "Total Players": 0,
        "Total Teams": 0,
        "Total Auctions": 0
    });

    const getData = async () => {
        const res = await fetchData({ url: '/api/dashboard', method: 'GET' });
        setTotal({
            "Total Players": res.data?.totalPlayers || 0,
            "Total Teams": res.data?.totalUsers || 0,
            "Total Auctions": res.data?.totalAuctions || 0
        });
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    // Define onPress handlers for each card
    const handlePress = (category) => {
        switch (category) {
            case "Total Players":
                navigation.navigate('players'); // Change to your actual screen
                break;
            case "Total Teams":
                router.push('teams'); // Change to your actual screen
                break;
            case "Total Auctions":
                navigation.navigate('allAuctions'); // Change to your actual screen
                break;
            default:
                console.log("No action defined for:", category);
        }
    };

    return (
        <View style={styles.container}>
            {Object.keys(totals).map((key, index) => (
                <Pressable key={index} onPress={() => handlePress(key)} style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}>
                    <Surface style={styles.cardContent} elevation={4}>
                        <Text style={styles.cardTitle}>{key}</Text>
                        <Text style={styles.cardValue}>{totals[key]}</Text>
                    </Surface>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#F4F4F4",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: heightPerHeight(90),
    },
    card: {
        width: "48%",
        marginBottom: 12,
        borderRadius: 12,
    },
    cardContent: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#FFF",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    pressedCard: {
        opacity: 0.7, // Slight transparency effect when pressed
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: "600",
        color: "#6200EE",
    },
});

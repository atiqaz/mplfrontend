import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SegmentedButtons, Card, Badge } from 'react-native-paper';
import useAxios from '../helper/useAxios';

export default function Teams() {
    const [value, setValue] = useState('pending');
    const { fetchData, loading } = useAxios();
    const [data, setData] = useState([]);

    const getTeams = async () => {
        try {
            const res = await fetchData({
                url: `/api/users?status=${value}`,
                method: 'GET',
            });

            if (res.status) {
                setData(res.data);
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    useEffect(() => {
        getTeams();
    }, [value]);

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={value}
                onValueChange={setValue}
                buttons={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'accepted', label: 'Accepted' },
                    { value: 'rejected', label: 'Rejected' },
                ]}
                style={styles.segmentedButtons}
            />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#6200EE" />
                    <Text style={styles.loadingText}>Loading teams...</Text>
                </View>
            ) : data.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No teams found.</Text>
                </View>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.teamName}>{item.name}</Text>
                                    <Badge style={[styles.statusBadge, getStatusStyle(item.status)]}>
                                        {item.status.toUpperCase()}
                                    </Badge>
                                </View>
                                <Text style={styles.teamEmail}>{item.email}</Text>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}
        </View>
    );
}

const getStatusStyle = (status) => {
    switch (status) {
        case 'pending':
            return { backgroundColor: '#FFA500' }; // Orange
        case 'accepted':
            return { backgroundColor: '#4CAF50' }; // Green
        case 'rejected':
            return { backgroundColor: '#FF3B30' }; // Red
        default:
            return { backgroundColor: '#999' }; // Grey for unknown statuses
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F4F4F4',
    },
    segmentedButtons: {
        marginBottom: 12,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#FFF',
        elevation: 3,
        padding: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    teamName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    teamEmail: {
        fontSize: 14,
        color: '#555',
    },
    statusBadge: {
        color: 'white',
    paddingHorizontal:8
    },
});

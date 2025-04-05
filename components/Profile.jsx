import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Avatar, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import RefreshLayout from '../helper/RefreshLayout';
import { getUserProfile } from '../helper/Api';
import { useTheme } from '../hooks/useTheme';

const ProfilePage = (props) => {
    const { user } = props;
    const { colors } = useTheme();
    const { logout, userToken } = useAuth();
    const { getUser } = getUserProfile();

    const getBg = (status) => {
        if (status === "accepted") return 'green';
        if (status === "rejected") return 'red';
        return 'orange';
    };

    useEffect(() => {
        getUser(userToken);
    }, []);

    const getuserDet = () => {
        getUser(userToken);
    };

    return (
        <RefreshLayout refreshFunction={getuserDet}>
            <ScrollView
                contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.header}>
                    <Avatar.Image size={120} source={{ uri: 'https://example.com/team-logo.png' }} />
                    <Text style={[styles.franchiseName, { color: colors.text }]}>Team {user.name}</Text>
                    <Paragraph style={[styles.description, { color: colors.overlay(0.7) }]}>
                        The best cricket franchise with top-tier players and incredible performance!
                    </Paragraph>
                </View>

                {/* User Information */}
                <Card mode='contained' style={[styles.card, { backgroundColor: colors.overlay(0.1) }]}>
                    <Card.Content>
                        <Text style={[styles.cardTitle, { color: colors.primary }]}>User Information</Text>
                        <View style={styles.infoContainer}>
                            <MaterialCommunityIcons name="account" size={20} color={colors.overlay(0.8)} />
                            <Paragraph style={[styles.infoText, { color: colors.text }]}>{user.name}</Paragraph>
                        </View>
                        <View style={styles.infoContainer}>
                            <MaterialCommunityIcons name="email" size={20} color={colors.overlay(0.8)} />
                            <Paragraph style={[styles.infoText, { color: colors.text }]}>{user.email}</Paragraph>
                        </View>
                        {user.role === "organisation" && (
                            <View style={[styles.infoContainer, {
                                backgroundColor: getBg(user.status),
                                borderRadius: 10,
                                padding: 5,
                                paddingLeft: 10,
                            }]}>
                                <MaterialCommunityIcons name="status" size={20} color="white" />
                                <Paragraph style={[styles.infoText, {
                                    color: "white",
                                    textTransform: "uppercase",
                                }]}>{user.status}</Paragraph>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Team Stats */}
                <View style={styles.statsContainer}>
                    <Card mode='contained'  style={[styles.statCard, { backgroundColor: colors.overlay(0.05) }]}>
                        <Card.Content style={styles.statCardContent}>
                            <MaterialCommunityIcons name="trophy" size={30} color="#f5a623" />
                            <Text style={[styles.statTitle, { color: colors.text }]}>Wins</Text>
                            <Text style={[styles.statValue, { color: colors.text }]}>50</Text>
                        </Card.Content>
                    </Card>
                    <Card  mode='contained' style={[styles.statCard, { backgroundColor: colors.overlay(0.05) }]}>
                        <Card.Content style={styles.statCardContent}>
                            <MaterialCommunityIcons name="close-circle" size={30} color="red" />
                            <Text style={[styles.statTitle, { color: colors.text }]}>Losses</Text>
                            <Text style={[styles.statValue, { color: colors.text }]}>20</Text>
                        </Card.Content>
                    </Card>
                    <Card  mode='contained' style={[styles.statCard, { backgroundColor: colors.overlay(0.05) }]}>
                        <Card.Content style={styles.statCardContent}>
                            <MaterialCommunityIcons name="star" size={30} color="gold" />
                            <Text style={[styles.statTitle, { color: colors.text }]}>Ranking</Text>
                            <Text style={[styles.statValue, { color: colors.text }]}>1st</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Team Details */}
                <Card mode='contained' style={[styles.card, { backgroundColor: colors.overlay(0.1) }]}>
                    <Card.Content>
                        <Text style={[styles.cardTitle, { color: colors.primary }]}>Team Members</Text>
                        <Paragraph style={[styles.infoText, { color: colors.text }]}>Player 1, Player 2, Player 3...</Paragraph>
                    </Card.Content>
                </Card>

                <Card mode='contained' style={[styles.card, { backgroundColor: colors.overlay(0.1) }]}>
                    <Card.Content>
                        <TouchableOpacity onPress={() => router.push('puchasedPlayer')}>
                            <Text style={[styles.cardTitle, { color: colors.primary }]}>Purchased player</Text>
                            <Paragraph style={[styles.infoText, { color: colors.text }]}>Player 1, Player 2, Player 3...</Paragraph>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                {/* Buttons */}
                <Button
                    mode="contained"
                    style={styles.button}
                    icon="account-edit"
                    onPress={() => alert('Edit Profile')}
                >
                    Edit Profile
                </Button>
                <Button
                    mode="outlined"
                    style={styles.button}
                    icon="logout"
                    onPress={() => logout()}
                >
                    Logout
                </Button>
            </ScrollView>
        </RefreshLayout>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 50,
    },
    franchiseName: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        margin: 4,
        borderRadius: 10,
        elevation: 3,
    },
    statCardContent: {
        alignItems: 'center',
        padding: 12,
    },
    statTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
    },
    button: {
        marginTop: 12,
        borderRadius: 50,
    },
});

export default ProfilePage;

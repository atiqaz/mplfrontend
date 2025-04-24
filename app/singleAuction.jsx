import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Divider, Chip, Button, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import useAxios from '../helper/useAxios';
import { useTheme } from '../hooks/useTheme';
import { widthPerWidth } from '../helper/dimensions';
import { useSnackbar } from '../context/useSnackBar';
import { useAuth } from '../context/AuthContext';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useSocket } from '../context/socketContext';

export default function SingleAuction() {
    const { auctionId } = useLocalSearchParams();
    const { userRole } = useAuth()
    const { showSnackbar } = useSnackbar()
    const navigation = useNavigation();
    const { fetchData } = useAxios();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [remainigTime, setRemainingTime] = useState('')
    const [money, setMoney] = useState(0)
    const { colors } = useTheme()
    const { socket } = useSocket()

    const getData = async () => {
        try {
            const res = await fetchData({
                url: `/api/auction/singleAuction/details/${auctionId}`,
                method: 'GET',
            });
            setData(res.data);
            console.log(JSON.stringify(res.data))
            // setRemainingTime(res.data.auction.auctionDate)
            navigation.setOptions({ title: res.data.auction.title });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRemainingTime = () => {
        const now = new Date()
        const auctionDate = new Date(data?.auction?.auctionDate)
        const diffTime = auctionDate.getTime() - now.getTime()
        const hours = Math.floor(diffTime / (1000 * 60 * 60))
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diffTime % (1000 * 60)) / 1000)
        if (hours < 0 || minutes < 0 || seconds < 0) {
            return 'Auction Ended'
        }  // If auction ended, return "Auction Ended" instead of remaining time

        if (hours >= 24) {
            const day = hours / 24
            const remainingDays = hours % 24
            return `${day.toFixed(0)}d ${remainingDays}h ${seconds}s`
        }
        // Format remaining time

        return `${hours}h ${minutes}m ${seconds}s`
    }
    // -----------------------Sockets----------------------
    useEffect(() => {

    }, [])
    useEffect(() => {
        const timer = setInterval(() => {
            const time = getRemainingTime()
            setRemainingTime(time)
        }, 1000)
        return () => clearInterval(timer)
    }, [data])

    useEffect(() => {
        getData();
    }, [auctionId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={[styles.container, {
                backgroundColor: colors.background,
                justifyContent: 'center',
                alignItems: 'center',
            }]}>
                <Text variant="titleMedium">No Data Found</Text>
            </View>
        );
    }

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#FFC107';   // Yellow
            case 'InProgress': return '#03A9F4'; // Blue
            case 'Completed': return '#4CAF50';  // Green
            default: return '#9E9E9E';           // Grey
        }
    };


    const assignMoney = async () => {
        const payload = {
            auctionId: auctionId,
            price: money
        }
        const res = await fetchData({
            url: `/api/auction/singleAuction/assignPurse`,
            method: 'PUT',
            data: payload
        });
        if (res.status) {
            showSnackbar(res.message, "success")
            setMoney('')
            getData()
        }

    }

    const startAuction = () => {
      if(data.auction.status !== "Completed"){ 
        if(userRole === "admin"){
        socket.emit('startAuction', {
            start: true,
            auctionId: auctionId
        })
        }
        
        
    }
    router.push(`/aTable?AuctionId=${auctionId}`)
}




    // console.log(JSON.stringify(data))
    return (
        <ScrollView style={[styles.container, {
            backgroundColor: colors.background,

        }]}>
            <Card mode="contained" style={[styles.card, {
                padding: 2,
                backgroundColor: colors.overlay(0.12),
            }]}>
                <Card.Title title={data.auction.title} right={() => <Text style={{ marginRight: 15, fontWeight: "800" }}>{remainigTime}</Text>} />

                <Card.Content>
                    <View style={styles.statusContainer}>
                        <Text variant="bodySmall" style={[styles.date, {
                            color: colors.overlay(0.7),
                        }]}>
                            Auction Date: {new Date(data.auction.auctionDate).toDateString()}
                        </Text>
                        <Chip textStyle={{
                            fontSize: 12,

                        }} style={[styles.statusBadge, { backgroundColor: getStatusColor(data.auction.status) }]}>
                            {data.auction.status}
                        </Chip>
                        <TouchableOpacity style={{
                            backgroundColor: colors.primary,
                            padding: 10, borderRadius: 50
                        }}
                            onPress={startAuction}
                        >
                            <SimpleLineIcons name="control-start" size={18} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text variant="bodyMedium" style={[styles.description, {
                        color: colors.text,
                    }]}>
                        {data.auction.description}
                    </Text>
                </Card.Content>
            </Card>

            <Divider bold style={styles.divider} />
            {userRole === "admin" && <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 15 }}>
                <TextInput
                    mode='outlined'
                    placeholder='purse Money'
                    label="Purse Money"
                    keyboardType='number-pad'
                    value={money}
                    style={{
                        width: widthPerWidth(52),


                    }}
                    onChangeText={text => setMoney(text)}


                />
                <Button mode='contained' style={{ width: 150, alignSelf: "flex-end" }} size={'sm'} onPress={assignMoney}>
                    Assign Money
                </Button>
            </View>}

            <Text variant="titleMedium" style={styles.sectionTitle}>Teams</Text>
            {data?.teams?.length > 0 ? (
                data.teams.map((team) => (
                    <Card key={team._id} mode="outlined" style={styles.card}>
                        <Card.Title
                            title={team.name}
                            subtitle={team.email}
                            left={(props) => <Avatar.Text {...props} label={team.name.charAt(0)} />}
                        />
                        <Card.Content>

                            <Text variant="bodyMedium">Assigned Purse : {team?.auction[0]?.totalPurse}</Text>
                            <Text variant="bodyMedium">Remaining Purse : {team?.auction[0]?.remainingPurse}</Text>
                        </Card.Content>
                    </Card>
                ))
            ) : (
                <Text style={styles.noData}>No Teams Available</Text>
            )}

            <Divider bold style={styles.divider} />

            <View style={{
                flexDirection: "row", justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Players</Text>
                <TouchableOpacity onPress={() => navigation.navigate('players', {
                    auctionId: data.auction._id
                })}><Text variant="bodySmall" style={[styles.sectionTitle, {
                    textAlign: "right"
                }]}>See all</Text></TouchableOpacity>
            </View>
            {data?.players?.length > 0 ? (
                data.players.map((player) => (
                    <TouchableOpacity onPress={() => router.push(`playerDetails?playerId=${player._id}`)}>

                        <Card key={player._id} mode="outlined" style={styles.card} >
                            <Card.Title
                                title={player.name}
                                subtitle={`Role: ${player.playerRole}`}
                                left={(props) => <Avatar.Text {...props} label={player.name.charAt(0)} />}
                            />
                        </Card>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noData}>No Players Available</Text>
            )}
        </ScrollView>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // backgroundColor: '#FAFAFA',
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#FFF',

    },
    description: {
        flex: 1,
        marginBottom: 8,
        color: '#333',
    },
    date: {
        marginTop: 4,
        color: 'gray',
    },
    divider: {
        marginVertical: 12,
    },
    sectionTitle: {
        marginVertical: 10,
        fontWeight: 'bold',
    },
    noData: {
        textAlign: 'center',
        marginVertical: 10,
        color: 'gray',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        gap: 20
    },
    statusBadge: {

        borderRadius: 16,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 10
    },
});


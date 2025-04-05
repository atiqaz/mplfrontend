import * as React from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View, TouchableOpacity } from 'react-native';
import { SegmentedButtons, Card, Button } from 'react-native-paper';
import useAxios from '../helper/useAxios';
import { widthPerWidth } from '../helper/dimensions';
import { useAuth } from '../context/AuthContext';
import { isAuctionJoined } from '../helper/functions';
import { getUserProfile } from '../helper/Api';
import { router, useNavigation } from 'expo-router';
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
    const [value, setValue] = React.useState('upcoming');
    const { logout, userRole, mydetails, loggedInUser, setLoggedInUser, isLoggedIn, userToken } = useAuth();
    const { getUser } = getUserProfile()
    const { fetchData } = useAxios();
    const [allData, setAllData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const {colors}=useTheme()

    const getAllAuctions = async () => {
        setLoading(true);
        const { data, status } = await fetchData({
            url: `/api/auction/allauction?filter=${value}`,
            method: 'GET',
        });

        setAllData(data || []);
        setLoading(false);
    };

    React.useEffect(() => {
        getAllAuctions();
    }, [value]);

    const participate = async (item) => {
        if (!isLoggedIn) {
            router.push('auth')
        }
        if (userRole == "organisation") {
            const { data, status } = await fetchData({
                url: `/api/users/participte/${loggedInUser._id}`,
                method: 'POST',
                data: {
                    auctionId: item._id
                }
            })


            if (status) {
                getAllAuctions()
                getUser(userToken)
            }

        }
        if (userRole == 'player') {
            const { data, status } = await fetchData({
                url: `/api/players/player/update/${loggedInUser._id}/auctions`,

                method: 'PATCH',
                data: {
                    auctionIds: item._id
                }
            })

            if (status) {
                getAllAuctions()
                getUser(userToken)
            }
        }
    }
    const showButton = () => {
        if (isLoggedIn) {
            if (userRole == "organisation" || userRole == "player") {
                return true
            }
            return false
        }
        return true
    }

    const navigation = useNavigation()
    return (
        <SafeAreaView style={[styles.container,{
            backgroundColor: colors.background,
            // backgroundColor: '#F4F4F4',
        }]}>
            {/* Segmented Buttons for Filter */}
            <SegmentedButtons
                value={value}
                onValueChange={setValue}
                buttons={[
                    { value: 'upcoming', label: 'Upcoming' },
                    { value: 'live', label: '🟢Live' },
                    { value: 'finished', label: 'Finished' },
                ]}
            />
            {/* <Text>data {JSON.stringify(allData)}</Text> */}
            {/* Show Data or No Data Message */}
            {loading ? (
                <Text style={[styles.loadingText,{
                    color: colors.text,
                }]}>Loading...</Text>
            ) : allData && allData?.length > 0 ? (
                <FlatList
                    data={allData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        let isjoined
                        if (isLoggedIn) {
                            isjoined = isAuctionJoined(loggedInUser, item)
                        }
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate(`singleAuction`, {
                                auctionId: item._id
                            })}>
                                <View style={[styles.card, {
                                    backgroundColor: isjoined ? '#D8E0D2' : colors.overlay(0.1),


                                }]}>
                                    <Card.Title style={{color:colors.text}} title={item.title} />
                                    <Card.Content>
                                        <Text style={{color:colors.text}}>{item.description}</Text>
                                        <Text style={[styles.dateText,{color:colors.overlay(0.7)}]}>
                                            Auction Date: {new Date(item.auctionDate).toLocaleString()}
                                        </Text>
                                        {showButton() && <Card.Actions >
                                            <Button disabled={isjoined} onPress={() => participate(item)}>{isjoined ? "Participated" : "participate"}</Button>
                                        </Card.Actions>}
                                    </Card.Content>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    contentContainerStyle={{
                        paddingBottom:50,
                        paddingHorizontal:5
                    }}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={[styles.noDataContainer,{
                    backgroundColor: colors.background,

                }]}>
                    <Text style={[styles.noDataText,{
                        color: colors.text,
                    }]}>🚀 No auctions available!</Text>
                    <Text style={[styles.noDataSubText,{
                        color: colors.text,
                    }]}>Check back later for more updates.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 10,
   
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        width: widthPerWidth(90),
        marginVertical: 10,
        padding: 10,
        borderRadius: 12,
    },
    dateText: {
        marginTop: 5,
        fontSize: 12,
        color: 'gray',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    noDataText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'gray',
    },
    noDataSubText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
});

export default MyComponent;

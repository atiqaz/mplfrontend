import * as React from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View } from 'react-native';
import { SegmentedButtons, Card, Button } from 'react-native-paper';
import useAxios from '../helper/useAxios';
import { widthPerWidth } from '../helper/dimensions';
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
    const [value, setValue] = React.useState('upcoming');
    const { logout, userRole, mydetails, loggedInUser, setLoggedInUser, isLoggedIn } = useAuth();
    const { fetchData } = useAxios();
    const [allData, setAllData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

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

const participate =async(item)=>{
if(userRole=="organisation"){
    const {data,status} = await fetchData({
        url: `/api/users/participte/${loggedInUser._id}`,
        method: 'POST',
        data:{
            auctionId:item._id
        }
    })
    console.log(data)

}
}

    return (
        <SafeAreaView style={styles.container}>
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

            {/* Show Data or No Data Message */}
            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : allData.length > 0 ? (
                <FlatList
                    data={allData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Title title={item.title} />
                            <Card.Content>
                                <Text>{item.description}</Text>
                                <Text style={styles.dateText}>
                                    Auction Date: {new Date(item.auctionDate).toLocaleString()}
                                </Text>
                               {isLoggedIn &&  <Card.Actions>
                                <Button onPress={()=>participate(item)}>Participate</Button>
                                </Card.Actions>}
                            </Card.Content>
                        </Card>
                    )}
                />
            ) : (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>🚀 No auctions available!</Text>
                    <Text style={styles.noDataSubText}>Check back later for more updates.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
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

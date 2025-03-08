import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Button, Card, Chip } from 'react-native-paper'
import { router, useNavigation } from 'expo-router'


export default function yourAuctions() {

    const { isLoggedIn, loggedInUser, setLoggedInUser, useRole } = useAuth()
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#FFC107';   // Yellow
            case 'InProgress': return '#03A9F4'; // Blue
            case 'Completed': return '#4CAF50';  // Green
            default: return '#9E9E9E';           // Grey
        }
    };
    const navigation = useNavigation()

    const isPast = (incomingDate) => {
        const date = new Date()
        const incoming = new Date(incomingDate)
        if (incoming < date) {
 
            return 'Expired'
        }
       return ""
    }

    return (
        <View style={{
            paddingHorizontal: 10
        }}>
            {isLoggedIn && <>{
                loggedInUser.auctions.length ? <FlatList
                    data={loggedInUser.auctions}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => {
                        const yy = isPast(item.auctionId.auctionDate)
                        console.log(yy)
                        return (<>
                            <TouchableOpacity onPress={() => navigation.navigate(`singleAuction`, {
                                auctionId: item.auctionId._id
                            })}>
                                <Card style={{ marginVertical: 5 }}>
                                   <View style={{flexDirection:"row", alignSelf:"flex-end"}}>
                                   {!yy ? <> <Chip textStyle={{
                                        fontSize: 12,
                                        textAlign: "center",
                                        color: 'white'


                                    }} style={[styles.statusBadge, { backgroundColor: getStatusColor(item.auctionId.status) }]}>
                                        {item.auctionId.status}
                                    </Chip>
                                     </> :  <Chip textStyle={{
                                        fontSize: 12,
                                        textAlign: "center",
                                        color: 'white'


                                    }} style={[styles.statusBadge, { backgroundColor:'red'}]}>
                                        {yy}
                                    </Chip>}
                                  
                                   </View>
                                    <Card.Title title={item.auctionId.title} subtitle={item.auctionId.description} />
                                    <Card.Content>
                                        <Text variant="titleLarge">{new Date(item.auctionId.auctionDate).toLocaleString()}</Text>

                                    </Card.Content>

                                </Card>
                            </TouchableOpacity>

                        </>)
                    }}
                /> : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Button mode="contained"
                        color="#ff6600"
                        style={{
                            marginTop: 20,
                            // width: widthPerWidth(70),
                            alignSelf: 'center',
                        }}
                        onPress={() => {
                            router.push('allAuctions')
                        }}

                    >
                        Participate New auction
                    </Button>
                </View>
            }

            </>}
        </View>
    )
}

const styles = StyleSheet.create({
    statusBadge: {
        width: 'auto',
        alignSelf: "flex-end",
        marginRight: 15,
        marginTop: 10,
        borderRadius: 50,
        textAlign: "center"
    }
})
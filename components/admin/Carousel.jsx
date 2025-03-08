import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { widthPerWidth } from '../../helper/dimensions'
import { Button, Card } from 'react-native-paper'
import { router } from 'expo-router'

export default function Carousel() {
    const [data, setData] = useState([
        // { name: "fsdf", image: { uri: "https://cricfit.com/wp-content/uploads/2023/05/img_192351_viratkohli.jpg" } },
        { name: "auction", image: require('../../assets/auction banner.png') },
        { name: "player register", image: require('../../assets/player-rgister.png'), link: "playerRegistration" },
        { name: "team register", image: require('../../assets/join as team.png'), link: "userRegister" }
    ])
    const flatListRef = useRef()
    const [currentIndex, setCurrentIndex] = useState(0)

    const gotoNext = () => {
        if (flatListRef.current) {
            setCurrentIndex(prevIndex => {
                const newIndex = prevIndex < data.length - 1 ? prevIndex + 1 : 0;
                flatListRef?.current?.scrollToIndex({
                    animated: true,
                    index: newIndex
                });
                return newIndex;
            });

        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            gotoNext()
        }, 3000)

        return () => {
            clearInterval(interval)
        }

    }, [])

    const onScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const activeIndex = Math.floor(scrollPosition / widthPerWidth(93));
        setCurrentIndex(activeIndex)
    }
    return (
        <View style={{

            width: widthPerWidth(95),
            // marginLeft:0
            padding: 0,
            overflow: "hidden"
        }}>
            <Text></Text>
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={({ item }) => <Item item={item} currentIndex={currentIndex} />}
                keyExtractor={item => item.name}
                horizontal
                scrollEnabled
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
            />
            {/* <Button onPress={gotoNext} mode='contained'>Next</Button> */}
        </View>
    )
}

const Item = ({ item, currentIndex }) => {

    return (
        <TouchableOpacity disabled={!item.link} onPress={() => router.push(item.link)}>
            <Card style={{
                width: widthPerWidth(95),
                height: 200,
                // backgroundColor: "white",
                borderRadius: 10,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden"

            }}
                elevation={1}
                mode='contained'
            >
                <Image
                    source={item.image}
                    style={{
                        width: widthPerWidth(95),
                        height: 200
                    }}
                />
                <Text>{currentIndex + 1}</Text>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})
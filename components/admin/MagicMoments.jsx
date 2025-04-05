import React, { useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { useTheme } from "../../hooks/useTheme";

const { width } = Dimensions.get("window");

const data = [
    {
        header: "Most Expensive Player",
        name: "John Doe",
        amount: "2M",
        team: "Team Warriors",
        auctionDate: "20-03-2025",
        details: "Sold for a record price in the 2025 auction.",
    },
    {
        header: "Fastest Fifty",
        name: "Michael Smith",
        balls: "17",
        match: "Titans vs Strikers",
        date: "15-03-2025",
        details: "Scored the fastest 50 in just 17 balls.",
    },
    {
        header: "Most Hat-tricks",
        name: "Chris Taylor",
        hatTricks: "5",
        team: "Team Falcons",
        careerSpan: "2018-2025",
        details: "Achieved the most hat-tricks in league history.",
    },
];

export default function MagicMoments() {
    const scrollRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                x: direction === "left" ? 0 : width,
                animated: true,
            });
        }
    };


    const {colors} = useTheme()

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            // paddingTop: 40,
        },
        navContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: width * 0.85,
            marginBottom: 10,
        },
        navButton: {
            fontSize: 25,
            color: "#333",
            padding: 10,
        },
        card: {
            width: width * 0.85,
            // backgroundColor: "#f9f9f9",
            borderRadius: 12,
            padding: 20,
            marginHorizontal: 10,
            // elevation: 1,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            marginBottom: 5
        },
        header: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#1a202c",
            marginBottom: 10,
            textAlign: "center",
        },
        details: {
            fontSize: 16,
            color:colors.text,
            marginVertical: 2,
            textAlign: "center",
        },
        description: {
            fontSize: 14,
            color: colors.overlay(0.7),
            marginTop: 10,
            textAlign: "center",
            fontStyle: "italic",
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.navContainer}>
                <TouchableOpacity onPress={() => handleScroll("left")}>
                    <Entypo name="arrow-with-circle-left" size={24} color={colors.text}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleScroll("right")}>
                    <Entypo name="arrow-with-circle-right" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <Animated.ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {data.map((item, index) => (
                    <View key={index} style={[styles.card,{
                        backgroundColor:colors.overlay(0.1),
                    }]}>
                        <Text style={[styles.header,{
                            color:colors.text
                        }]}>{item.header}</Text>
                        <Text style={[styles.details,{
                            color:colors.text
                        }]}>🏆 {item.name}</Text>

                        {item.amount && (
                            <Text style={styles.details}>💰 Price: {item.amount}</Text>
                        )}
                        {item.team && <Text style={styles.details}>🎯 Team: {item.team}</Text>}
                        {item.auctionDate && (
                            <Text style={styles.details}>📅 Auction: {item.auctionDate}</Text>
                        )}

                        {item.balls && (
                            <Text style={styles.details}>⚡ Fastest Fifty: {item.balls} balls</Text>
                        )}
                        {item.match && <Text style={styles.details}>🏏 Match: {item.match}</Text>}
                        {item.date && <Text style={styles.details}>📆 Date: {item.date}</Text>}

                        {item.hatTricks && (
                            <Text style={styles.details}>🎩 Hat-tricks: {item.hatTricks}</Text>
                        )}
                        {item.careerSpan && (
                            <Text style={styles.details}>⏳ Career: {item.careerSpan}</Text>
                        )}

                        <Text style={styles.description}>ℹ️ {item.details}</Text>
                    </View>
                ))}
            </Animated.ScrollView>
        </View>
    );
}



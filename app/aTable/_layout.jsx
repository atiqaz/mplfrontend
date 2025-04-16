import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Button } from 'react-native-paper';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';

export default function _layout() {

    return (
        <Drawer
            screenOptions={{
                drawerPosition: "right", // Move drawer to the right
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="index"
                options={{
                    drawerLabel: 'Auction Room',
                    title: 'Auction Room',
                }}

            />

        </Drawer>
    );
}

const CustomDrawerContent = (props) => {
    const { colors } = useTheme()
    const { logout, userDetails } = useAuth()
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={[styles.drawerContainer, {
            backgroundColor: colors.background
        }]}>
            {/* Profile Drawer Item */}

            <DrawerItem
                label="Auction Room"
                onPress={() => props.navigation.navigate("index")}
                labelStyle={styles.drawerItemText}
                icon={() => <EvilIcons name="user" size={30} color="white" />}
                style={styles.drawerItem}
            />

        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,


    },
    logoutContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    drawerItemText: {

        color: 'white',
    },
    drawerItem: {
        backgroundColor: "#6A4FAA",
        marginHorizontal: 5,
        marginVertical: 5,
        justifyContent: "center",

    }

});

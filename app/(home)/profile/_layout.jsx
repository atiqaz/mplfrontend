import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Button } from 'react-native-paper';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';

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
                    drawerLabel: 'Profile',
                    title: 'Profile',
                }}

            />
            <Drawer.Screen
                name="yourAuctions"
                options={{
                    drawerLabel: 'Your Auctions',
                    title: 'Your Participations',
                }}
            />
        </Drawer>
    );
}

const CustomDrawerContent = (props) => {
    const { logout } = useAuth()
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
            {/* Profile Drawer Item */}
            <DrawerItem
                label="Profile"
                onPress={() => props.navigation.navigate("index")}
                labelStyle={styles.drawerItemText}
                icon={() => <EvilIcons name="user" size={30} color="white" />}
                style={styles.drawerItem}
            />

            {/* Your Auctions Drawer Item */}
            <DrawerItem
                label="Your Auctions"
                onPress={() => props.navigation.navigate("yourAuctions")}
                labelStyle={styles.drawerItemText}
                style={styles.drawerItem}
                icon={() => <MaterialIcons name="table-restaurant" size={24} color="white" />}
            />



            {/* Logout Button */}
            <View style={styles.logoutContainer}>
                <Button mode='contained' onPress={() => logout()}>
                    Logout
                </Button>
            </View>
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

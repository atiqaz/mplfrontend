import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Avatar, Button } from 'react-native-paper';
import { DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { router } from 'expo-router';
import { useTheme } from '../../../hooks/useTheme';


export default function HomeDrawer() {

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
                    drawerLabel: 'Home',
                    title: 'Home',
                }}

            />
        </Drawer>
    );
}

const CustomDrawerContent = (props) => {
    const { logout } = useAuth()
    const {colors}=useTheme()
    const closAndNavigate = (url) => {
        router.push(url)
        props.navigation.closeDrawer()
    }
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={[styles.drawerContainer,{
            backgroundColor:colors.background
        }]}>

            <DrawerItem
                label="Home"
                onPress={() => props.navigation.navigate("index")}
                labelStyle={styles.drawerItemText}
                icon={() => <AntDesign name="home" size={24} color="white" />}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Teams"
                onPress={() => closAndNavigate("teams")}
                labelStyle={styles.drawerItemText}
                icon={() => <Avatar.Image
                    source={require('../../../assets/team-building.png')}
                    size={25}
                />}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Players"
                onPress={() => closAndNavigate("players")}
                labelStyle={styles.drawerItemText}
                icon={() => <Avatar.Image
                    source={require('../../../assets/player.png')}
                    size={25}
                />}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Auctions"
                onPress={() => closAndNavigate("allAuctions")}
                labelStyle={styles.drawerItemText}
                icon={() => <Avatar.Image
                    source={require('../../../assets/auction.png')}
                    size={25}
                />}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="® Register As Player"
                onPress={() => closAndNavigate("playerRegistration")}
                labelStyle={styles.drawerItemText}
                icon={() => <Avatar.Image
                    source={require('../../../assets/player.png')}
                    size={25}
                />}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="® Register As Team"
                onPress={() => closAndNavigate("userRegister")}
                labelStyle={styles.drawerItemText}
                icon={() => <Avatar.Image
                    source={require('../../../assets/team-building.png')}
                    size={25}
                />}
                style={styles.drawerItem}
            />
            {/* Logout Button */}
            <View style={styles.logoutContainer}>
                <Button mode='contained' icon={()=><AntDesign name="login" size={18} color="white" />} onPress={() => {
                    props.navigation.closeDrawer()
                    router.push('auth')
                }}>
                    Login
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

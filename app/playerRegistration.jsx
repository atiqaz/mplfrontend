import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, RadioButton, Divider, ActivityIndicator, Avatar } from 'react-native-paper';
import { heightPerHeight } from '../helper/dimensions'; // Replace with your dimension helper or remove
import useAxios from '../helper/useAxios';
import { showToast } from '../helper/toasts';
import { Dropdown } from 'react-native-paper-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../hooks/useTheme';


export default function PlayerRegistration() {
    const { colors } = useTheme()

    const initialFormData = {
        name: '',
        age: '',
        phone: '',
        email: '',
        password: '',
        image: '', // Will hold the image URL
        playerRole: '', // 'Batsman', 'Bowler', 'Allrounder'
        battingDetails: {
            handedness: '', // 'Right-hand' or 'Left-hand'
            battingOrder: '', // 'Top Order', 'Middle Order', etc.
        },
        isWicketkeeper: '', // Boolean value
        bowlingDetails: {
            bowlingStyle: '', // 'Right Arm Fast', 'Left Arm Spinner', etc.
        },
        basePrice: 1000, // Default base price

    };

    const [formData, setFormData] = useState(initialFormData);

    const [showpassword, setShowPassword] = useState(false)

    const [basePrice, setBasePrice] = useState(1000)
    const [RunningAuction, setRunningAuction] = useState('')
    const { fetchData, error, loading } = useAxios();
    const [image, setImage] = useState('')



    useEffect(() => {
        if (error) {
            console.log(error)
            showToast(error);
        }
    }, [error]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleNestedChange = (key, subKey, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [subKey]: value,
            },
        }));
    };

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: .3,
        });

        if (!result.canceled) {
            console.log(result);
            const imag = result.assets[0].uri
            setImage(imag);
        } else {
            alert('You did not select any image.');
        }
    };

    const handleSubmit = async () => {


        const payload = { ...formData, auctionId: RunningAuction }
        const { data, message, status } = await fetchData({
            url: '/api/players',
            method: 'post',
            data: payload,
        });
        // console.log(data)

        if (status) {
            showToast(message);
            setFormData(initialFormData)
            setBasePrice(1000)
            if (image) {
                const formData = new FormData()
                formData.append('subFolder', 'player');
                formData.append('file', {
                    uri: image,
                    type: "image/jpg" || 'image/jpeg',
                    name: `avatar${Date.now()}.${image.split('.').pop()}`,
                    filename: `avatar ${Date.now()}.${image.split('.').pop()}`,
                })
                console.log('here')
                const res = await fetchData({
                    url: `/api/players/player/${data._id}`,
                    method: 'patch',
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        key: '5TIvw5cpc0'
                    }
                });
                if (res.status) {
                    setImage('')
                }

            }

        }
    };


    const styles = StyleSheet.create({
        container: {
            padding: 20,
            flexGrow: 1,
            paddingTop: heightPerHeight(10),
            backgroundColor: colors.background
        },
        header: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color:colors.text
        },
        input: {
            marginBottom: 15,
        },
        sectionHeader: {
            fontSize: 14,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 10,
            color:colors.text
        },
        divider: {
            marginVertical: 10,
        },
        submitButton: {
            marginTop: 20,
        },
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Player Registration </Text>
            <TouchableOpacity style={{
                alignSelf: "center",
                marginBottom: 20
            }}
                onPress={pickImageAsync}
            >
                <Avatar.Image size={100} source={{
                    uri: image || 'https://img.freepik.com/premium-vector/influencer-icon-vector-image-can-be-used-digital-nomad_120816-263441.jpg?w=740',
                }}

                // onPress={()=>console.log('pressed')}

                />
            </TouchableOpacity>

            {/* Name */}
            <TextInput
                label="Name"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                mode="outlined"
                style={styles.input}
            />

            {/* Age */}
            <TextInput
                label="Age"
                value={formData.age}
                onChangeText={(value) => handleChange('age', value)}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
            />

            {/* Phone */}
            <TextInput
                label="Phone"
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
            />

            {/* Email */}
            <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                label="Password"
                secureTextEntry={!showpassword}
                value={formData.password}
                mode='outlined'
                onChangeText={(value) => handleChange('password', value)}
                right={<TextInput.Icon icon="eye" onPress={() => setShowPassword((pre) => !pre)} />}
            />

            {/* Player Type */}
            <Text style={styles.sectionHeader}>Player Roles</Text>

            <Dropdown
                label="Player Role ?"
                options={[
                    { label: "Batsman", value: 'Batsman' },
                    { label: "Bowler", value: 'Bowler' },
                    { label: "Allrounder", value: 'Allrounder' }
                ]}
                value={formData.playerRole}
                onSelect={(value) => handleChange('playerRole', value)}
                mode='outlined'
            />


            <>
                <Divider style={styles.divider} />
                <Text style={styles.sectionHeader}>Batter Details</Text>
                <Dropdown
                    mode='outlined'
                    label="Batting Handendness"
                    options={[
                        { label: "Right Hand", value: 'Right-hand' },
                        { label: "Left Hand", value: 'Left-hand' }
                    ]}
                    value={formData.battingDetails.handedness}
                    onSelect={(value) => handleNestedChange('battingDetails', 'handedness', value)}
                />
                <Text style={styles.sectionHeader}>Is Wicketkeeper ?</Text>
                <Dropdown
                    mode='outlined'
                    label="IsWicketkeeper"
                    options={[
                        { label: "Yes", value: 'yes' },
                        { label: "No", value: 'no' }
                    ]}
                    value={formData.isWicketkeeper}
                    onSelect={(value) => setFormData((pre) => ({ ...pre, isWicketkeeper: value }))}
                />
                <Text style={styles.sectionHeader}>Preferred Batting Order ?</Text>
                <Dropdown
                    mode='outlined'
                    label="Preferred Batting Order ?"
                    options={[
                        { label: "Middle Order", value: 'Middle Order' },
                        { label: "Top Order", value: 'Top Order' }
                    ]}
                    value={formData.battingDetails.battingOrder}
                    onSelect={(value) => handleNestedChange('battingDetails', 'battingOrder', value)}
                />

                <Text style={styles.sectionHeader}>Preferred Bowling Style ?</Text>
                <Dropdown
                    mode='outlined'
                    label="Preferred Bowling Style"
                    options={[
                        { label: "Right Arm Fast", value: 'Right Arm Fast' },
                        { label: "Right Arm Medium", value: 'Right Arm Medium' },
                        { label: "Left Arm Fast", value: 'Left Arm Fast' },
                        { label: "Left Arm Medium", value: 'Left Arm Medium' },
                        { label: "Left Arm Spinner", value: 'Left Arm Spinner' },
                        { label: "Right Arm Spinner", value: 'Right Arm Spinner' },
                    ]}
                    value={formData.bowlingDetails.bowlingStyle}
                    onSelect={(value) => handleNestedChange('bowlingDetails', 'bowlingStyle', value)}
                />
            </>


            {/* Image URL */}
            {/* <Divider style={styles.divider} />
            <Dropdown
                label="Base Price"
                placeholder="Select Base Price"
                options={OPTIONS}
                value={basePrice}
                onSelect={setBasePrice}
            />

            <Divider style={styles.divider} />
            <Dropdown
                label="Auction Lists"
                placeholder="Select Auction List"
                options={auctionData}
                value={RunningAuction}
                onSelect={setRunningAuction}

            /> */}

            {/* Submit Button */}
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                {loading ? <ActivityIndicator color="#fff" /> : 'Submit'}


            </Button>
        </ScrollView>
    );
}



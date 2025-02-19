import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Snackbar, ActivityIndicator, Avatar } from 'react-native-paper';
import useAxios from '../helper/useAxios';
import { router } from 'expo-router';
import { Dropdown } from 'react-native-paper-dropdown';
import * as ImagePicker from 'expo-image-picker';

const UserForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [auctionData, setAuctionData] = useState([])
  const [RunningAuction, setRunningAuction] = useState('')
  const [image,setImage]=useState('')
  const { fetchData, data, loading } = useAxios();



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
    if (!name || !phone || !email || !password ) {
      setMessage('Please fill in all the required fields');
      setIsError(true);
      setVisible(true);
      return;
    }

    const userData = {
      name,
      phone,
      email,
      imageUrl,
      password,
      role: 'organisation',
      auctionId: RunningAuction
    };

    console.log(userData)
    try {
      const res = await fetchData({
        url: '/api/users',
        method: 'post',
        data: userData,
      });

      if (res?.status) {
        setMessage(res.message || 'User created successfully!');
        setIsError(false);
        setVisible(true);
        // Optionally clear the form after success
        setName('');
        setPhone('');
        setEmail('');
        setImageUrl('');
        setPassword('');
        if (image) {
          const formData = new FormData()
          formData.append('subFolder', 'team');
          formData.append('file', {
              uri: image,
              type: "image/jpg" || 'image/jpeg',
              name: `avatar${Date.now()}.${image.split('.').pop()}`,
              filename: `avatar ${Date.now()}.${image.split('.').pop()}`,
          })
          console.log('here')
          const {data,status} = await fetchData({
              url: `/api/users/imageupload/${res.data._id}`,
              method: 'patch',
              data: formData,
              headers: {
                  'Content-Type': 'multipart/form-data',
                  key: '5TIvw5cpc0'
              }
          });
          console.log(
            data
          )
          if (status) {
              setImage('')
          }
        }
        
        // setTimeout(() => {
        //   router.back();
        // }, 1000);
      } else {
        throw new Error(res?.message || 'Failed to create user');
      }
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
      setVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Registration</Text>
<TouchableOpacity style={{
                alignSelf: "center",
                marginBottom: 20
            }}
            onPress={pickImageAsync}
            >
                <Avatar.Image size={100} source={{
                    uri:image||'https://img.freepik.com/premium-vector/influencer-icon-vector-image-can-be-used-digital-nomad_120816-263441.jpg?w=740',
                }} 

// onPress={()=>console.log('pressed')}

                />
            </TouchableOpacity>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
     
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={{ backgroundColor: isError ? 'red' : 'green' }}
      >
        {message}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    // marginTop: 50,
    justifyContent:"center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default UserForm;

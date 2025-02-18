import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, ToastAndroid } from 'react-native';
import { Button, IconButton, Paragraph } from 'react-native-paper';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPerHeight, widthPerWidth } from '../helper/dimensions';
import { Dropdown } from 'react-native-paper-dropdown';
import { useData } from '../context/useData';

import Toast from 'react-native-toast-message';
import { getUserDetails } from '../helper/Storage';
import { useAuth } from '../context/AuthContext';
import useAxios from '../helper/useAxios';
import { useSocket } from '../context/socketContext';
import RefreshLayout from '../helper/RefreshLayout';
import { useSnackbar } from '../context/useSnackBar';

const NoStartedPage = ({ role, startAuction,setStarted,selectedInternalAuction, setselectedInternalAuction }) => {
  const { selectedAuction, setSelectedAuction, auctionData } = useData()
  const [auctionList,setAuctionList]=useState([])
  console.log('NoStartedPage')
  const [selectOne, setselectOne] = useState('')
  const user = getUserDetails()
  const { socket } = useSocket();
  const {fetchData}=useAxios()
  const {mydetails, userRole, loggedInUser}=useAuth()
  const {showSnackbar}=useSnackbar()
  // console.log(auctionData)

  useEffect(()=>{
    if(userRole==="organisation"){

      const auctionId = JSON.parse(mydetails).auctionId
    
      const filteredData= auctionData.filter((x)=>x.value===auctionId)
      setAuctionList(filteredData)

    }else{
      setAuctionList(auctionData)
    }
  },[mydetails, userRole])
  const joinRoom = async() => {
    if (!selectOne) {
      showSnackbar('Please Select Auction','error')
      return 0;
    }
    const {data,status} = await fetchData({
      url: `api/auction/singleAuction/${selectOne}`,
      method: 'GET',
    
    })
    console.log(data)
    if(status){
      console.log(status)
   
      socket.emit("join:room", {
        auctionId: selectOne,
        username: loggedInUser?.name ||"test",
        userId: loggedInUser?._id,
        
      })
      console.log(data)
      setselectedInternalAuction(data)
      setStarted(true)
    }
   
  }

  const refresh =()=>{

  }
  return (
    <RefreshLayout refreshFunction={joinRoom}>
      <View style={styles.container}>
      {/* Empty State Illustration */}
      <View style={styles.iconContainer}>
        <AntDesign name="infocirlce" size={60} color="orange" />
        {/* Optional: Custom Illustration can be added */}
      </View>

      {/* Main Text */}
      <Text style={styles.title}>Auction Not Started Yet</Text>
      <Text style={[styles.title, {
        fontSize: 16
      }]}>Select Auction </Text>
      <View style={{
        width: "100%"
      }}>
        <Dropdown
          label="Select Events"
          placeholder="Select Events"
          options={auctionList || []}
          value={selectOne}
          onSelect={(data) => {
            console.log(data)
            setselectOne(data)
          }}
        />
      </View>
      <Button style={{
        width: "90%",
        marginTop: 20
      }} mode="contained" onPress={() => joinRoom()}>
        Go Live for Auction
      </Button>



      {/* Optional Retry or Help Icon */}
      <IconButton
        icon="help-circle"
        size={30}
        onPress={() => alert('Need help?')}
        style={styles.helpIcon}
      />
    </View>
    </RefreshLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    height: heightPerHeight(95),
    width: widthPerWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,

  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3f51b5',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  helpIcon: {
    marginTop: 20,
  },
});

export default NoStartedPage;

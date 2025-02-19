import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Platform, SafeAreaView, ScrollView } from 'react-native';
import Dashboard from '../../components/Dashboard';
import { useAuth } from '../../context/AuthContext';
import useAxios, { baseUrl } from '../../helper/useAxios';
import { AnimatedFAB, Appbar, Avatar, Button, Card, Menu, SegmentedButtons, TextInput } from 'react-native-paper';
import { getUserDetails } from '../../helper/Storage';
import { useSocket } from '../../context/socketContext';
import { Dropdown } from 'react-native-paper-dropdown';
import { useData } from '../../context/useData';
import { heightPerHeight, widthPerWidth } from '../../helper/dimensions';
import { router } from 'expo-router';
import PullToRefreshLayout from '../../components/layout/PullToRefreshLayout';
import { useSnackbar } from '../../context/useSnackBar';
import { Drawer } from 'react-native-paper';
import HomePage from '../../components/HomePage';
import CreateAuctionModal from '../../components/CreateAuctionModal';

// Import Common Layout
// import PullToRefreshLayout from '../../components/PullToRefreshLayout';

export default function Home({ animatedValue,
  visible,
  extended,
  label,
  animateFrom,
  style,
  iconMode, }) {
  const [dashboard, setDashboard] = useState({});
  const { fetchData } = useAxios();
  const { logout, userRole, mydetails, loggedInUser, setLoggedInUser, isLoggedIn } = useAuth();
  const { socket, isConnected } = useSocket();
  const { selectedAuction, setSelectedAuction, auctionData, auctionDetaileddata } = useData();
  const { started, setStarted,
    selectedInternalAuction, setselectedInternalAuction } = useData()
  const [liveAuction, setLiveAuction] = useState([])
  const [myAuctionList, setMyAuctionList] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const { showSnackbar } = useSnackbar()
  // -----------------------search------------------------------
  const [isSearching, setIsSearching] = useState(false)


  useEffect(() => {
    const _filtered = auctionDetaileddata.filter((data) => data.status === "InProgress")
    setLiveAuction(_filtered)
  }, [auctionDetaileddata])

  // Fetch dashboard data
  const getAllData = async () => {
    if (!selectedAuction) return;

    const { status, data } = await fetchData({ url: `/api/dashboard?auctionId=${selectedAuction}`, method: 'GET' });

    if (status) setDashboard(data || {});
  };

  useEffect(() => {
    getAllData();
  }, [selectedAuction]);

  useEffect(() => {
    if (userRole === 'organisation' && mydetails) {
      const auctionId = JSON.parse(mydetails)?.auctionId;
      setMyAuctionList(auctionData.filter((x) => x.value === auctionId));
    }
    if (userRole === 'admin') setMyAuctionList(auctionData);
  }, [userRole, mydetails, auctionData]);

  useEffect(() => {

    if (socket && isConnected && loggedInUser) {
      showSnackbar(`${loggedInUser.name || ""} connected`, 'success')
      if (isLoggedIn) {

        socket.emit('go:online', { ...loggedInUser, socketId: socket.id });
      }
    } else {
      showSnackbar('Error in connecting ', 'error')

    }
  }, [socket, isConnected, loggedInUser, isLoggedIn]);

  const enterInRoom = (item) => {
    setStarted(true)
    setselectedInternalAuction(item)
    const payload = {
      auctionId: item._id,
      username: loggedInUser?.name || "test",
      userId: loggedInUser?._id,

    }
    console.log({ payload })
    socket.emit("join:room", payload)
    // Add your code to enter into the room
    // router.push(`auctionTable?auctiond=${id}`)
    router.push({ pathname: 'auctionTable', params: { auctionId: item._id } })
  }

  const [searchQuery, setSearchQuery] = useState('')
  const handleSearch = (text) => {
    setIsSearching(true)
    setSearchQuery(text)
  }
  const _toggleSearch = () => {
    setIsSearching(!isSearching);
    setSearchQuery('');
  };

  // ---------------------Fab-------------------
  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };
  const fabStyle = { [animateFrom]: 16 };
  // --------------------FAB End--------------------

  // -----------------Modal for Create Auction------------------
  const [modalVisible, setModalVisible] = useState(false);


  //  -----------------segmented buttons------------------
  const [value, setValue] = React.useState('');

  // -------------------------data-------------------

  return (

    <ScrollView contentContainerStyle={{
      flexGrow: 1,
      backgroundColor: 'white',
      padding: 10,
      paddingBottom: 0,
    }}>
      <Appbar.Header mode="center-aligned" elevated={false} style={{ marginLeft: 10 }}>
        {isSearching ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Search players"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        ) : (
          <Appbar.Content
            title={isLoggedIn ? `Hi!  ${loggedInUser.name}` : 'Search'.toUpperCase()}
            titleStyle={{ fontSize: 15, fontWeight: 'bold' }}
          />
        )}
        <Appbar.Action
          icon={isSearching ? 'close' : 'magnify'}
          onPress={_toggleSearch}
        />

        <TouchableOpacity >
          {isLoggedIn ? <Avatar.Image style={styles.avatar(isConnected)} size={40} source={{ uri: loggedInUser?.avatar || "https://via.placeholder.com/150" }} /> :
            <Button mode="contained" color="#ff6600" onPress={logout}>Login</Button>}
        </TouchableOpacity>
        {isLoggedIn && <Appbar.Action
          icon={'logout'}
          onPress={logout}
        />}

      </Appbar.Header>
      <>
        {
          isSearching ? <HomePage
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            _toggleSearch={_toggleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          /> : <View >
            {userRole == "admin" && <> <AnimatedFAB
              icon={'plus'}
              label={'Create Auction'}
              extended={isExtended}
              onPress={() => setModalVisible(true)}
              visible={visible}
              animateFrom={'right'}
              iconMode={'dynamic'}
              style={[styles.fabStyle, style, fabStyle]}
            />
              {modalVisible && <CreateAuctionModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
              />}</>}


            {/* -----------------------Segmented Buttons---------------------------- */}
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              marginTop: 20,
              marginLeft: 15,
            }}>Auctions</Text>

            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                {
                  value: 'live',
                  label: '🟢 Live',

                },
                {
                  value: 'upcoming',
                  label: 'Upcoming',
                },
                { value: 'finished', label: 'Finished' },
              ]}
            />
            {/* ------------------------------------------ your Auctions--------------------- */}
            <Text>{JSON.stringify(loggedInUser)}</Text>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              marginTop: 20,
              marginLeft: 15,
            }}>Your Auctions</Text>

            {userRole === "organisation" && <>
              {loggedInUser?.auctions.length ? <>

              </> : <>
                <Text style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  textAlign: "center", color: 'orange'
                }}> You have Not Participated</Text>
                <Button
                  mode="contained"
                
                  style={{
                    marginTop: 20,
                    width: widthPerWidth(70),
                    alignSelf: 'center',
                    
                  }}
                  onPress={() => {
                    router.push('allAuctions')
                  }}
                >
                  Participate
                </Button>
              </>}
            </>}




          </View>
        }</>
    </ScrollView>


  );
}

const styles = StyleSheet.create({
  appbar: { justifyContent: 'space-between', paddingLeft: 20 },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    marginRight: 10,
  },
  dropdownContainer: { width: widthPerWidth(65), marginRight: 15 },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10
  },
  avatar: (isConnected) => ({
    marginRight: 10,
    borderWidth: 3,
    borderColor: isConnected ? 'green' : 'red',
  }),
  logoutIcon: { fontSize: 25 },
  auctionLists: {
    marginHorizontal: 10,
    marginVertical: 10
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  }
});

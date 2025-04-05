import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Platform, SafeAreaView, ScrollView, Image, Linking } from 'react-native';
import Dashboard from '../../components/Dashboard';
import { useAuth } from '../../context/AuthContext';
import useAxios, { baseUrl } from '../../helper/useAxios';
import { AnimatedFAB, Appbar, Avatar, Button, Card, Divider, Menu, SegmentedButtons, TextInput } from 'react-native-paper';
import { getUserDetails } from '../../helper/Storage';
import { useSocket } from '../../context/socketContext';
import { Dropdown } from 'react-native-paper-dropdown';
import { useData } from '../../context/useData';
import { heightPerHeight, widthPerWidth } from '../../helper/dimensions';
import { router, useNavigation } from 'expo-router';
import PullToRefreshLayout from '../../components/layout/PullToRefreshLayout';
import { useSnackbar } from '../../context/useSnackBar';
import { Drawer } from 'react-native-paper';
import HomePage from '../../components/HomePage';
import CreateAuctionModal from '../../components/CreateAuctionModal';
import AdminDashBoard from '../../components/admin/AdminDashBoard';
import RecenTSeries from '../../components/admin/RecenTSeries';
import Carousel from '../../components/admin/Carousel';
import MagicMoments from '../../components/admin/MagicMoments';
import OurPartners from '../../components/common/Ourpartners';
import { useTheme } from '../../hooks/useTheme';

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

  const {colors} = useTheme()
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
  const navigation = useNavigation()

  const openWhatsApp = () => {
    const url = `https://wa.me/${9122038950}`;
    Linking.openURL(url).catch(() => alert("Make sure WhatsApp is installed"));
  };


  return (
    <View style={{ flex: 1, height: heightPerHeight(100) }}>
      <ScrollView contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: colors.background,
        // padding: 10,
        paddingBottom: 0,
      }}>


        {isLoggedIn && <Appbar.Header mode="small" elevated={false} style={{ marginLeft: 10 }}>
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
              title={isLoggedIn ? `Hi!  ${loggedInUser.name}` : 'Search Player..'.toUpperCase()}
              titleStyle={{ fontSize: 15, fontWeight: 'bold' }}
            />
          )}
          <Appbar.Action
            icon={isSearching ? 'close' : 'magnify'}
            onPress={_toggleSearch}
          />

          <TouchableOpacity >
            {isLoggedIn ? <Avatar.Image style={styles.avatar(isConnected)} size={40} source={{ uri: loggedInUser?.avatar || "https://via.placeholder.com/150" }} /> :
              <Button mode="contained" color="#ff6600" onPress={() => router.push('auth')}>Login</Button>}
          </TouchableOpacity>
          {isLoggedIn && <Appbar.Action
            icon={'logout'}
            onPress={logout}
          />}

        </Appbar.Header>}

        <>
          {
            isSearching ? <HomePage
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              _toggleSearch={_toggleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            /> : <View >
              {userRole == "admin" && <>
                <AdminDashBoard />
                <AnimatedFAB
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




              {/* ------------------------------------------ your Auctions--------------------- */}
              {/* <Text>{JSON.stringify(loggedInUser)}</Text> */}


              {(userRole === "organisation" || userRole === "player") && <>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  marginTop: 20,
                  marginLeft: 15,
                }}>Your Auctions </Text>
                {loggedInUser?.auctions.length ? <>
                  <FlatList
                    data={loggedInUser?.auctions}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => navigation.navigate(`singleAuction`, {
                        auctionId: item?.auctionId._id
                      })}>
                        <Card style={styles.auctionLists}>
                          {/* <Text>{JSON.stringify(item)}</Text> */}
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                            <Card.Title style={{ fontWeight: "800" }} title={item?.auctionId?.title} />
                            <Image
                              source={require('../../assets/liveAuction.gif')}
                              style={{
                                width: 60,
                                height: 30,
                                borderRadius: 10,
                                marginBottom: 10,
                                // scaleX: .5,
                              }}
                              fadeDuration={1000}
                              resizeMode="contain"
                            // onLoadStart={() => console.log('Load start')}
                            />
                          </View>
                          <Card.Content>

                            <Text style={styles.dateText}>
                              Auction Date: {new Date(item.auctionId.auctionDate).toLocaleString()}
                            </Text>

                          </Card.Content>
                        </Card>
                      </TouchableOpacity>
                    )}
                    ListFooterComponent={() => <TouchableOpacity style={{

                    }}>
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
                    </TouchableOpacity>}
                  />

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
              {!isLoggedIn && <View>
                <Carousel />
                <Divider></Divider>
                <View>
                  <Text style={{
                    marginVertical: 15, fontSize: 18, fontWeight: "600", textAlign: "center", opacity: .8, color:colors.text
                  }} >What are you looking for  ?</Text>
                  <View>
                    <FlatList
                      data={[
                        {
                          value: "team",
                          label: "Teams",
                          link: "teams"
                        }, {
                          value: "player",
                          label: "Players",
                          link: "players"
                        }, {
                          value: "auction",
                          label: "Auctions",
                          link: "allAuctions"
                        },
                      ]}
                      keyExtractor={item => item.label}
                      horizontal
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity style={{
                            width: widthPerWidth(30),
                            marginLeft: widthPerWidth(1.5)
                          }}
                            onPress={() => router.push(item.link)}
                          >
                            <Button mode="contained" >
                              {item.label}
                            </Button>
                          </TouchableOpacity>
                        )
                      }}
                      contentContainerStyle={{
                        width: widthPerWidth(95),
                        margin: "auto"
                      }}

                    />
                  </View>
                </View>

                <View style={{
                  marginTop: 10
                }}>
                  <Text style={{
                    marginVertical: 15, fontSize: 18, fontWeight: "600", textAlign: "left", opacity: .8 ,color:colors.text
                  }} >Magic Moments</Text>
                  <MagicMoments />
                </View>
                {/* <RecenTSeries/> */}

              </View>}



            </View>
          }</>
        <View style={styles.partners}>

          <OurPartners />
        </View>


        {/* ------------------whatsapp-------------------------------- */}

      </ScrollView>
      {
        userRole !== 'admin' && <TouchableOpacity style={{
          position: "absolute",
          top: heightPerHeight(isLoggedIn ? 90 : 85),
          right: 10

        }} onPress={openWhatsApp}>
          <Avatar.Image
            source={{
              uri: "https://img.icons8.com/color/48/whatsapp--v1.png"
            }}
            size={50}
          />
        </TouchableOpacity>
      }

    </View>


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
    zIndex: 15
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
  },
  auctionLists: {
    marginHorizontal: 10,
    marginVertical: 10,
    // width: widthPerWidth(),
  },
  fabStyle: {
    top: heightPerHeight(75),
    right: 16,
    position: 'absolute',
    zIndex: 11
    // backgroundColor: 'blue',
    // opacity: 0.5,
    // transform: [{ translateX: 100 }]
  },
  whoLooking: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 15,
    textAlign: "center"
  },
  all: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"

  },
  oneCard: {
    width: '48%'
  },
  partners: {

  }
});

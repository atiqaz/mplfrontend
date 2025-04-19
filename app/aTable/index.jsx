import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useIsFocused } from '@react-navigation/core'
import { Avatar, Card, Text, useTheme as usePaperTheme, Button, Divider, Icon, Badge, Chip } from 'react-native-paper'
import useAxios from '../../helper/useAxios'
import { useSocket } from '../../context/socketContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import { useSnackbar } from '../../context/useSnackBar'

// Configuration constants
const BID_INCREMENT = 1500; // Set your desired bid increment amount here
const START_BID = 1000
const currentPlayer = {
  name: "Virat Kohli",
  age: 34,
  email: "virat@kohli.com",
  phone: "6378493751",
  password: "12345678",
  image: "",
  playerRole: "Batsman",
  battingDetails: {
    handedness: "Right-hand",
    battingOrder: "Middle Order"
  },
  isWicketkeeper: false,
  bowlingDetails: {
    bowlingStyle: "Right Arm Spinner"
  },
  basePrice: 1000
}

export default function AuctionScreen() {
  const { AuctionId } = useLocalSearchParams()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { fetchData } = useAxios()
  const { socket } = useSocket()
  const { colors } = useTheme()
  const { showSnackbar } = useSnackbar()


  const paperTheme = usePaperTheme()
  const [currentPlayer, setCurrentPlayer] = useState()
  const [currentBid, setCurrentBid] = useState(null)
  const [isBidding, setIsBidding] = useState(false)
  const [purse, setPurse] = useState({
    remainingPurse: 0,
    totalPurse: 0
  })
  const [isValidTeam, setIsValidTeam] = useState(false)
  const [isOutOfRace, setIsOutOfRace] = useState(false)
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false)
  const [currentBidder, setCurrentBidder] = useState(null)
  const [singleAuction, setSingleAuction] = useState({})
  const [disableBidButton, setDisableBidButton] = useState(false)
  const [soldUnSoldStatus, setSoldUnsoldStatus] = useState(null)



  const {
    isLoggedIn, loggedInUser
  } = useAuth()

  const getAuctionData = async () => {
    try {
      const { data } = await fetchData({
        url: `/api/auction/singleAuction/details/${AuctionId}`
      })
      navigation.setOptions({ title: data.auction.title || "Auction" })
      setSingleAuction(data)

      const roomId = data?.auction?.roomId
      const payload = {
        roomId,
        userId: loggedInUser?._id,
        auctionId: AuctionId
      }

      socket.emit('JoinAuctionRoom', isLoggedIn ? payload : { roomId, auctionId: AuctionId })
    } catch (error) {
      Alert.alert("Error", "Failed to fetch auction details")
    }
  }

  const handleBid = () => {
    if (currentBid + BID_INCREMENT > purse.remainingPurse) {
      Alert.alert(
        "Insufficient Funds",
        `You need ₹${BID_INCREMENT} more to place this bid`
      );
      return;
    }

    setIsBidding(true)

    socket.emit('place:Bid', {
      roomId: singleAuction?.auction?.roomId,
      playerId: currentPlayer._id,
      bidderId: loggedInUser?._id,
      bidAmount: currentBidder ? currentBid + BID_INCREMENT : START_BID,
      bidderName: loggedInUser.name
    })
    // Simulate bid processing
    setTimeout(() => {
      setCurrentBid(currentBid + BID_INCREMENT)
      setPurse(prev => ({
        ...prev,
        remainingPurse: prev.remainingPurse - BID_INCREMENT
      }))
      setIsBidding(false)
    }, 1000)
  }

  const handleOutOfRace = () => {
    socket.emit('outOfRace', {
      roomId: singleAuction.auction.roomId,
      name: loggedInUser.name
    })
  }

  useEffect(() => {
    if (isFocused) {
      getAuctionData()
    }
  }, [AuctionId, isFocused])

  const handleCurrentBids = useCallback((data) => {
    console.log('handleCurentBids', data)
    if (data.bids.length) {
      const lastBid = data.bids[data.bids.length - 1]
      if (lastBid.bidderId === loggedInUser?._id) {
        setDisableBidButton(true)

      } else {
        setDisableBidButton(false)
      }
      setCurrentBidder({
        name: lastBid.bidderName,
        bidAmount: lastBid.bidAmount,
        nextBidAmount: lastBid.bidAmount
      })
    }
  }, [])

  const SOldUnSOld = () => {
    socket.emit('sold/unsold', {
      roomId: singleAuction.auction.roomId,
      currentPlayer: currentPlayer._id
    })
  }


  useEffect(() => {
    const onJoinSuccess = (data) => {

      socket.emit('getCurrentPlayer', {
        roomId: singleAuction?.auction?.roomId,
        auctionId: AuctionId

      })

      if (!data.totalPurse) {
        setIsValidTeam(true)
      }
      if (data.isValidTeam)
        setPurse({
          remainingPurse: data.remainingPurse,
          totalPurse: data.totalPurse
        })
      setHasJoinedRoom(true)


    }

    socket.on('outOfRace', (data) => {
      console.log('outOfRace', data)
      showSnackbar(`${data.name} is Out of Race for This Player`, 'info')
    })

    socket.on('sold/unsold', (data) => {
      console.log('sold/unsold', data)
      setSoldUnsoldStatus('Sold')

      setTimeout(()=>{
        socket.emit('getCurrentPlayer', {
          roomId: singleAuction?.auction?.roomId,
          auctionId: AuctionId
  
        })
      },3000)
    })
    socket.on('getCurrentPlayer', (data) => {
      // console.log('getCurrentPlayer', data.player)
      setCurrentPlayer(data.player)
      setSoldUnsoldStatus(null)
      if (data.player.bids.length) {
        let lastBid = data.player.bids[data.player.bids.length - 1]
        if (lastBid.bidderId === loggedInUser?._id) {
          setDisableBidButton(true)

        } else {
          setDisableBidButton(false)
        }
        setCurrentBid(lastBid.bidAmount)
        setCurrentBidder({
          name: lastBid.bidderName,
          bidAmount: lastBid.bidAmount,
          nextBidAmount: lastBid.bidAmount
        })
      } else {
        setCurrentBid(START_BID)
      }
    })
    socket.on('JoinAuctionRoom', onJoinSuccess)

    socket.on('currentBid', handleCurrentBids)


    return () => {
      socket.off('JoinAuctionRoom', onJoinSuccess)
      socket.off('getCurrentPlayer')
      socket.off('outOfRace')
      socket.off('sold/unsold')
      socket.off('currentBid', handleCurrentBids)
    }
  }, [isLoggedIn, singleAuction])


  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView>
        {/* Connection Status Indicator */}
        {hasJoinedRoom && (
          <View style={[styles.connectionStatus, { backgroundColor: colors.card }]}>
            <View style={styles.connectionStatusContent}>
              <Icon
                source="check-circle"
                size={20}
                color="#4CAF50"
              />
              <Text style={[styles.connectionStatusText, { color: colors.text }]}>
                Connected to auction room
              </Text>
            </View>
          </View>
        )}

        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Title
            title={currentPlayer?.playerId?.name}
            titleStyle={styles.playerName}
            subtitle={currentPlayer?.playerId?.playerRole}
            subtitleStyle={[styles.playerRole, { color: colors.primary }]}
            left={(props) =>
              currentPlayer?.playerId?.image ? (
                <Avatar.Image
                  {...props}
                  source={{ uri: currentPlayer?.playerId?.image }}
                  size={60}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  {...props}
                  label={currentPlayer?.playerId?.name?.charAt(0)}
                  size={60}
                  style={[styles.avatar, { backgroundColor: colors.primary }]}
                  labelStyle={styles.avatarText}
                />
              )
            }
          />

          <Divider style={[styles.divider, { backgroundColor: colors.border }]} />

          <Card.Content>
            <View style={styles.section}>
              <Text variant="titleSmall" style={[styles.sectionTitle, { color: colors.primary }]}>
                Personal Information
              </Text>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Age:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{currentPlayer?.playerId?.age}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Email:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{currentPlayer?.playerId?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Phone:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{currentPlayer?.playerId?.phone}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text variant="titleSmall" style={[styles.sectionTitle, { color: colors.primary }]}>
                Cricket Details
              </Text>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Batting Style:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {currentPlayer?.playerId?.battingDetails?.handedness}, {currentPlayer?.playerId?.battingDetails?.battingOrder}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Bowling Style:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {currentPlayer?.playerId?.bowlingDetails?.bowlingStyle}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Wicketkeeper:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {currentPlayer?.playerId?.isWicketkeeper ? "Yes" : "No"}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bidContainer}>
          <Text variant="titleLarge" style={[styles.currentBidLabel, { color: colors.text }]}>
            Current Bid:
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text variant="headlineMedium" style={[styles.currentBid, { color: colors.primary }]}>
              ₹{currentBid}
            </Text>
            <View style={{ marginLeft: 8 }}>
              {soldUnSoldStatus === 'sold' ? (
                <Chip
                  icon="check-circle"
                  style={{
                    backgroundColor: '#4CAF50', // Green for sold
                  }}
                  textStyle={{
                    color: 'white'
                  }}
                >
                  Sold
                </Chip>
              ) : soldUnSoldStatus === 'unsold' ? (
                <Chip
                  icon="close-circle"
                  style={{
                    backgroundColor: '#F44336', // Red for unsold
                  }}
                  textStyle={{
                    color: 'white'
                  }}
                >
                  Unsold
                </Chip>
              ) : (
                <Chip
                  icon="clock"
                  style={{
                    backgroundColor: '#FFC107', // Amber for pending/auction in progress
                  }}
                  textStyle={{
                    color: 'black'
                  }}
                >
                  Bidding
                </Chip>
              )}
            </View>
          </View>

          {currentBidder && (
            <Text variant="bodySmall" style={[styles.currentBid, { color: colors.primary }]}>
              {currentBidder.name}
            </Text>
          )}

          {isValidTeam && (
            <View style={styles.purseContainer}>
              <Text variant="bodyMedium" style={[styles.purseText, { color: colors.text }]}>
                Purse: ₹{purse?.remainingPurse} / ₹{purse?.totalPurse}
              </Text>
              <View style={styles.purseBarContainer}>
                <View
                  style={[
                    styles.purseBar,
                    {
                      width: `${(purse.remainingPurse / purse.totalPurse) * 100}%`,
                      backgroundColor: purse.remainingPurse >= currentBid + BID_INCREMENT ?
                        colors.primary : '#ff4444'
                    }
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {isValidTeam && (
        <View style={[styles.bidActionContainer, { backgroundColor: colors.card }]}>
          <View style={styles.actionsRow}>
            <Button
              mode="contained"
              onPress={handleBid}
              loading={isBidding}
              disabled={isBidding || currentBid + BID_INCREMENT > purse.remainingPurse || disableBidButton}
              style={[styles.bidButton, { flex: 1 }]}
              labelStyle={styles.bidButtonLabel}
              theme={{ colors: { primary: colors.primary } }}
            >
              {currentBidder ? `Place Bid (+₹ ${BID_INCREMENT})` : 'Place Bid'}
            </Button>
            <View style={styles.buttonSpacer} />
            <Button
              mode="outlined"
              onPress={handleOutOfRace}
              style={styles.outOfRaceButton}
              labelStyle={styles.outOfRaceButtonLabel}
              theme={{ colors: { primary: colors.primary } }}
            >
              Out of Race
            </Button>
          </View>
        </View>
      )}

      {<View style={[styles.bidActionContainer, { backgroundColor: colors.card }]}>
        <View style={styles.actionsRow}>
          <Button
            mode="contained"
            onPress={SOldUnSOld}
            // loading={isBidding}
            // disabled={isBidding || currentBid + BID_INCREMENT > purse.remainingPurse || disableBidButton}
            style={[styles.bidButton, { flex: 1 }]}
            labelStyle={styles.bidButtonLabel}
            theme={{ colors: { primary: colors.primary } }}
          >
            {currentBidder ? `Sold` : 'UnSold'}
          </Button>
          <View style={styles.buttonSpacer} />
          <Button
            mode="outlined"
            onPress={handleOutOfRace}
            style={styles.outOfRaceButton}
            labelStyle={styles.outOfRaceButtonLabel}
            theme={{ colors: { primary: colors.primary } }}
            icon={'information'}
          >
            last Chance
          </Button>
        </View>
      </View>}

      {!isValidTeam && (
        <View style={[styles.bidActionContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.invalidTeamText, { color: colors.text }]}>
            Your team is not valid for this auction or you don't have enough funds
          </Text>
        </View>
      )}

      {/* {isOutOfRace && (
        <View style={[styles.bidActionContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.outOfRaceText, { color: colors.text }]}>
            You're out of race for this player
          </Text>
        </View>
      )} */}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    overflow: 'hidden'
  },
  avatar: {
    marginRight: 15
  },
  avatarText: {
    fontSize: 24,
    color: 'white'
  },
  playerName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    marginLeft: 20
  },
  playerRole: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 20
  },
  divider: {
    marginHorizontal: 16,
    height: 1
  },
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  label: {
    fontWeight: '600',
  },
  value: {
    fontWeight: '400',
  },
  bidContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(98, 0, 238, 0.1)'
  },
  currentBidLabel: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  currentBid: {
    fontWeight: 'bold'
  },
  purseContainer: {
    width: '100%',
    marginTop: 16
  },
  purseText: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500'
  },
  purseBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%'
  },
  purseBar: {
    height: '100%',
    borderRadius: 4
  },
  bidActionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bidButton: {
    borderRadius: 8,
    paddingVertical: 8
  },
  bidButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  outOfRaceButton: {
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1
  },
  outOfRaceButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonSpacer: {
    width: 12
  },
  invalidTeamText: {
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: '500'
  },
  outOfRaceText: {
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: '500'
  },
  connectionStatus: {
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },
  connectionStatusContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  connectionStatusText: {
    marginLeft: 8,
    fontWeight: '500'
  }
})
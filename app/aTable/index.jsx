import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useIsFocused } from '@react-navigation/core'
import { Avatar, Card, Text, useTheme as usePaperTheme, Button, Divider, Icon } from 'react-native-paper'
import useAxios from '../../helper/useAxios'
import { useSocket } from '../../context/socketContext'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'

// Configuration constants
const BID_INCREMENT = 1500; // Set your desired bid increment amount here
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
  const paperTheme = usePaperTheme()
  const [currentBid, setCurrentBid] = useState(currentPlayer.basePrice)
  const [isBidding, setIsBidding] = useState(false)
  const [purse, setPurse] = useState({
    remainingPurse: 0, 
    totalPurse: 0
  })
  const [isValidTeam, setIsValidTeam] = useState(false)
  const [isOutOfRace, setIsOutOfRace] = useState(false)
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false)

  const {
    isLoggedIn, loggedInUser
  } = useAuth()

  const getAuctionData = async () => {
    try {
      const { data } = await fetchData({
        url: `/api/auction/singleAuction/details/${AuctionId}`
      })
      navigation.setOptions({ title: data.auction.title || "Auction" })

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
    setIsOutOfRace(true);
    Alert.alert("Out of Race", "You have opted out of bidding for this player");
  }

  useEffect(() => {
    if (isFocused) {
      getAuctionData()
    }
  }, [AuctionId, isFocused])

  useEffect(() => {
    const onJoinSuccess = (data) => {
      console.log('JoinAuctionRoom', data)
      setIsValidTeam(data.isValidTeam)
      setPurse({
        remainingPurse: data.remainingPurse,
        totalPurse: data.totalPurse
      })
      setHasJoinedRoom(true)
      
      // Show success message only if user is logged in
      // if (isLoggedIn) {
      //   Alert.alert("Success", "You've joined the auction room", [
      //     { text: "OK", onPress: () => {} }
      //   ]);
      // }
    }

    socket.on('JoinAuctionRoom', onJoinSuccess)

    return () => {
      socket.off('JoinAuctionRoom', onJoinSuccess)
    }
  }, [isLoggedIn])

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
            title={currentPlayer.name}
            titleStyle={styles.playerName}
            subtitle={currentPlayer.playerRole}
            subtitleStyle={[styles.playerRole, { color: colors.primary }]}
            left={(props) =>
              currentPlayer.image ? (
                <Avatar.Image
                  {...props}
                  source={{ uri: currentPlayer.image }}
                  size={60}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  {...props}
                  label={currentPlayer.name.charAt(0)}
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
                <Text style={[styles.value, { color: colors.text }]}>{currentPlayer.age}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Email:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{currentPlayer.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Phone:</Text>
                <Text style={[styles.value, { color: colors.text }]}>{currentPlayer.phone}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text variant="titleSmall" style={[styles.sectionTitle, { color: colors.primary }]}>
                Cricket Details
              </Text>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Batting Style:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {currentPlayer.battingDetails.handedness}, {currentPlayer.battingDetails.battingOrder}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Bowling Style:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {currentPlayer.bowlingDetails.bowlingStyle}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={[styles.label, { color: colors.text }]}>Wicketkeeper:</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                  {currentPlayer.isWicketkeeper ? "Yes" : "No"}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bidContainer}>
          <Text variant="titleLarge" style={[styles.currentBidLabel, { color: colors.text }]}>
            Current Bid:
          </Text>
          <Text variant="headlineMedium" style={[styles.currentBid, { color: colors.primary }]}>
            ₹{currentBid}
          </Text>
          
          {isValidTeam && (
            <View style={styles.purseContainer}>
              <Text variant="bodyMedium" style={[styles.purseText, { color: colors.text }]}>
                Purse: ₹{purse.remainingPurse} / ₹{purse.totalPurse}
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

      {isValidTeam && !isOutOfRace && (
        <View style={[styles.bidActionContainer, { backgroundColor: colors.card }]}>
          <View style={styles.actionsRow}>
            <Button
              mode="contained"
              onPress={handleBid}
              loading={isBidding}
              disabled={isBidding || currentBid + BID_INCREMENT > purse.remainingPurse}
              style={[styles.bidButton, { flex: 1 }]}
              labelStyle={styles.bidButtonLabel}
              theme={{ colors: { primary: colors.primary } }}
            >
              Place Bid (+₹{BID_INCREMENT})
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

      {!isValidTeam && (
        <View style={[styles.bidActionContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.invalidTeamText, { color: colors.text }]}>
            Your team is not valid for this auction or you don't have enough funds
          </Text>
        </View>
      )}

      {isOutOfRace && (
        <View style={[styles.bidActionContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.outOfRaceText, { color: colors.text }]}>
            You're out of race for this player
          </Text>
        </View>
      )}
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
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useAxios from '../../helper/useAxios'
import { useIsFocused } from '@react-navigation/native'
import { List, Text, Divider, Card, Title, Paragraph, Chip, Button, IconButton } from 'react-native-paper'

export default function PlayersDetails() {
  const { auctionId } = useLocalSearchParams()
  const isFocused = useIsFocused()
  const router = useRouter()
  const [players, setPlayers] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const { fetchData } = useAxios()
  
  const getPlayersDetails = async () => {
    try {
      const res = await fetchData({
        url: `/api/auction/singleAuction/details/bids/${auctionId}`,
        method: 'GET'
      })
      if (res.data) {
        setPlayers(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPlayersDetails()
  }, [isFocused])

  if (selectedPlayer) {
    return (
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={styles.playerName}>{selectedPlayer.playerId.name}</Title>
              <Button 
                icon="arrow-left"
                onPress={() => setSelectedPlayer(null)}
                style={styles.backButton}
              >
                Back
              </Button>
            </View>

            <View style={styles.chipsRow}>
              <Chip icon="account" style={styles.chip}>
                Age: {selectedPlayer.playerId.age}
              </Chip>
              <Chip icon="cricket" style={styles.chip}>
                {selectedPlayer.playerId.playerRole}
              </Chip>
              {selectedPlayer.playerId.isWicketkeeper && (
                <Chip icon="gloves" style={styles.chip}>
                  Wicketkeeper
                </Chip>
              )}
            </View>

            <Divider style={styles.divider} />

            <Title style={styles.sectionTitle}>Batting Details</Title>
            <Paragraph>Handedness: {selectedPlayer.playerId.battingDetails.handedness}</Paragraph>
            <Paragraph>Batting Order: {selectedPlayer.playerId.battingDetails.battingOrder}</Paragraph>

            <Divider style={styles.divider} />

            <Title style={styles.sectionTitle}>Bowling Details</Title>
            <Paragraph>Style: {selectedPlayer.playerId.bowlingDetails.bowlingStyle}</Paragraph>

            <Divider style={styles.divider} />

            <Title style={styles.sectionTitle}>Auction Details</Title>
            <Paragraph>Status: {selectedPlayer.status}</Paragraph>
            <Paragraph>Base Price: ₹{selectedPlayer.playerId.basePrice}</Paragraph>
            <Paragraph>Final Price: ₹{selectedPlayer.bids?.[0]?.bidAmount || selectedPlayer.playerId.basePrice}</Paragraph>
            {selectedPlayer.status === 'sold' && (
              <Paragraph>Sold To: {selectedPlayer.bids?.[0]?.bidderName}</Paragraph>
            )}

            <Divider style={styles.divider} />

            <Title style={styles.sectionTitle}>Bid History</Title>
            {selectedPlayer.bids?.length > 0 ? (
              selectedPlayer.bids.map((bid, index) => (
                <Card key={index} style={styles.bidCard}>
                  <Card.Content>
                    <Paragraph>Bidder: {bid.bidderName}</Paragraph>
                    <Paragraph>Amount: ₹{bid.bidAmount}</Paragraph>
                    <Paragraph>Time: {new Date(bid.bidTime).toLocaleString()}</Paragraph>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Paragraph>No bids placed</Paragraph>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {players.map((player) => (
        <TouchableOpacity 
          key={player._id}
          onPress={() => setSelectedPlayer(player)}
          activeOpacity={0.7}
        >
          <Card style={styles.playerCard} elevation={2}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.playerMainInfo}>
                <View style={styles.roleIconContainer}>
                  <IconButton
                    icon={
                      player.playerId.playerRole === 'Batsman' ? 'bat' :
                      player.playerId.playerRole === 'Bowler' ? 'bowl-mix' :
                      'account'
                    }
                    size={24}
                    iconColor="#fff"
                    style={[
                      styles.roleIcon,
                      player.playerId.playerRole === 'Batsman' ? styles.batsmanBg :
                      player.playerId.playerRole === 'Bowler' ? styles.bowlerBg :
                      styles.allrounderBg
                    ]}
                  />
                </View>
                
                <View style={styles.textInfo}>
                  <Text variant="titleMedium" style={styles.playerName}>
                    {player.playerId.name}
                  </Text>
                  <Text variant="bodyMedium" style={styles.playerMeta}>
                    {player.playerId.age} yrs • {player.playerId.playerRole}
                  </Text>
                </View>
              </View>

              <View style={styles.bidInfo}>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Current</Text>
                  <Text style={styles.bidAmount}>
                    ₹{player.bids?.[0]?.bidAmount || player.playerId.basePrice}
                  </Text>
                </View>
                
                <View style={[
                  styles.statusContainer,
                  player.status === 'sold' ? styles.soldStatus : styles.unsoldStatus
                ]}>
                  <Text style={styles.statusText}>
                    {player.status === 'sold' ? 'SOLD' : 'UNSOLD'}
                  </Text>
                </View>
              </View>

              <IconButton
                icon="chevron-right"
                size={20}
                style={styles.arrowIcon}
              />
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  playerCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  playerMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIconContainer: {
    marginRight: 12,
  },
  roleIcon: {
    margin: 0,
    borderRadius: 8,
  },
  batsmanBg: {
    backgroundColor: '#4a6da7',
  },
  bowlerBg: {
    backgroundColor: '#e63946',
  },
  allrounderBg: {
    backgroundColor: '#588157',
  },
  textInfo: {
    flex: 1,
  },
  playerName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  playerMeta: {
    color: '#6c757d',
    fontSize: 13,
  },
  bidInfo: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 2,
  },
  bidAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2b9348',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  soldStatus: {
    backgroundColor: '#2b9348',
  },
  unsoldStatus: {
    backgroundColor: '#e63946',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  container: {
    flex: 1,
    padding: 8,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  bidAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
  },
  card: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bidCard: {
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
  },
})
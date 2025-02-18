import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { Card, Title, Paragraph } from 'react-native-paper'
import { useAuth } from '../../context/AuthContext'
import ProfilePage from '../../components/Profile'
import PlayerProfile from '../../components/PlayerProfile'


export default function Profile() {

  const { userRole, loggedInUser } = useAuth()


  return (
    <>
      {loggedInUser ? (
        (userRole === "admin" || userRole === "organisation") ? (
          <ProfilePage user={loggedInUser} />
        ) : userRole === "player" ? (
          <PlayerProfile />
        ) : (
       <WithoutLogindata/>
        )
      ) : (
        <WithoutLogindata/>
      )}
    </>
  )
}


const WithoutLogindata =()=>{
  return (
    <ScrollView contentContainerStyle={styles.container}>
          {/* Welcome Message */}
          <Card style={styles.card}>
            <Card.Content>
              <Title>Hi, welcome to MPL Shakarpur!</Title>
              <Paragraph>
                Stay tuned for exciting updates on our online auction and other events.
              </Paragraph>
            </Card.Content>
          </Card>

          {/* How It Works Section (ONLY shown when no user is available) */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title>⚡ How MPL Shakarpur Works</Title>

              <Paragraph style={styles.step}>
                1️⃣ **Team Registration**: Organizations and admins can register their teams to participate in the MPL auction. Each team must have a fixed budget and a certain number of slots available for players.
              </Paragraph>

              <Paragraph style={styles.step}>
                2️⃣ **Player Registration**: Players can register themselves, providing details such as skill level, experience, and preferred positions. Once registered, they are listed in the auction pool.
              </Paragraph>

              <Paragraph style={styles.step}>
                3️⃣ **Auction Process**: The auction is conducted online, where teams bid for players based on their available budget. The highest bidder secures the player for their team.
              </Paragraph>

              <Paragraph style={styles.step}>
                4️⃣ **Final Player Allocation**: Once the auction ends, teams get their final squad, and players receive confirmation of their selection. The tournament details and match schedules are then announced.
              </Paragraph>

              <Paragraph style={styles.finalNote}>
                📢 Get ready to experience the thrill of live bidding and competitive gameplay in MPL Shakarpur!
              </Paragraph>
            </Card.Content>
          </Card>
        </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 30
  },
  card: {
    width: '90%',
    padding: 16,
    elevation: 4,
    marginBottom: 16,
  },
  infoCard: {
    width: '90%',
    padding: 16,
    elevation: 4,
    marginTop: 16,
  },
  step: {
    marginBottom: 10,
  },
  finalNote: {
    fontWeight: 'bold',
    marginTop: 12,
  },
})

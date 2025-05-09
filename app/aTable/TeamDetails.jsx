import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import useAxios from '../../helper/useAxios';
import { Card, Text, Avatar, useTheme } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/core';

export default function TeamDetails() {
  const { auctionId } = useLocalSearchParams();
  const { fetchData } = useAxios();
  const { colors } = useTheme();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const isFocused = useIsFocused();

  const getTeams = async () => {
    try {
      setLoading(true);
      const queryParams = { onlyTeams: true };
      const res = await fetchData({
        url: `/api/auction/singleAuction/details/${auctionId}?${new URLSearchParams(queryParams).toString()}`,
        method: 'GET',
      });
      console.log(JSON.stringify(res.data))

      if (res.status) {
        setTeams(res.data);
      } else {
        setError('Failed to fetch team details');
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if(isFocused){
      getTeams();
  }
  }, [auctionId ,isFocused]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (teams.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>No teams found for this auction</Text>
      </View>
    );
  }
  const purse = (teams)=>{
if(teams.length){
return teams.find((t)=>t.auctionId==auctionId)
}
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
    
      
      {teams.map((team) => (
        <Card key={team._id} style={styles.card}>
          <Card.Title
            title={team.name}
            subtitle={`${team.email} • ${team.phone}`}
            left={(props) => (
              <Avatar.Text 
                {...props} 
                size={42} 
                label={team.name.charAt(0).toUpperCase()} 
                style={{ backgroundColor: colors.primary }}
              />
            )}
          />
          <Card.Content style={styles.cardContent}>
            <View style={styles.auctionInfo}>
              <Text variant="bodyMedium">
                <Text style={styles.label}>Total Purse:</Text> ₹{purse(team.auction)?.totalPurse || 0}
              </Text>
              <Text variant="bodyMedium">
                <Text style={styles.label}>Remaining Purse:</Text> ₹{purse(team.auction)?.remainingPurse || 0}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    paddingTop: 8,
  },
  auctionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
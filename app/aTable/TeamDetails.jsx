import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function TeamDetails() {
       const {auctionId}=useLocalSearchParams()
  return (
    <View>
      <Text>TeamDetails</Text>
      <Text>{auctionId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import useAxios from '../../helper/useAxios';
import { useTheme } from '../../hooks/useTheme';
import { Surface, Text } from 'react-native-paper';

export default function TermsConditionsViewer() {
  const { auctionId } = useLocalSearchParams();
  const { fetchData } = useAxios();
  const { colors } = useTheme();
  
  const [terms, setTerms] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setIsLoading(true);
        const res = await fetchData({
          url: `/api/auction/auctions/${auctionId}/terms`,
          method: "GET"
        });
        
        if (res.status && res.data) {
          setTerms(res.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, [auctionId]);

  if (isLoading) {
    return (
      <Surface style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" style={styles.loader} />
      </Surface>
    );
  }

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]}>
      <Surface style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Terms & Conditions
        </Text>
      </Surface>

      <ScrollView style={styles.contentContainer}>
        <Text variant="bodyMedium" style={styles.contentText}>
          {terms || "No terms and conditions available for this auction."}
        </Text>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentText: {
    lineHeight: 24,
    fontSize: 16,
  },
});
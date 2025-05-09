import { Pressable, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { heightPerHeight, widthPerWidth } from '../helper/dimensions'
import { router, useLocalSearchParams } from 'expo-router'
import { Button, IconButton, Surface, TextInput, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import useAxios from '../helper/useAxios';

export default function AuctionTerms() {
  const [terms, setTerms] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialTerms, setInitialTerms] = useState('');
  const { colors } = useTheme();
  const { auctionId } = useLocalSearchParams();
  const { fetchData } = useAxios();

  // Fetch terms data when component mounts
  useEffect(() => {
    const getTermsData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchData({
          url: `/api/auction/auctions/${auctionId}/terms`,
          method: "GET"
        });
        console.log(JSON.stringify(res , null ,2))
        console.log(res.data.content)
        if (res.status ) {
          setTerms(res.data.content);
          setInitialTerms(res.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTermsData();
  }, [auctionId]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await fetchData({
        url: `/api/auction/auctions/${auctionId}/terms`,
        method: "PUT",
        data: {
          content: terms,
          title: "Auction Terms & Conditions",
          updateReason: "Updated via mobile app"
        }
      });
      console.log(res)
      
      if (res.status) {
        console.log('here')
        router.back()
        setInitialTerms(terms); // Update initial terms after successful save
        setIsEditing(false);
        
      }
    } catch (error) {
      console.error("Failed to save terms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTerms(initialTerms); // Revert to original terms
    setIsEditing(false);
  };

  if (isLoading && !isEditing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Pressable 
      style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]} 
      onPress={() => router.back()}
    >
      <Pressable 
        style={[styles.innerContainer, { backgroundColor: colors.background }]}
        onPress={(e) => e.stopPropagation()}
      >
        <Surface style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Terms & Conditions
          </Text>
          {!isEditing && !isLoading && (
            <IconButton
              icon="pencil"
              onPress={() => setIsEditing(true)}
              mode="contained"
            />
          )}
        </Surface>

        {isEditing ? (
          <>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={10}
              value={terms}
              onChangeText={setTerms}
              placeholder="Enter your terms and conditions here..."
              style={styles.editor}
              autoFocus
            />
            <View style={styles.buttonRow}>
              <Button 
                mode="outlined" 
                onPress={handleCancel}
                style={styles.button}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSave}
                style={styles.button}
                loading={isLoading}
                disabled={isLoading}
              >
                Save
              </Button>
            </View>
          </>
        ) : (
          <ScrollView style={styles.contentContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text variant="bodyMedium" style={styles.contentText}>
                {terms || "No terms and conditions set. Tap the edit icon to add some."}
              </Text>
            )}
          </ScrollView>
        )}
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    height: heightPerHeight(60),
    width: widthPerWidth(100),
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontWeight: 'bold',
  },
  editor: {
    marginBottom: 20,
    minHeight: 200,
  },
  contentContainer: {
    flex: 1,
  },
  contentText: {
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
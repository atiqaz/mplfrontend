import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Modal, Portal, TextInput, Text, FAB, Provider, Card, Title, ActivityIndicator } from 'react-native-paper';
import useAxios from '../helper/useAxios';
import { memo } from 'react';

 function AuctionTerms({ visible, onDismiss, auctionId }) {
    const [terms, setTerms] = useState('');
    const [savedTerms, setSavedTerms] = useState('');
    const [loading, setLoading] = useState(true);
    const { fetchData } = useAxios();

    const isModal = typeof visible !== 'undefined';

    const getTerms = async () => {
        try {
            const res = await fetchData({
                url: `/api/auction/terms/${auctionId}`,
                method: 'GET',
            });
            if (res.data) {
                setSavedTerms(res.data.terms);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const saveTerms = async () => {
        try {
            const res = await fetchData({
                url: `/api/auction/terms/${auctionId}`,
                method: 'POST',
                data: { terms }
            });
            if (res.status) {
                setSavedTerms(terms);
                setTerms('');
                if (isModal) onDismiss();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (auctionId) {
            // getTerms();
        }
    }, [auctionId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    if (isModal) {
        return (
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={onDismiss}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Card style={styles.modalCard}>
                        <Card.Content>
                            <Title style={styles.modalTitle}>Edit Auction Terms</Title>
                            <TextInput
                                mode="outlined"
                                label="Terms and Conditions"
                                multiline
                                numberOfLines={8}
                                value={terms}
                                onChangeText={setTerms}
                                style={styles.input}
                                placeholder={savedTerms || "Enter terms and conditions..."}
                            />
                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="outlined"
                                    onPress={onDismiss}
                                    style={styles.button}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={saveTerms}
                                    style={[styles.button, styles.saveButton]}
                                    disabled={!terms.trim()}
                                >
                                    Save Terms
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </Modal>
            </Portal>
        );
    }

    return (
        <Card mode="outlined" style={styles.termsCard}>
            <Card.Content>
                {savedTerms ? (
                    <Text style={styles.savedText}>{savedTerms}</Text>
                ) : (
                    <Text style={styles.placeholderText}>
                        No terms and conditions have been set for this auction.
                    </Text>
                )}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    termsCard: {
        marginBottom: 16,
    },
    savedText: {
        fontSize: 14,
        lineHeight: 20,
    },
    placeholderText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 16,
    },
    modalContainer: {
        paddingHorizontal: 20,
    },
    modalCard: {
        padding: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        marginBottom: 20,
        backgroundColor: 'white',
        minHeight: 150,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    button: {
        marginLeft: 10,
        minWidth: 100,
    },
    saveButton: {
        backgroundColor: '#6200ee',
    },
    loader: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default memo( AuctionTerms)
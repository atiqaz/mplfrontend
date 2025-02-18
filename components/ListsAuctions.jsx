import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, FAB, Modal, Button, Portal, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import useAxios from '../helper/useAxios';
import Header from './Header';
import { useSocket } from '../context/socketContext';
import { useData } from '../context/useData';

export default function ListsAuctions({ setStarted, selectedInternalAuction, setselectedInternalAuction }) {
    const { fetchData, loading } = useAxios();
    const [auctions, setAuctions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const { socket } = useSocket();
    const { isAuctionStarted, setIsAuctionStarted } = useData();
    const [formData, setFormData] = useState({ title: '', description: '', auctionDate: new Date(), status: 'Pending' });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getData = async () => {
        const res = await fetchData({ url: '/api/auction/allauction', method: 'GET' });
        if (res.status) {
            setAuctions(res.data);
        }
    };
    useEffect(() => {
      
        getData();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData((prev) => ({ ...prev, auctionDate: selectedDate }));
        }
    };

    const handleFormSubmit = async () => {
        const res = await fetchData({ url: '/api/auction', method: 'POST', data: formData });
        if (res.status) {
            setAuctions([res.data, ...auctions]);
            setFormData({ title: '', description: '', auctionDate: new Date(), status: 'Pending' });
            setFormModalVisible(false);
        }
    };

    const handleStartAuction = () => {
        setModalVisible(false);
        setStarted(true);
        const payload ={ start: true, roomId: selectedInternalAuction.roomId, auctionId: selectedInternalAuction._id }
        console.log('start:auction emitted',payload)
        socket.emit('start:auction', payload);
    };

    const renderAuctionItem = ({ item }) => (
        <Card style={styles.card} onPress={() => { setselectedInternalAuction(item); setModalVisible(true); }}>
            <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
                <Paragraph>Status: {item.status}</Paragraph>
                <Paragraph>Auction Date: {new Date(item.auctionDate).toLocaleDateString()}</Paragraph>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Header title={'Auction Lists'} />
            {loading ? (
                <ActivityIndicator animating={true} size="large" style={styles.loader} />
            ) : (
                <FlatList data={auctions} keyExtractor={(item) => item._id} renderItem={renderAuctionItem} contentContainerStyle={styles.list} />
            )}
            <FAB icon="plus" style={styles.fab} onPress={() => setFormModalVisible(true)} />
            {/* Auction Details Modal */}
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    {selectedInternalAuction && (
                        <>
                            <Text style={styles.modalTitle}>{selectedInternalAuction.title}</Text>
                            <Paragraph>{selectedInternalAuction.description}</Paragraph>
                            <Paragraph>Status: {selectedInternalAuction.status}</Paragraph>
                            <Paragraph>Auction Date: {new Date(selectedInternalAuction.auctionDate).toLocaleDateString()}</Paragraph>
                            <Button mode="contained" onPress={handleStartAuction} style={styles.submitButton}>Start Auction</Button>
                        </>
                    )}
                </Modal>
            </Portal>
            {/* Add New Auction Form Modal */}
            <Portal>
                <Modal visible={formModalVisible} onDismiss={() => setFormModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Add New Auction</Text>
                            <TextInput style={styles.input} placeholder="Title" value={formData.title} onChangeText={(value) => handleInputChange('title', value)} />
                            <TextInput style={styles.input} placeholder="Description" value={formData.description} onChangeText={(value) => handleInputChange('description', value)} />
                            <Button onPress={() => setShowDatePicker(true)}>Select Auction Date</Button>
                            {showDatePicker && (
                                <DateTimePicker value={formData.auctionDate} mode="date" display="default" onChange={handleDateChange} />
                            )}
                            <Paragraph>Selected Date: {formData.auctionDate.toLocaleDateString()}</Paragraph>
                            <Button mode="contained" onPress={handleFormSubmit} style={styles.submitButton}>Submit</Button>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, backgroundColor: '#F9F9F9',  },
    card: { marginBottom: 10, borderRadius: 10, elevation: 3 },
    loader: { marginTop: 20 },
    list: { paddingBottom: 20 },
    fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#6200EE' },
    modalContainer: { backgroundColor: 'white', padding: 20, marginHorizontal: 20, borderRadius: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 5, marginBottom: 10, padding: 12, backgroundColor: 'white' },
    submitButton: { marginTop: 10, backgroundColor: '#6200EE' },
});

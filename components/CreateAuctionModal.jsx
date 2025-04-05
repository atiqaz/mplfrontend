import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { widthPerWidth } from '../helper/dimensions';
import { Button, Paragraph, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import useAxios from '../helper/useAxios';
import { useSnackbar } from '../context/useSnackBar';
import { useTheme } from '../hooks/useTheme';

const CreateAuctionModal = ({ modalVisible, setModalVisible }) => {

    const {colors}=useTheme()
    const [text, setText] = React.useState("");
    const { fetchData, loading , error } = useAxios();
    const {showSnackbar}=useSnackbar()
     const [formData, setFormData] = useState({ title: '', description: '', auctionDate: new Date(), status: 'Pending' });
       const [showDatePicker, setShowDatePicker] = useState(false);
       const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    // if(error){
    //     showSnackbar(error?.message ||'Failed to create auction', 'error')
      
    // }
    useEffect(() => {
        if (error) {
            showSnackbar(error?.message || 'Failed to create auction', 'error')
        }
    },[error])
       const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData((prev) => ({ ...prev, auctionDate: selectedDate }));
        }
    };
    const handleFormSubmit = async () => {
        const res = await fetchData({ url: '/api/auction', method: 'POST', data: formData });
        if (res.status) {
            showSnackbar('Auction created Successfully', 'success')
            setFormData({ title: '', description: '', auctionDate: new Date(), status: 'Pending' });
            setModalVisible(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}
                >
                    <Pressable
                        style={styles.modalBackground}
                        onPress={() => setModalVisible(false)} // Close when clicking outside
                    >
                        <Pressable
                            style={[styles.modalView,{
                                backgroundColor: colors.background,
                                borderColor: colors.border,
                                borderWidth: 1,
                            }]}
                            onPress={() => { }} // Prevent closing when clicking inside
                        >
                            {/* <Text style={styles.modalText}>Hello World!</Text> */}
                            <TextInput
                                label="Auction Title"
                                value={formData.title} onChangeText={(value) => handleInputChange('title', value)} 
                                style={styles.input}
                                mode="outlined"
                                placeholder='Enter Auction Title'
                            />
                             <TextInput
                                label="Auction Description"
                                value={formData.description} onChangeText={(value) => handleInputChange('description', value)}
                                style={styles.input}
                                numberOfLines={5}
                                mode="outlined"
                                placeholder='Enter Auction Description'
                            />
                            <Paragraph>Selected Date: {formData.auctionDate.toLocaleDateString()}</Paragraph>
                             <Button mode='contained' style={styles.submitButton} onPress={() => setShowDatePicker(true)}>Select Auction Date</Button>
                            {showDatePicker && (
                                <DateTimePicker value={formData.auctionDate} mode="date" display="default" onChange={handleDateChange} />
                            )}
                            <Button mode="contained" onPress={handleFormSubmit} style={styles.submitButton}>Submit</Button>
                            
                        </Pressable>
                    </Pressable>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds dimmed background
    },
    modalView: {
        width: widthPerWidth(100),

        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
    },
    input: {
        width: "100%",
        marginBottom:10
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    submitButton:{
        marginTop:10,
        width:"100%"
    }
});

export default CreateAuctionModal;

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { useSnackbar } from '../../context/useSnackBar';

export default function CustomSnackbar() {
    const { snackbarData, hideSnackbar } = useSnackbar();

    const getSnackbarStyle = () => {
        switch (snackbarData.type) {
            case 'success':
                return { backgroundColor: 'green', textColor: 'white' };
            case 'error':
                return { backgroundColor: 'red', textColor: 'white' };
            default:
                return { backgroundColor: 'orange', textColor: 'white'};
        }
    };

    const { backgroundColor, textColor } = getSnackbarStyle();

    useEffect(() => {
        if (snackbarData.visible) {
            const timer = setTimeout(() => {
                hideSnackbar();
            }, 400); // Force close after 400ms

            return () => clearTimeout(timer); // Cleanup in case of re-render
        }
    }, [snackbarData.visible]);

    return (
       <Portal>
         <Snackbar
            visible={snackbarData.visible}
            onDismiss={hideSnackbar}
            duration={400}
            style={[styles.snackbar, { backgroundColor }]}
        >
            <Text style={[styles.snackbarText, { color: textColor }]}>
                {snackbarData.message}
            </Text>
        </Snackbar>
       </Portal>
    );
}

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        borderRadius: 10,
        elevation: 6,
    },
    snackbarText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

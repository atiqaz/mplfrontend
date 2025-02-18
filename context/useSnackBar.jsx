import React, { createContext, useState, useContext } from 'react';
import CustomSnackbar from '../components/common/CustomSnackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => {
    return useContext(SnackbarContext);
};

export const SnackbarProvider = ({ children }) => {
    const [snackbarData, setSnackbarData] = useState({
        visible: false,
        message: '',
        type: '', // 'success' or 'error'
    });

    const showSnackbar = (message, type) => {
        console.log(message, type)
        setSnackbarData({
            visible: true,
            message,
            type,
        });
    };

    const hideSnackbar = () => {
        setSnackbarData({
            ...snackbarData,
            visible: false,
        });
    };

    return (
        <SnackbarContext.Provider value={{ snackbarData, showSnackbar, hideSnackbar }}>
            {children}
            <CustomSnackbar />
        </SnackbarContext.Provider>
    );
};

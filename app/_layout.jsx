import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/socketContext';
import { ProjectProvider } from '../context/useData';
import { SnackbarProvider } from '../context/useSnackBar';

function MainLayoutProvider() {
    return (
        <>

            <Stack>
              
                <Stack.Screen
                    name="(home)"
                    options={{
                        headerShown: false,
                    }}
                />
                  <Stack.Screen
                    name="index"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="auth"
                    options={{
                        headerShown: false,
                    }}
                /> <Stack.Screen
                    name="lists"
                    options={{
                        headerShown: false,
                    }}
                /> <Stack.Screen
                    name="playerRegistration"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="groupChat"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="singleMessage"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="userRegister"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="puchasedPlayer"
                    options={{
                        presentation: 'transparentModal',
                        animation: 'slide_from_bottom',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="playerDetails"
                    options={{
                        presentation: 'transparentModal',
                        animation: 'slide_from_bottom',
                        headerShown: false,
                    }}
                />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}


export default function layout() {
    return (
        <PaperProvider>
        <SnackbarProvider>
        <SocketProvider>
                <AuthProvider>
                    <ProjectProvider>
                        <MainLayoutProvider />
                    </ProjectProvider>
                </AuthProvider>
            </SocketProvider>
        </SnackbarProvider>
            
        </PaperProvider>
    );
}
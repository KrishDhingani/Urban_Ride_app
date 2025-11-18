import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { WSProvider } from '@/service/WSProvider';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <WSProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="role" />
            </Stack>
        </WSProvider>
        </GestureHandlerRootView>
    );
};

export default Layout;
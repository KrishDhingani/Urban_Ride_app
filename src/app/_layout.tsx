import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { WSProvider } from '@/service/WSProvider';

const Layout = () => {
    return (
        <WSProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="role" />
            </Stack>
        </WSProvider>
    );
};

export default Layout;
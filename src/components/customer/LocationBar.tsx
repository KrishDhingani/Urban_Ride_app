import { logout } from '@/service/authService';
import { useWS } from '@/service/WSProvider';
import { useUserStore } from '@/store/userStore';
import { uiStyles } from '@/styles/uiStyles';
import { Colors } from '@/utils/Constants';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from '../shared/CustomText';

const LocationBar = () => {
    const { location } = useUserStore();
    const { disconnect } = useWS();

    return (
        <SafeAreaView style={uiStyles.absoluteTop}>
            
            <View style={uiStyles.container}>
                <TouchableOpacity style={uiStyles.btn} onPress={() => logout(disconnect)}>
                    <SimpleLineIcons name="logout" size={RFValue(16)} color={Colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={uiStyles.locationBar}
                    onPress={() => router.navigate('/customer/selectlocations')}>
                    <View style={uiStyles.dot} />

                    <CustomText numberOfLines={1} style={uiStyles.locationText}>
                        {location?.address || "Getting address..."}
                    </CustomText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LocationBar;

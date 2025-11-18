import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { authStyles } from '@/styles/authStyles'
import { commonStyles } from '@/styles/commonStyles'
import CustomText from '@/components/shared/CustomText'
import { MaterialIcons } from '@expo/vector-icons';
import { useWS } from '@/service/WSProvider'
import PhoneInput from '@/components/shared/PhoneInput'
import CustomButton from '@/components/shared/CustomButton'
import { signin } from '@/service/authService'

const Auth = () => {

    const { updateAccessToken } = useWS();
    const [phone, setPhone] = useState("");
    const handleNext =async() => {
        if(!phone && phone.length <10){
            Alert.alert("Please enter a valid phone number")
            return;
        }
        signin({role:"customer",phone},updateAccessToken);
    };

    return (
        <SafeAreaView style={authStyles.container}>
            <ScrollView contentContainerStyle={authStyles.container}>
                <View style={commonStyles.flexRowBetween}>
                    <Image source={require("@assets/images/logo_t.png")}
                        style={authStyles.logo} />
                    <TouchableOpacity style={authStyles.flexRowGap}>
                        <MaterialIcons name="help" size={18} color="grey" />
                        <CustomText fontFamily="Medium" variant="h7">
                            Help
                        </CustomText>
                    </TouchableOpacity>
                </View>

                <CustomText fontFamily="Medium" variant="h6">
                    What's your number?
                </CustomText>

                <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
                    Enter your phone number to proceed
                </CustomText>

                <PhoneInput onChangeText={setPhone} value={phone} />
            </ScrollView>

            <View style={authStyles.footerContainer}>
                <CustomText variant="h8" fontFamily="Regular"
                    style={[
                        commonStyles.lightText,
                        { textAlign: 'center', marginHorizontal: 20 },
                    ]}>
                    By continuing, you agree to Urban Ride's Terms of Service and Privacy Policy.
                </CustomText>
                <CustomButton
                    title="Next"
                    onPress={handleNext}
                    loading={false}
                    disabled={false}
                />

            </View>

        </SafeAreaView>
    )
}

export default Auth;
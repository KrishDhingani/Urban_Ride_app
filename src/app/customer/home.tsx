import DraggableMap from '@/components/customer/DraggableMap'
import LocationBar from '@/components/customer/LocationBar'
import { homeStyles } from '@/styles/homeStyles'
import { screenHeight } from '@/utils/Constants'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Platform, View } from 'react-native'
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'

const androidHeights = [screenHeight * 0.10, screenHeight * 0.80];
const iosHeights = [screenHeight * 0.12, screenHeight * 0.42];

const CustomerHome = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS === 'ios' ? iosHeights : androidHeights),
    []
  );

  const [mapHeight, setMapHeight] = useState(snapPoints[0]);

  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.8;
    if (index == 1) {
      height = screenHeight * 0.6;
    }
    setMapHeight(height);
  }, []);

  return (
    <View style={homeStyles.container}>
      <StatusBar
        style="light"
        backgroundColor="orange"
        translucent={false}
      />
      <LocationBar />
      <View style={{ height: mapHeight }}>
        <DraggableMap height={mapHeight} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        handleIndicatorStyle={{ 
          backgroundColor:"#ccc",
        }}
        enableOverDrag={false}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={{zIndex:4}}
      >
        <BottomSheetScrollView 
          contentContainerStyle={homeStyles.scrollContainer}>
          <View/>
        </BottomSheetScrollView>

      </BottomSheet>

    </View>

  )
}

export default CustomerHome
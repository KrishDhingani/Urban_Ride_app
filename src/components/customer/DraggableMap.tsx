import { useWS } from '@/service/WSProvider';
import { useUserStore } from '@/store/userStore';
import { mapStyles } from '@/styles/mapStyles';
import { customMapStyle, indiaIntialRegion } from '@/utils/CustomMap';
import { reverseGeocode } from '@/utils/mapUtils';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';

const DraggableMap: FC<{ height: number }> = ({ height }) => {
    const isFocused = useIsFocused();
    const [markers, setMarkers] = useState<any>([]);
    const mapRef = useRef<MapView>(null);
    const { setLocation, location, outOfRange, setOutOfRange } = useUserStore();
    const MAX_DISTANCE_THRESHOLD = 20000; // 20 km


    const generateRandomMarkers = () => {
        if (!location?.latitude || !location?.longitude || outOfRange) return;

        const types = ['bike', 'auto', 'cab'];

        const newMarkers = Array.from({ length: 20 }, (_, index) => {
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomRotation = Math.floor(Math.random() * 360);

            return {
                id: index,
                latitude: location.latitude + (Math.random() - 0.5) * 0.03, // bigger spread
                longitude: location.longitude + (Math.random() - 0.5) * 0.03,
                type: randomType,
                rotation: randomRotation,
                visible: true,
            };
        });

        setMarkers(newMarkers);
    };


    useEffect(() => {
        (async () => {
            if (!isFocused) return;

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            try {
                const loc = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = loc.coords;

                mapRef.current?.fitToCoordinates(
                    [{ latitude, longitude }],
                    {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                        animated: true,
                    }
                );

                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                };

                await handleRegionChangeComplete(newRegion);

                generateRandomMarkers();

            } catch (error) {
                console.error("Error getting current location:", error);
            }
        })();
    }, [isFocused]);

    const handleRegionChangeComplete = async (newRegion: Region) => {
        const address = await reverseGeocode(newRegion.latitude, newRegion.longitude);
        setLocation({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            address,
        });

        const userLocation = {
            latitude: location?.latitude,
            longitude: location?.longitude,
        } as any;

        if (userLocation) {
            const distance = haversine(userLocation, newRegion);
            setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
        }

        generateRandomMarkers();
    };

    // GPS button handler
    const handleGpsButtonPress = async () => {
        try {
            const loc = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = loc.coords;

            mapRef.current?.fitToCoordinates(
                [{ latitude, longitude }],
                {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                }
            );

            const address = await reverseGeocode(latitude, longitude);
            setLocation({ latitude, longitude, address });


            generateRandomMarkers();

        } catch (error) {
            console.error("Error getting location:", error);
        }
    };

    return (
        <View style={{ height, width: '100%', position: 'relative' }}>
            <MapView
                ref={mapRef}
                maxZoomLevel={16}
                minZoomLevel={12}
                pitchEnabled={false}
                onRegionChangeComplete={handleRegionChangeComplete}
                style={{ flex: 1 }}
                initialRegion={indiaIntialRegion}
                provider="google"
                showsMyLocationButton={false}
                showsCompass={false}
                showsIndoors={false}
                showsIndoorLevelPicker={false}
                showsTraffic={false}
                showsScale={false}
                showsBuildings={false}
                showsPointsOfInterests={false}
                customMapStyle={customMapStyle}
                showsUserLocation={true}
            >
                {markers
                    ?.filter(
                        (marker: {
                            id: number;
                            latitude: number;
                            longitude: number;
                            type: "bike" | "auto" | "cab";
                            rotation: number;
                            visible: boolean;
                        }) => marker.latitude && marker.longitude && marker.visible
                    )
                    .map(
                        (
                            marker: {
                                id: number;
                                latitude: number;
                                longitude: number;
                                type: "bike" | "auto" | "cab";
                                rotation: number;
                                visible: boolean;
                            },
                            index: number
                        ) => (
                            <Marker
                                key={marker.id}
                                anchor={{ x: 0.5, y: 0.5 }}
                                zIndex={index + 1}
                                flat
                                coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude,
                                }}
                            >
                                <View
                                    style={{
                                        transform: [{ rotate: `${marker.rotation}deg` }],
                                    }}
                                >
                                    <Image
                                        source={
                                            marker.type === "bike"
                                                ? require("@/assets/icons/bike_marker.png")
                                                : marker.type === "auto"
                                                    ? require("@/assets/icons/auto_marker.png")
                                                    : require("@/assets/icons/cab_marker.png")
                                        }
                                        style={{
                                            height: 40,
                                            width: 40,
                                            resizeMode: "contain",
                                        }}
                                    />
                                </View>
                            </Marker>
                        )
                    )}


            </MapView>
            <View style={mapStyles.centerMarkerContainer}>
                <Image
                    source={require('@/assets/icons/marker.png')}
                    style={mapStyles.marker}
                />
            </View>
           
            <TouchableOpacity style={mapStyles.gpsButton} onPress={handleGpsButtonPress}>
                <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={RFValue(16)}
                    color="#3C75BE"
                />
            </TouchableOpacity>
            
            {outOfRange && (
                <View style={mapStyles.outOfRange}>
                    <FontAwesome6 name="road-circle-exclaimation" size={24} color="red" />
                </View>
            )}
        </View>
    );
};

export default memo(DraggableMap);

import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator, useTheme } from 'react-native-paper'

export default function LoadingView() {
    const paper = useTheme();
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size={"large"} color={paper.colors.tertiary} />
        </View>
    )
}
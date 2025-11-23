import { View } from 'react-native'
import React from 'react'
import BoxStyles from '../../../utils/genericScreenStyles'
import { Text, Icon, useTheme } from 'react-native-paper'

export default function EmptyListView({ message, icon }) {
    const paper = useTheme();
    return (
        <View style={[BoxStyles.container, BoxStyles.flexCentered]}>
            <Icon source={icon} color={paper.colors.gray} size={96} />
            <Text variant='headlineSmall' style={[{ textAlign: "center", color: paper.colors.gray }, BoxStyles.font700]}>{message}</Text>
        </View>
    )
}
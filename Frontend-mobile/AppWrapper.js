import MainNavigator from './navigation/MainNavigator'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from 'react-native-paper'

export default function AppWrapper() {
    const paper = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: paper.colors.background, height: "100%" }}>
            <MainNavigator />
        </SafeAreaView>
    )
}
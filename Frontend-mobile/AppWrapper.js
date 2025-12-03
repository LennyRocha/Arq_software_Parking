import MainNavigator from './navigation/MainNavigator'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from 'react-native-paper'
import setPension from './modules/acceso/hooks/setPension';
import LoadingView from './components/LoadingView';

export default function AppWrapper() {
    const paper = useTheme();
    const { loading } = setPension();

    if (loading) return <LoadingView />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: paper.colors.background, height: "100%" }}>
            <MainNavigator />
        </SafeAreaView>
    )
}
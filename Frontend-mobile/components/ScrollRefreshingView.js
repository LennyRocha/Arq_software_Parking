import React from "react";
import { ScrollView, RefreshControl } from "react-native";
import { useTheme } from "react-native-paper";

export default function ScrollRefreshingView({
  children,
  refreshHandler,
  onScroll,
  ...props
}) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.resolve(refreshHandler && refreshHandler()).finally(() =>
      setRefreshing(false)
    );
  }, [refreshHandler]);

  const paperTheme = useTheme();

  return (
    <ScrollView
      {...props}
      onScroll={onScroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={paperTheme.colors.primary} // iOS
          colors={[paperTheme.colors.primary]} // Android
          progressBackgroundColor={paperTheme.colors.background}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

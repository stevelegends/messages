// react
import * as SplashScreen from "expo-splash-screen";
import { FC, useCallback, useEffect, useState } from "react";

// modules
import { View, ViewProps } from "react-native";

// hooks
import useLoadFonts from "../hooks/use-load-fonts";

// utils
import wait from "../utils/wait";

SplashScreen.preventAutoHideAsync();

type AppLoaderProps = object & ViewProps;

const AppLoader: FC<AppLoaderProps> = (props) => {
  useLoadFonts();

  const [isAppReady, setIsAppReady] = useState(false);

  async function prepare(): Promise<void> {
    await wait(2000);
    setIsAppReady(true);
  }

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    prepare();
  }, []);

  if (!isAppReady) {
    return <></>;
  }

  return <View onLayout={onLayoutRootView} {...props} />;
};

export default AppLoader;

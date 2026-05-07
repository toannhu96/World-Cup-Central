import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";
import { AppProvider } from "../context/AppContext";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Suspense } from "react";

import HomePage from "@/pages/index";
import MatchDetailPage from "@/pages/match-detail";
import { useDailyCheckIn } from "../hooks/useDailyCheckIn";

const queryClient = new QueryClient();

const AppCheckIn = () => {
  useDailyCheckIn();
  return null;
};

const Layout = () => {
  return (
    <RecoilRoot>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
        <App theme={(getSystemInfo().zaloTheme || "light") as AppProps["theme"]}>
          <AppCheckIn />
          <SnackbarProvider>
            <ZMPRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <AnimationRoutes>
                  <Route path="/" element={<HomePage />}></Route>
                  <Route path="/match/:id" element={<MatchDetailPage />}></Route>
                </AnimationRoutes>
              </Suspense>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </QueryClientProvider>
    </AppProvider>
    </RecoilRoot>
  );
};
export default Layout;

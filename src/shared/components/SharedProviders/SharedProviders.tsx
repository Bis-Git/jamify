import { FC, PropsWithChildren } from "react";
import { GlobalTransportProvider } from "../../context/GlobalTransportContext/GlobalTransportContext";
// import { AppAudioProvider } from "../../context/AppAudioContext/AppAudioContext";

const SharedProviders: FC<PropsWithChildren> = ({ children }) => {
  // return <AppAudioProvider>{children}</AppAudioProvider>;
  return <GlobalTransportProvider>{children}</GlobalTransportProvider>;
};

export default SharedProviders;

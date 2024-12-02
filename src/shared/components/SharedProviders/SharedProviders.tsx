import { FC, PropsWithChildren } from "react";
import { AppAudioProvider } from "../../context/AppAudioContext/AppAudioContext";

const SharedProviders: FC<PropsWithChildren> = ({ children }) => {
  return <AppAudioProvider>{children}</AppAudioProvider>;
};

export default SharedProviders;

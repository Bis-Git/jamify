import { FC, PropsWithChildren } from "react";

const SharedProviders: FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export default SharedProviders;

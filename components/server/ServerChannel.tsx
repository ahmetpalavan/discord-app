import { Channel, Role, Server } from "@prisma/client";
import React from "react";

type Props = {
  channel: Channel;
  server: Server;
  role?: Role;
};

const ServerChannel = (props: Props) => {
  return <div>ServerChannel</div>;
};

export default ServerChannel;

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import NavigationSidebar from "./navigation/NavigationSidebar";
import ServerSidebar from "./server/ServerSidebar";

type Props = {
  serverId: string;
};

const MobileToggle = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" size={"icon"} variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={props.serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;

import { getUser } from "@next/utils/auth";
import Image from "next/image";

const Dashboard = () => {
  return (
    <div className="w-full text-center">
      this is dashboard. Only authenticated users can access this route
    </div>
  );
};

export default Dashboard;

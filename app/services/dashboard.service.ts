import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";

const getRevenue = async () => {
  const session = await getServerSession(authOptions);
  
    if (!session?.accessToken) {
      throw new Error("Unauthorized: missing access token");
    }
  
    await new Promise(resolve => setTimeout(resolve, 3000));
  
    const data = { revenue: 12500, currency: "USD", period: "monthly" };
    return data;
};
export { getRevenue };

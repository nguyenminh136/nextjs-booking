import { getServerAccessToken } from "@/lib/auth/get-server-access-token";

const getRevenue = async () => {
  const accessToken = await getServerAccessToken();
  
    if (!accessToken) {
      throw new Error("Unauthorized: missing access token");
    }
  
    await new Promise(resolve => setTimeout(resolve, 3000));
  
    const data = { revenue: 12500, currency: "USD", period: "monthly" };
    return data;
};
export { getRevenue };

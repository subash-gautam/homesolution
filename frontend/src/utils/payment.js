import { NativeModules } from "react-native";

const { KhaltiPayment } = NativeModules;

export const initiateKhaltiPayment = async (amount, pidx) => {
  try {
    const publicKey = "your_public_key_here"; // Get from Khalti dashboard
    const response = await KhaltiPayment.initiatePayment(
      publicKey,
      pidx,
      amount
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

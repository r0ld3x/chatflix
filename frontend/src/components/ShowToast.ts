import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  const toastOptions = { ...getDefaultToastOptions(), ...options };
  toast.success(message, toastOptions);
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  const toastOptions = { ...getDefaultToastOptions(), ...options };
  toast.warning(message, toastOptions);
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  const toastOptions = { ...getDefaultToastOptions(), ...options };
  toast.error(message, toastOptions);
};

const getDefaultToastOptions = (): ToastOptions => ({
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
});

import { AlertCircle } from "lucide-react";

const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
    <p className="text-red-700 text-sm">{message}</p>
  </div>
);

export default ErrorAlert;

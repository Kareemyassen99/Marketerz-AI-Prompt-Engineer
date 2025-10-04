
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="my-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
    <p className="font-semibold">An Error Occurred</p>
    <p>{message}</p>
  </div>
);

export default ErrorMessage;

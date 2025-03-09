// components/ErrorMessage.tsx
'use client';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4">
      <p className="font-medium">Error: {message}</p>
    </div>
  );
}
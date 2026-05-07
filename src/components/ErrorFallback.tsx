import React from "react";
import { Box, Text, Button, Page } from "zmp-ui";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const handleRestart = () => {
    window.location.reload();
  };

  const formatErrorDetails = (): string => {
    let details = `Error: ${error.message}\n\n`;
    if (error.stack) {
      details += `Stack Trace:\n${error.stack}`;
    }
    return details;
  };

  return (
    <Page className="flex items-center justify-center p-6 bg-white min-h-screen">
      <Box flex flexDirection="column" alignItems="center" className="w-full max-w-md text-center">
        <Box className="mb-6 p-4 bg-red-50 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </Box>
        
        <Text size="xLarge" className="font-bold text-gray-900 mb-2">
          Something went wrong
        </Text>
        
        <Text size="small" className="text-gray-500 mb-8">
          The application encountered an unexpected error. Please reload to continue.
        </Text>

        <Box className="w-full space-y-3">
          <Button
            fullWidth
            onClick={handleRestart}
            variant="primary"
          >
            Try Again
          </Button>
          
          <Button
            fullWidth
            onClick={() => {
              const details = formatErrorDetails();
              console.error(details);
              alert(details);
            }}
            variant="secondary"
          >
            View Details
          </Button>
        </Box>

        <Box className="mt-10 pt-6 border-t border-gray-100 w-full">
          <Text size="xxxSmall" className="text-gray-400">
            If the problem persists, please contact support.
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

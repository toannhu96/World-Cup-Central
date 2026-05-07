import React from "react";
import { Box, Text, Button, Page } from "zmp-ui";
import { useTranslation } from "react-i18next";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { t } = useTranslation();
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
        <Box className="mb-6 p-4 bg-red-0 rounded-full">
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
          {t('common.something_went_wrong')}
        </Text>
        
        <Text size="small" className="text-gray-500 mb-8">
          {t('common.error_desc')}
        </Text>

        <Box className="w-full space-y-3">
          <Button
            fullWidth
            onClick={handleRestart}
            variant="primary"
          >
            {t('common.try_again')}
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
            {t('common.view_details')}
          </Button>
        </Box>

        <Box className="mt-10 pt-6 border-t border-gray-100 w-full">
          <Text size="xxxSmall" className="text-gray-400">
            {t('common.contact_support_hint')}
          </Text>
        </Box>
      </Box>
    </Page>
  );
}

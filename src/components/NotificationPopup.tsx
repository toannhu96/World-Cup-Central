import React, { useState, useEffect } from "react";
import { Box, Text, Modal, Button, Icon } from "zmp-ui";
import { hasAskedForNotifications, setAskedForNotifications, requestMatchNotifications } from "../api/zaloApi";
import { useTranslation } from "react-i18next";

export const NotificationPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkStatus = async () => {
      const asked = await hasAskedForNotifications();
      if (!asked) {
        // Show after a short delay for better UX
        const timer = setTimeout(() => {
          setVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };
    checkStatus();
  }, []);

  const handleClose = () => {
    setVisible(false);
    setAskedForNotifications();
  };

  const handleAllow = async () => {
    // Placeholder template IDs - these would normally come from the Zalo Official Account dashboard
    const templateIds = ["match_alert_01", "result_alert_01"];
    await requestMatchNotifications(templateIds);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      maskClosable={false}
      className="notification-modal"
    >
      <Box className="p-4 text-center">
        <Box className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="zi-notif-ring" className="text-yellow-600" size={32} />
        </Box>
        <Text size="large" className="font-bold mb-2">{t('common.dont_miss_goal')}</Text>
        <Text size="small" className="text-gray-500 mb-6 px-2">
          {t('common.notif_popup_desc')}
        </Text>
        <Box flex flexDirection="column" className="gap-2">
          <Button
            fullWidth
            onClick={handleAllow}
            className="bg-blue-600 border-none h-12 rounded-xl font-bold"
          >
            {t('common.notify_me')}
          </Button>
          <Button
            fullWidth
            variant="tertiary"
            onClick={handleClose}
            className="text-gray-400 h-10"
          >
            {t('common.maybe_later')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

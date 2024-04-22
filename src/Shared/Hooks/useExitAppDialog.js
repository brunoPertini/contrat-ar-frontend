import { useEffect, useState } from 'react';
import { DialogModal } from '../Components';
import { sharedLabels } from '../../StaticData/Shared';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { dialogModalTexts } from '../Constants/System';
import { waitAndCleanUserTokenCookie } from '../Helpers/UtilsHelper';

const localStorageService = new LocalStorageService();

export default function useExitAppDialog(isOpenModal, handleLogout, onCancel) {
  const [modalContent, setModalContent] = useState({ title: '', text: '', handleAccept: () => {} });

  useEffect(() => {
    setModalContent({
      title: dialogModalTexts.EXIT_APP.title,
      text: dialogModalTexts.EXIT_APP.text,
      handleAccept: handleLogout,
    });
  }, [isOpenModal]);

  const onCancelLeavingPage = () => {
    setModalContent({ title: '', text: '' });
    localStorageService.removeItem(LocalStorageService.PAGES_KEYS.SHARED.BACKPRESSED);
    waitAndCleanUserTokenCookie();
    onCancel();
  };

  if (!isOpenModal) {
    return null;
  }

  return (
    <DialogModal
      title={modalContent.title}
      contextText={modalContent.text}
      cancelText={sharedLabels.cancel}
      acceptText={sharedLabels.accept}
      open={isOpenModal}
      handleAccept={handleLogout}
      handleDeny={onCancelLeavingPage}
    />
  );
}

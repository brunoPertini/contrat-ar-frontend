import { useEffect, useState } from 'react';
import { DialogModal } from '../Components';
import usePaymentQueryParams from './usePaymentQueryParams';
import { PAYMENT_STATE } from '../Constants/System';
import { paymentLabels } from '../../StaticData/Payment';

export default function usePaymentDialogModal(isOpen, onCloseDialog) {
  const [modalContent, setModalContent] = useState({ title: '', text: '' });

  const paymentParams = usePaymentQueryParams();

  useEffect(() => {
    const { paymentId, status } = paymentParams;

    setModalContent({
      title: paymentLabels.paymentConfirmed.replace('{paymentId}', paymentId),
      text: status === PAYMENT_STATE.SUCCESS ? paymentLabels['signup.confirmation.success']
        : paymentLabels['signup.confirmation.error'].replace('{paymentId}', paymentId),
    });
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <DialogModal
      title={modalContent.title}
      contextText={modalContent.text}
      open={isOpen}
      onCloseDialog={onCloseDialog}
    />
  );
}

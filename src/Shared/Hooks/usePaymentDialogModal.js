import { useEffect, useState } from 'react';
import DialogModal from '../Components/DialogModal';
import StaticAlert from '../Components/StaticAlert';
import usePaymentQueryParams from './usePaymentQueryParams';
import { PAYMENT_STATE } from '../Constants/System';
import { paymentLabels } from '../../StaticData/Payment';

export default function usePaymentDialogModal(
  isOpen,
  onCloseDialog,
  modalLabels = { success: '', error: '', unknown: '' },
  paySubscriptionServiceResult,
) {
  const [modalContent, setModalContent] = useState({ title: '', text: '', paperStyles: {} });

  const paymentParams = usePaymentQueryParams();

  useEffect(() => {
    const { paymentId, status } = paymentParams;

    const wasPaymentOk = status === PAYMENT_STATE.SUCCESS;

    const alertProps = wasPaymentOk ? { severity: 'success' } : { severity: 'error' };

    const paperStyles = { backgroundColor: wasPaymentOk ? '#2e7d32' : '#d32f2f', color: '#fff' };

    let alertLabel;

    if (paySubscriptionServiceResult === false) {
      alertLabel = paymentLabels['payment.unknownError'];
    } else if (isOpen) {
      if (wasPaymentOk) {
        alertLabel = modalLabels.success;
      } else if (paymentId) {
        alertLabel = modalLabels.error;
      } else {
        alertLabel = modalLabels.unknown;
      }
    }

    setModalContent({
      title: !paymentId ? paymentLabels.paymentError : paymentLabels.paymentConfirmed.replace('{paymentId}', paymentId),
      text: <StaticAlert label={alertLabel} {...alertProps} />,
      paperStyles,
    });
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <DialogModal
      paperStyles={modalContent.paperStyles}
      title={modalContent.title}
      contextText={modalContent.text}
      open={isOpen}
      onCloseDialog={onCloseDialog}
      showButtons={false}
    />
  );
}

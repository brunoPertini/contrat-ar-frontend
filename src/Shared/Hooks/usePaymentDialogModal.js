import { useEffect, useState } from 'react';
import DialogModal from '../Components/DialogModal';
import StaticAlert from '../Components/StaticAlert';
import usePaymentQueryParams from './usePaymentQueryParams';
import { PAYMENT_STATE } from '../Constants/System';
import { paymentLabels } from '../../StaticData/Payment';

export default function usePaymentDialogModal(
  isOpen,
  onCloseDialog,
  modalLabels = {
    success: '', error: '', unknown: '', processed: '',
  },
  paySubscriptionServiceResult,
  storedPaymentState = null,
) {
  const [modalContent, setModalContent] = useState({ title: '', text: '', paperStyles: {} });

  const paymentParams = usePaymentQueryParams();

  useEffect(() => {
    const { paymentId } = paymentParams;

    const status = storedPaymentState ?? { paymentParams };

    const wasPaymentOk = status === PAYMENT_STATE.SUCCESS;

    const wasPaymentProcessed = status === PAYMENT_STATE.PROCESSED;

    const alertProps = wasPaymentOk || wasPaymentProcessed ? { severity: 'success' } : { severity: 'error' };

    const paperStyles = { backgroundColor: wasPaymentOk || wasPaymentProcessed ? '#2e7d32' : '#d32f2f', color: '#fff' };

    function defineAlertLabel() {
      if (!isOpen) {
        return '';
      }

      if (paySubscriptionServiceResult === false) {
        return paymentLabels['payment.unknownError'];
      }
      if (wasPaymentOk) {
        return modalLabels.success;
      }

      if (wasPaymentProcessed) {
        return modalLabels.processed;
      }

      if (paymentId) {
        return modalLabels.error;
      }

      return modalLabels.unknown;
    }

    const alertLabel = defineAlertLabel();

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

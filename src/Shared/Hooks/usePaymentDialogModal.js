import { useEffect, useState } from 'react';
import DialogModal from '../Components/DialogModal';
import StaticAlert from '../Components/StaticAlert';
import usePaymentQueryParams from './usePaymentQueryParams';
import { PAYMENT_STATE } from '../Constants/System';
import { paymentLabels } from '../../StaticData/Payment';

export default function usePaymentDialogModal(isOpen, onCloseDialog) {
  const [modalContent, setModalContent] = useState({ title: '', text: '', paperStyles: {} });

  const paymentParams = usePaymentQueryParams();

  useEffect(() => {
    const { paymentId, status } = paymentParams;

    const wasPaymentOk = status === PAYMENT_STATE.SUCCESS;

    const alertProps = wasPaymentOk ? { severity: 'success' } : { severity: 'error' };

    const paperStyles = { backgroundColor: wasPaymentOk ? '#2e7d32' : '#d32f2f', color: '#fff' };

    let alertLabel;

    if (wasPaymentOk) {
      alertLabel = paymentLabels['signup.confirmation.success'];
    } else if (paymentId) {
      alertLabel = paymentLabels['signup.confirmation.error'].replace('{paymentId}', paymentId);
    } else {
      alertLabel = paymentLabels['signup.confirmation.unknownError'].replace('{helpPayLink}', process.env.REACT_APP_SITE_URL);
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

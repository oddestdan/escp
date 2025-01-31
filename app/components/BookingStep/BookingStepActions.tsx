import { useSelector } from "react-redux";
import type { StoreBooking } from "~/store/bookingSlice";
import { BookingStep } from "~/store/bookingSlice";
import { ActionButton } from "../ActionButton/ActionButton";

export interface BookingStepActionsProps {
  onPrimaryClick?: () => void;
  hasPrimary?: boolean;
  onSecondaryClick?: () => void;
  hasSecondary?: boolean;
  disabled?: boolean;
}

export const BookingStepActions: React.FC<BookingStepActionsProps> = ({
  onPrimaryClick,
  hasPrimary,
  onSecondaryClick,
  hasSecondary,
  disabled = false,
}) => {
  const { currentStep } = useSelector((store: StoreBooking) => store.booking);

  const isLastStep = currentStep === BookingStep.Payment;

  return (
    <div
      className={`${
        isLastStep
          ? "m-0 inline-block w-1/2"
          : "my-4 flex flex-row justify-center"
      }`}
    >
      {hasSecondary && (
        <ActionButton
          // className={hasPrimary ? "mb-4" : ""}
          inverted={true}
          onClick={onSecondaryClick}
        >
          назад
        </ActionButton>
      )}
      {hasPrimary && (
        <ActionButton onClick={onPrimaryClick} disabled={disabled}>
          далі
        </ActionButton>
      )}
    </div>
  );
};

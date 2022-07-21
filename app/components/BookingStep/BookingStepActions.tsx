import { ActionButton } from "../ActionButton/ActionButton";

export interface BookingStepActionsProps {
  onPrimaryClick?: () => void;
  hasPrimary?: boolean;
  onSecondaryClick?: () => void;
  hasSecondary?: boolean;
}

export const BookingStepActions: React.FC<BookingStepActionsProps> = ({
  onPrimaryClick,
  hasPrimary,
  onSecondaryClick,
  hasSecondary,
}) => {
  return (
    <div className="my-4 flex flex-col justify-center">
      {hasSecondary && (
        <ActionButton
          className={hasPrimary ? "mb-4" : ""}
          inverted={true}
          onClick={onSecondaryClick}
        >
          назад
        </ActionButton>
      )}
      {hasPrimary && <ActionButton onClick={onPrimaryClick}>далі</ActionButton>}
    </div>
  );
};

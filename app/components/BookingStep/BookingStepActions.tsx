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
    <div className="my-4 flex justify-center">
      {hasSecondary && (
        <ActionButton
          className={hasSecondary ? "mr-4" : ""}
          inverted={true}
          onClick={onSecondaryClick}
        >
          назад
        </ActionButton>
      )}
      {hasPrimary && (
        <ActionButton
          className={hasSecondary ? "ml-4" : ""}
          onClick={onPrimaryClick}
        >
          далі
        </ActionButton>
      )}
    </div>
  );
};

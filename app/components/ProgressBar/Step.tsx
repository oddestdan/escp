import { getSafePercent } from "./ProgressBar.helper";

export interface ChildStepProps {
  completed?: boolean;
  transitionState?: string;
  index?: number;
  position?: number;
}

export interface StepProps {
  completed?: boolean;
  position?: number;
  index?: number;
  children?: ({
    index,
    completed,
    position,
  }: ChildStepProps) => React.ReactNode;
  transitionDuration?: number;
  vertical?: boolean;
}

export const Step: React.FC<StepProps> = ({ ...props }) => {
  const {
    completed,
    position = 0, // TODO: check this if any issues are caused
    index,
    children,
    transitionDuration = 300,
    vertical,
  } = props;

  const safePosition = getSafePercent(position);

  const progressionPositionProp = vertical ? "top" : "left";

  const style = {
    [progressionPositionProp]: `${safePosition}%`,
    transitionDuration: `${transitionDuration}ms`,
  };

  const verticalClass = vertical ? `XXX-progress-bar__step--vertical` : "";

  return (
    <div
      className={`XXX-progress-bar__step ${verticalClass}`}
      data-testid={`XXX-progress-bar__step`}
      style={style}
    >
      {children
        ? children({
            index,
            completed,
            position: safePosition,
          })
        : ""}
    </div>
  );
};

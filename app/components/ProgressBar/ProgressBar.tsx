import type { ReactElement, CSSProperties } from "react";
import React, { useEffect, useState } from "react";
import {
  calculateAndSetPercentage,
  getStepPosition,
  getAllStepPositions,
  getSafePercent,
} from "./ProgressBar.helper";
import { Step } from "./Step";

export const defaultFilledColor = "#262626";
export const defaultUnfilledColor = "#D4D4D4";

export interface ProgressBarProps {
  children: React.ReactNode[];
  unfilledBackground?: string;
  filledBackground?: string;
  thickness?: string;
  sidePadding?: number;
  currentStep?: number;
  vertical?: boolean;
  nextStepProgress?: boolean;
  nextStepStyleOverride?: CSSProperties;
}

/**
 * Progress Bar component shows a progress bar consisting of various steps.
 * @param {ProgressBarProps} props - children, unfilledBackground, filledBackground, height, text, sidePadding, currentStep
 * unfilledBackground - background color of complete bar
 * filledBackground - background color till completed steps
 * thickness - hight or width of the progress bar depending on the direction
 * children - Children of component
 * sidePadding - Padding around before first and after last steps
 * currentStep - index of the currently active step
 * vertical - change ProgressBar direction to vertical
 * nextStepProgress - display progress for next step
 * nextStepStyleOverride - styles for overriding default styles of the next step progress
 * @return {JSX.Element} returns Progress component
 */
export const DefaultProgressBar: React.FC<ProgressBarProps> = (props) => {
  const {
    children,
    unfilledBackground = defaultUnfilledColor,
    filledBackground = defaultFilledColor,
    thickness = "auto",
    currentStep = 0,
    sidePadding = 0,
    vertical,
    nextStepProgress,
    nextStepStyleOverride = {},
  } = props;

  const [stepPercentage, setStepPercentage] = useState(0);

  // Gets the positions of all the Step components in Progress Bar
  const stepPositions = getAllStepPositions(children.length, sidePadding);

  useEffect(() => {
    calculateAndSetPercentage(
      children.length,
      currentStep,
      sidePadding,
      setStepPercentage
    );
  }, [currentStep, sidePadding, children.length]);

  const safePercent = getSafePercent(stepPercentage);

  const lastStep = children.length - 1 === currentStep;

  const verticalClass = vertical ? `XXX-progress-bar--vertical` : "";
  const sizeProp = vertical ? "width" : "height";
  const progressionSizeProp = vertical ? "height" : "width";
  const progressionPositionProp = vertical ? "top" : "left";
  const singleStepSize = stepPositions[1];

  return (
    <div
      className={`XXX-progress-bar ${verticalClass}`}
      data-testid={`XXX-progress-bar`}
      style={{ background: unfilledBackground, [sizeProp]: thickness }}
    >
      {React.Children.map(children, (step, index) => {
        const position =
          stepPositions.length > 0
            ? stepPositions[index]
            : getStepPosition(React.Children.count(children), index);

        return React.cloneElement(step as ReactElement, {
          completed: position < safePercent,
          position,
          index: index,
          vertical,
        });
      })}

      <div
        className={`XXX-progress-bar__progression`}
        data-testid={`XXX-progress-bar__progression`}
        style={{
          background: filledBackground,
          [sizeProp]: thickness,
          [progressionSizeProp]: `${safePercent}%`,
        }}
      />
      {nextStepProgress && !lastStep && (
        <div
          className={`XXX-progress-bar__progression`}
          data-testid={`XXX-progress-bar__progression`}
          style={{
            background: filledBackground,
            [sizeProp]: thickness,
            [progressionSizeProp]: `${singleStepSize}%`,
            [progressionPositionProp]: `${safePercent}%`,
            ...nextStepStyleOverride,
          }}
        />
      )}
    </div>
  );
};

////////////////////

export interface IProgressBarProps {
  stepData: StepItemType[];
  activeIndex?: number;
  onStepClick: (index: any) => void;
}

export type StepItemType = {
  title: string;
  icon: string;
};

export const barHeight = "2px";
export const filledColor = "#262626";
export const unfilledColor = "#D4D4D4";

const ProgressBar: React.FC<IProgressBarProps> = ({ ...props }) => {
  const { stepData, activeIndex, onStepClick } = props;

  const checkmark = (
    <div className={`XXX-aoa-stepbar-item__checkmark-icon`}>✔</div>
  );

  return (
    <div className="min-w-24 mx-auto mb-16 mt-8 w-1/2">
      <DefaultProgressBar
        filledBackground={filledColor}
        unfilledBackground={unfilledColor}
        thickness={barHeight}
        currentStep={activeIndex}
      >
        {stepData.map((item, i) => (
          <Step key={i}>
            {({ index, completed }) => (
              <div
                className={`XXX-aoa-stepbar-item ${
                  index === activeIndex
                    ? "active"
                    : completed
                    ? "completed"
                    : "inactive"
                }`}
                onClick={() => onStepClick(index)}
                role="button"
                onKeyPress={() => onStepClick(index)}
              >
                {completed && checkmark}

                <div
                  className={`XXX-aoa-stepbar-item__step-icon ${
                    completed ? "" : "inverted"
                  }`}
                >
                  {item.icon}
                </div>
                <span className={`XXX-aoa-stepbar-item__step-title`}>
                  {item.title}
                </span>
              </div>
            )}
          </Step>
        ))}
      </DefaultProgressBar>
    </div>
  );
};

export default ProgressBar;

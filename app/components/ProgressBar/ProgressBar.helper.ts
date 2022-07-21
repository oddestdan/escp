/**
 * Returns step position
 * @param {number} steps - total steps
 * @param {number} stepIndex - Index of the step
 * @return {number}
 */
export function getStepPosition(steps: number, stepIndex: number): number {
  return (100 / (steps - 1)) * stepIndex;
}

/**
 * Returns a percent value within the range of 0 to 100
 * @param {number} percent - actual percent value which has to be constrain between 0 and 100
 * @return {number}
 */
export const getSafePercent = (percent: number): number => {
  return Math.min(100, Math.max(percent, 0));
};

/**
 * Creates and returns step positions array
 * @param {number} numberOfSteps -  Number of steps
 * @param {number} sidePadding - Padding around the steps
 * @return {Array<number>}
 */
export function getAllStepPositions(
  numberOfSteps: number,
  sidePadding: number
): Array<number> {
  const stepPositions: Array<number> = [];

  for (let i = 0; i < numberOfSteps; i++) {
    if (i === 0) {
      stepPositions.push(sidePadding);
    } else if (i === numberOfSteps - 1) {
      stepPositions.push(100 - sidePadding);
    } else {
      stepPositions.push(positionByIndex(numberOfSteps, sidePadding, i));
    }
  }

  return stepPositions;
}

/**
 * Returns the position of step by its index
 * @param {number} numberOfSteps -  Number of steps
 * @param {number} sidePadding - Padding around the steps
 * @param {number} index - Index of step
 * @return {number}
 */
function positionByIndex(
  numberOfSteps: number,
  sidePadding: number,
  index: number
): number {
  return ((100 - 2 * sidePadding) / (numberOfSteps - 1)) * index + sidePadding;
}

/**
 * Does calculation for setting percentage
 * @param {number} numberOfSteps -  Number of steps
 * @param {number} currentStep - Index of current step
 * @param {number} sidePadding - Padding around the steps
 * @param {function} setterFunction - function to set percentage
 * @return {void}
 */
export function calculateAndSetPercentage(
  numberOfSteps: number,
  currentStep: number,
  sidePadding: number,
  setterFunction: (percent: number) => void
) {
  if (currentStep === 0) {
    setterFunction(sidePadding);
  } else if (currentStep === numberOfSteps + 1) {
    setterFunction(100);
  } else {
    setterFunction(positionByIndex(numberOfSteps, sidePadding, currentStep));
  }
}

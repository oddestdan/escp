export interface ErrorNotificationProps {
  message: string;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
}) => {
  return (
    <div className="fixed w-full px-4 pt-4 sm:px-[15%]">
      <div className="w-full border-2 border-red-500 bg-white py-4 px-6 text-center">
        <span className="text-red-500">{message}</span>
      </div>
    </div>
  );
};

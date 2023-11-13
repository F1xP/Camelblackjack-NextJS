'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type NotificationProps = {
  timeoutId: NodeJS.Timeout;
  id: string;
  message: string;
  type: string;
};

type ToasterContextProps = {
  addNotification: (message: string, type?: string) => void;
};

const ToasterContext = createContext<ToasterContextProps | undefined>(undefined);

const Notification: React.FC<{ item: NotificationProps; onDismiss: () => void }> = ({ item, onDismiss }) => {
  return (
    <div className="bg-secondary text-lg font-sans px-4 py-3 rounded-md relative">
      <svg
        onClick={onDismiss}
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="25px"
        height="25px"
        viewBox="0 0 121.31 122.876"
        enableBackground="new 0 0 121.31 122.876"
        className="fill-accent hover:bg-secondary p-1 rounded-md cursor-pointer transition-all duration-300 hover:fill-text mb-1 self-end absolute right-1 top-1">
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M90.914,5.296c6.927-7.034,18.188-7.065,25.154-0.068 c6.961,6.995,6.991,18.369,0.068,25.397L85.743,61.452l30.425,30.855c6.866,6.978,6.773,18.28-0.208,25.247 c-6.983,6.964-18.21,6.946-25.074-0.031L60.669,86.881L30.395,117.58c-6.927,7.034-18.188,7.065-25.154,0.068 c-6.961-6.995-6.992-18.369-0.068-25.397l30.393-30.827L5.142,30.568c-6.867-6.978-6.773-18.28,0.208-25.247 c6.983-6.963,18.21-6.946,25.074,0.031l30.217,30.643L90.914,5.296L90.914,5.296z"
          />
        </g>
      </svg>
      <p className="font-bold text-text">{item.type}</p>
      <p className="font-sembiold text-text break-words">{item.message}</p>
    </div>
  );
};

export const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (message: string, type = 'Info'): void => {
    const newNotification: NotificationProps = {
      id: Math.random().toString(36).substring(2, 12),
      message,
      type,
      timeoutId: setTimeout(() => {
        removeNotification(newNotification.id);
      }, 150000),
    };

    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
  };

  const removeNotification = (id: string): void =>
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));

  useEffect(() => {
    return () => {
      notifications.forEach((notification) => {
        clearTimeout(notification.timeoutId);
      });
    };
  }, [notifications]);

  return (
    <ToasterContext.Provider value={{ addNotification }}>
      <section className="fixed top-12 right-0 p-4 w-full md:w-[340px] flex flex-col-reverse gap-1 h-[calc(100%-3rem)] overflow-auto noti">
        {notifications.map((item) => (
          <Notification
            item={item}
            key={item.id}
            onDismiss={() => removeNotification(item.id)}
          />
        ))}
      </section>
      {children}
    </ToasterContext.Provider>
  );
};

export const useToaster = (): ToasterContextProps => {
  const context = useContext(ToasterContext);
  if (!context) throw new Error('useToaster must be used within a ToasterProvider');
  return context;
};

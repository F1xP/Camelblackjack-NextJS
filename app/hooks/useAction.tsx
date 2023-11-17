'use client';
import { useState } from 'react';
import { useToast } from '../components/Toasts';

type ActionFunction = (formData: FormData) => Promise<{ message: string | null; error: string | null }>;

const useAction = (action: ActionFunction) => {
  const { addToast, removeToast, toasts } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    try {
      const actionResponse = await action(formData);
      if (actionResponse.message) addToast(actionResponse.message, 'Success');
      if (actionResponse.error) {
        addToast(actionResponse.error, 'Error');
        throw new Error('An error occurred while processing the action.');
      }
    } catch (e) {
      console.log(e);
      throw new Error('An error occurred while processing the action.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleAction };
};

export default useAction;
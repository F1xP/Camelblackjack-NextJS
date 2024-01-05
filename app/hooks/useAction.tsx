'use client';
import { useState } from 'react';
import { useToast } from '../_components/ui/Toasts';

type ActionFunction = (
  formData: FormData
) => Promise<{ message: string | null; error: string | null; state?: string | null }>;

const useAction = () => {
  const { addToast, removeToast, toasts } = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState('');

  const handleAction = async (
    action: ActionFunction,
    formData: FormData,
    successToast: boolean = true,
    errorToast: boolean = true
  ) => {
    try {
      setLoading(true);
      const actionResponse = await action(formData);
      if (actionResponse.message && successToast) addToast(actionResponse.message, 'Success');
      if (actionResponse.error && errorToast) {
        addToast(actionResponse.error, 'Error');
        throw new Error('An error occurred while processing the action.');
      }
      if (actionResponse.state) setState(actionResponse.state);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleAction, state };
};

export default useAction;

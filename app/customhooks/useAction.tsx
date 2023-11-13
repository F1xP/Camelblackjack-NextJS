import { useState } from 'react';
import { useToaster } from '../components/Toast';

type ActionFunction = (formData: FormData) => Promise<{ message: string | null; error: string | null }>;

const useAction = (action: ActionFunction) => {
  const { addNotification } = useToaster();
  const [loading, setLoading] = useState(false);

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    try {
      const actionResponse = await action(formData);
      if (actionResponse.message) addNotification(actionResponse.message, 'Success');
      if (actionResponse.error) {
        addNotification(actionResponse.error, 'Error');
        throw new Error('An error occurred while processing the action.');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleAction };
};

export default useAction;

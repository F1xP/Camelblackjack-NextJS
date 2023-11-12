import { useState } from 'react';

type ActionFunction = (formData: FormData) => Promise<{ message: string | null; error: string | null }>;

const useAction = (action: ActionFunction) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ message: string | null; error: string | null }>({
    message: null,
    error: null,
  });

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    try {
      const actionResponse = await action(formData);
      setResponse(actionResponse);
      if (actionResponse.error) throw new Error('An error occurred while processing the action.');
    } catch (e) {
      setResponse({ message: null, error: 'An error occurred while processing the action.' });
      throw new Error('An error occurred while processing the action.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, response, handleAction };
};

export default useAction;

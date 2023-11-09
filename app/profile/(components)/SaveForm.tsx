'use client';
import { updateProfile } from './actions';
import { useFormState, useFormStatus } from 'react-dom';
import { useSession } from 'next-auth/react';

export function SaveForm() {
  const { data: session } = useSession();
  const [formResponse, formAction] = useFormState<any, any>(updateProfile, null);

  return (
    <>
      <form
        action={formAction}
        className="flex flex-col gap-2 self-start">
        <label
          htmlFor="name"
          className="self-start text-text font-bold text-xl">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          defaultValue={session?.user?.name || ''}
          className="w-full max-w-md self-start font-mono p-1 text-lg border border-text font-bold text-text rounded-sm bg-secondary transition-all duration-300"
        />
        <Submit />
        {formResponse?.message && (
          <p className="text-text font-bold font-serif text-center">Success: {formResponse.message}</p>
        )}
        {formResponse?.error && (
          <p className="text-red-500 font-bold font-serif text-center">Error: {formResponse.error}</p>
        )}
      </form>
    </>
  );
}

const Submit = () => {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-text rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
      {pending ? 'SAVING...' : 'SAVE CHANGES'}
    </button>
  );
};

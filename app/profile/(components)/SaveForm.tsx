'use client';
import { updateProfile } from './actions';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useAction from '@/app/customhooks/useAction';

export function SaveForm() {
  const { data: session } = useSession();
  const { loading, response, handleAction } = useAction(updateProfile);
  const [fields, setFields] = useState({ name: session?.user?.name || '', bio: session?.user?.bio || '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await handleAction(formData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'name' && e.target.value.length >= 39) return;
    if (e.target.name === 'bio' && e.target.value.length >= 128) return;
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col self-start w-full max-w-md">
        <div className="flex flex-row">
          <label
            htmlFor="name"
            className="self-start text-text font-bold text-lg">
            Name <span className="text-red-500">*</span>
          </label>
          <p className="text-text font-bold text-lg ml-auto">{fields.name.length}/39</p>
        </div>
        <input
          value={fields.name}
          name="name"
          type="text"
          onChange={handleChange}
          className="w-full self-start font-mono p-1 mb-2 text-lg border border-text font-bold text-text rounded-sm bg-secondary transition-all duration-300"
        />

        <div className="flex flex-row">
          <label
            htmlFor="bio"
            className="self-start text-text font-bold text-lg">
            Biography
          </label>
          <p className="text-text font-bold text-lg ml-auto">0/128</p>
        </div>
        <input
          value={fields.bio}
          name="bio"
          type="text"
          onChange={handleChange}
          className="w-full max-w-md self-start font-mono p-1 mb-2 text-lg border border-text font-bold text-text rounded-sm bg-secondary transition-all duration-300"
        />
        {response?.message && (
          <p className="text-green-500 font-bold font-sans text-center mb-2">
            Success:<span className="text-text text-sm"> {response.message}</span>
          </p>
        )}
        {response?.error && (
          <p className="text-red-500 font-bold font-sans text-center mb-2">
            Error: <span className="text-text text-sm"> {response.error}</span>
          </p>
        )}
        <Submit loading={loading} />
      </form>
    </>
  );
}

const Submit: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-text rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
      {loading ? 'SAVING...' : 'SAVE CHANGES'}
    </button>
  );
};

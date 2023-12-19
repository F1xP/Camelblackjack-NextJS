'use client';
import { updateProfile } from '../_actions/actions';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useAction from '@/app/hooks/useAction';
import { Button } from '@/app/_components/Button';
import { Input } from '@/app/_components/Input';

export function SaveForm() {
  const { update, data: session } = useSession();
  const { loading, handleAction } = useAction();
  const [fields, setFields] = useState({ name: session?.user?.name || '', bio: session?.user?.bio || '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await handleAction(updateProfile, formData);
      update();
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
        className="flex flex-col self-start w-full gap-1">
        <div className="flex flex-row">
          <label
            htmlFor="name"
            className="self-start text-text font-bold text-lg">
            Name <span className="text-red-500">*</span>
          </label>
          <p className="text-text font-bold text-lg ml-auto">{fields.name.length}/39</p>
        </div>
        <Input
          type="text"
          name="name"
          placeholder="Type here"
          value={fields.name}
          onChange={handleChange}
        />
        <div className="flex flex-row">
          <label
            htmlFor="bio"
            className="self-start text-text font-bold text-lg">
            Biography
          </label>
          <p className="text-text font-bold text-lg ml-auto">0/128</p>
        </div>
        <Input
          type="text"
          name="bio"
          placeholder="Type here"
          value={fields.bio}
          onChange={handleChange}
        />
        <Button
          variant={'transparent'}
          size={'lg'}
          disabled={loading}
          type="submit"
          className="mb-2 mt-2">
          {loading ? 'SAVING...' : 'SAVE SETTINGS'}
        </Button>
      </form>
    </>
  );
}

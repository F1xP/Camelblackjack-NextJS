import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export default async function Settings() {
  const session = await getServerSession(authOptions);
  const handleSave = async (e) => {
    e.preventDefault();
  };
  return (
    <main className="flex min-h-screen flex-col items-center gap-2 justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
      <h1 className="text-5xl text-accent font-bold font-sans text-left w-full small-caps mb-8">Profile Settings</h1>
      <form onSubmit={handleSave}>
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
        <button
          type="submit"
          className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-text rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
          SAVE CHANGES
        </button>
      </form>
      <div className="flex-start flex flex-row flex-wrap w-full gap-2">
        <button className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-red-500 rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
          RESET ACCOUNT
        </button>
        <button className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-red-500 rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
          DELETE ACCOUNT
        </button>
      </div>
    </main>
  );
}

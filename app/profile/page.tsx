import { DeleteForm } from './(components)/DeleteForm';
import { ResetForm } from './(components)/ResetForm';
import { SaveForm } from './(components)/SaveForm';

export default async function Settings() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-2 justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
        <h1 className="text-5xl text-accent font-bold font-sans text-left w-full small-caps mb-8">Profile Settings</h1>
        <SaveForm />
        <div className="flex-start flex flex-row flex-wrap w-full gap-2">
          <ResetForm />
          <DeleteForm />
        </div>
      </main>
    </>
  );
}

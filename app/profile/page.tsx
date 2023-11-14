import ConfirmationForm from './(components)/ConfirmationForm';
import { SaveForm } from './(components)/SaveForm';
import { deleteProfile, resetProfile } from './(components)/actions';

export default function Settings() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-2 justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
        <h1 className="text-5xl text-accent font-bold font-sans text-left w-full small-caps mb-8">Profile Settings</h1>
        <SaveForm />
        <div className="flex-start flex flex-row flex-wrap w-full gap-2">
          <ConfirmationForm
            action={resetProfile}
            text="RESET ACCOUNT"
            modalTitle="Reset your account"
            submitText="CONFIRM"
            submitLoadingText="RESETING..."
            withSignOut={false}
          />
          <ConfirmationForm
            action={deleteProfile}
            text="DELETE ACCOUNT"
            modalTitle="Delete your account"
            submitText="CONFIRM"
            submitLoadingText="DELETING..."
            withSignOut={true}
          />
        </div>
      </main>
    </>
  );
}

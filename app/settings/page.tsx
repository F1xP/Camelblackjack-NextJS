import { Header } from '../_components/Header';
import ConfirmationForm from './_components/ConfirmationForm';
import { SaveForm } from './_components/SaveForm';
import { deleteProfile, resetProfile } from './_actions/actions';

export default function Settings() {
  return (
    <>
      <div className="self-start w-full max-w-xl">
        <Header className="mb-4">Profile Settings</Header>
        <SaveForm />
        <div className="flex-start flex flex-row gap-2">
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
      </div>
    </>
  );
}

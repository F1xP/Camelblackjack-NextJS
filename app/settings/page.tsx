import { Header } from '../_components/ui/Header';
import ConfirmationForm from './_components/ConfirmationForm';
import { SaveForm } from './_components/SaveForm';

export default function Settings() {
  return (
    <>
      <div className="self-start w-full max-w-xl">
        <Header className="mb-4">Profile Settings</Header>
        <SaveForm />
        <div className="flex-start flex flex-row gap-2">
          <ConfirmationForm
            actionName="reset"
            text="RESET ACCOUNT"
            modalTitle="Reset your account"
            submitText="CONFIRM"
            submitLoadingText="RESETING..."
            withSignOut={false}
          />
          <ConfirmationForm
            actionName="delete"
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

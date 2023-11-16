import { Header } from '../components/Header';
import ConfirmationForm from './(components)/ConfirmationForm';
import { SaveForm } from './(components)/SaveForm';
import { deleteProfile, resetProfile } from './(components)/actions';

export default function Settings() {
  return (
    <>
      <div className="self-start w-full max-w-xl">
        <Header>Profile Settings</Header>
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

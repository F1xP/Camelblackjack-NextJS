import Header from '../components/Header';
import ConfirmationForm from './(components)/ConfirmationForm';
import { SaveForm } from './(components)/SaveForm';
import { deleteProfile, resetProfile } from './(components)/actions';

export default function Settings() {
  return (
    <>
      <Header text="Profile Settings" />
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
    </>
  );
}

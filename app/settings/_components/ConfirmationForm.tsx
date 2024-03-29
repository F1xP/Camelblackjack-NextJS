'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import useAction from '@/app/hooks/useAction';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/app/_components/ui/Button';
import { Input } from '@/app/_components/ui/Input';
import { deleteProfile, resetProfile } from '../_actions/actions';

type ConfirmationFormProps = {
  actionName: string;
  text: string;
  modalTitle: string;
  submitText: string;
  submitLoadingText: string;
  withSignOut: boolean;
};

export default function ConfirmationForm({
  actionName,
  text,
  modalTitle,
  submitText,
  submitLoadingText,
  withSignOut,
}: ConfirmationFormProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { loading, handleAction } = useAction();
  const { update, data: session } = useSession();

  const action: (formData: FormData) => Promise<{ message: string | null; error: string | null }> =
    actionName === 'delete' ? deleteProfile : resetProfile;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await handleAction(action, formData);
      onClose();
      if (withSignOut) signOut({ callbackUrl: '/' });
      else update();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Button
        variant={'transparent'}
        size={'lg'}
        disabled={loading}
        type="button"
        onClick={onOpen}
        className="text-red-500 dark:text-red-500 w-full">
        {text}
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: 'py-6 max-h-screen overflow-y-auto',
          backdrop: 'bg-black/70',
          base: 'border-secondary dark:border-dark_secondary bg-background dark:bg-dark_primary text-text dark:text-dark_text max-h-screen',
          header: 'border-b-[1px] border-secondary dark:border-dark_secondary',
          footer: 'border-t-[1px] border-secondary dark:border-dark_secondary',
          closeButton: 'hover:bg-white/5 active:bg-white/50 transition-all duration-300',
        }}>
        <ModalContent>
          <>
            <form onSubmit={handleSubmit}>
              <ModalHeader>
                <h1 className="font-bold text-2xl text-accent">{modalTitle}</h1>
              </ModalHeader>
              <ModalBody>
                <label
                  htmlFor="name"
                  className="self-start text-text dark:text-dark_text font-bold text-lg select-none">
                  Enter your current name <span className="text-accent">&quot;{`${session?.user?.name}`}&quot;</span> to
                  confirm.
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Type here"
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-row gap-2 w-full">
                  <Button
                    variant={'transparent'}
                    size={'lg'}
                    disabled={loading}
                    type="submit"
                    className="flex-1">
                    {loading ? submitLoadingText : submitText}
                  </Button>
                  <Button
                    variant={'transparent'}
                    size={'lg'}
                    disabled={loading}
                    type="button"
                    onClick={onClose}
                    className="text-red-500 dark:text-red-500 flex-1">
                    CANCEL
                  </Button>
                </div>
              </ModalFooter>
            </form>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

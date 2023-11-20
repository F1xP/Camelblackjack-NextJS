'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, modal } from '@nextui-org/react';
import useAction from '@/app/hooks/useAction';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/app/components/Button';
import { Input } from '@/app/components/Input';

type ConfirmationFormProps = {
  action: (formData: FormData) => Promise<{ message: string | null; error: string | null }>;
  text: string;
  modalTitle: string;
  submitText: string;
  submitLoadingText: string;
  withSignOut: boolean;
};

export default function ConfirmationForm({
  action,
  text,
  modalTitle,
  submitText,
  submitLoadingText,
  withSignOut,
}: ConfirmationFormProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { loading, handleAction } = useAction();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await handleAction(action, formData);
      onClose();
      if (withSignOut) signOut({ callbackUrl: '/' });
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
        className="text-red-500 w-full">
        {text}
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: 'py-6',
          backdrop: 'bg-black/70',
          base: 'border-secondary bg-background dark:bg-background text-text',
          header: 'border-b-[1px] border-secondary',
          footer: 'border-t-[1px] border-secondary',
          closeButton: 'hover:bg-white/5 active:bg-white/50 transition-all duration-300',
        }}>
        <ModalContent>
          <>
            <form onSubmit={handleSubmit}>
              <ModalHeader>
                <h1 className="font-bold text-2xl">{modalTitle}</h1>
              </ModalHeader>
              <ModalBody>
                <label
                  htmlFor="name"
                  className="self-start text-text font-bold text-lg select-none">
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
                    className="text-red-500 flex-1">
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

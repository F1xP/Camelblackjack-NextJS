'use client';
import { resetProfile } from './actions';
import { useFormState, useFormStatus } from 'react-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';

export function ResetForm() {
  const [formResponse, formAction] = useFormState<any, any>(resetProfile, null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        onClick={onOpen}
        className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-red-500 rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
        RESET ACCOUNT
      </button>
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
          {(onClose) => (
            <>
              <form action={formAction}>
                <ModalHeader className="flex flex-col gap-1">Reset your account</ModalHeader>
                <ModalBody>
                  <label
                    htmlFor="name"
                    className="self-start text-text font-bold text-xl">
                    Enter your current name to confirm.
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Type here"
                    className="w-full max-w-md self-start font-mono p-1 text-lg border border-text font-bold text-text rounded-sm bg-secondary transition-all duration-300"
                  />
                </ModalBody>
                <ModalFooter>
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row w-full gap-3">
                      <button
                        onClick={onClose}
                        className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-text rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
                        CANCEL
                      </button>
                      <Submit />
                    </div>
                    {formResponse?.message && (
                      <p className="text-text font-bold font-serif text-center">Success: {formResponse.message}</p>
                    )}
                    {formResponse?.error && (
                      <p className="text-red-500 font-bold font-serif text-center">Error: {formResponse.error}</p>
                    )}
                  </div>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const Submit = () => {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-text rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
      {pending ? 'RESETTING...' : 'CONFIRM'}
    </button>
  );
};

'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import useAction from '@/app/customhooks/useAction';
import { resetProfile } from './actions';

export default function ResetForm() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { loading, handleAction } = useAction(resetProfile);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleAction(formData);
    onClose();
  };

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
          <>
            <form onSubmit={handleSubmit}>
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
                    <Submit loading={loading} />
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-red-500 rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
                      CANCEL
                    </button>
                  </div>
                </div>
              </ModalFooter>
            </form>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

const Submit: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-text rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
      {loading ? 'RESETTING...' : 'CONFIRM'}
    </button>
  );
};

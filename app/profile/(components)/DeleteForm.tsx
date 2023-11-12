'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import useAction from '@/app/customhooks/useAction';
import { deleteProfile } from './actions';
import { signOut } from 'next-auth/react';

export default function DeleteForm() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { loading, response, handleAction } = useAction(deleteProfile);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await handleAction(formData);
      signOut({ callbackUrl: '/' });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-red-500 rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
        DELETE ACCOUNT
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
              <ModalHeader className="flex flex-col gap-1">Delete your account</ModalHeader>
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
                {response?.message && (
                  <p className="text-green-500 font-bold font-sans text-center">
                    Success:<span className="text-text text-sm"> {response.message}</span>
                  </p>
                )}
                {response?.error && (
                  <p className="text-red-500 font-bold font-sans text-center">
                    Error: <span className="text-text text-sm"> {response.error}</span>
                  </p>
                )}
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
      {loading ? 'DELETING...' : 'CONFIRM'}
    </button>
  );
};

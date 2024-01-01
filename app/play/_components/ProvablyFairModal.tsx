'use client';
import React, { useRef, useState } from 'react';
import { FaCheckCircle, FaRegCopy } from 'react-icons/fa';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { Input } from '@/app/_components/ui/Input';
import useAction from '@/app/hooks/useAction';
import { updateSeedAction } from '../_actions/updateSeed';

type GameFooterProps = {
  serverSeed: string | undefined;
};

export const ProvablyFairModal: React.FC<GameFooterProps> = ({ serverSeed }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { data: session } = useSession();

  return (
    <>
      <button
        className="flex flex-row justify-center items-center hover:opacity-70 transition-all duration-250"
        onClick={onOpen}>
        <FaCheckCircle size={20} />
        <p className="ml-1 text-md font-mono font-bold">Provably Fair</p>
      </button>

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
          footer: 'border-t-[1px] border-secondary dark:border-dark_secondary w-full',
          closeButton: 'hover:bg-white/5 active:bg-white/50 transition-all duration-300',
        }}>
        <ModalContent>
          <ModalHeader>
            <h1 className="font-bold text-2xl text-accent">Provably Fair</h1>
          </ModalHeader>
          <ModalBody>
            <ServerSeed
              onClose={onClose}
              serverSeed={serverSeed}
            />
            <ClientSeed onClose={onClose} />
            <li className="list-disc">
              <strong>Current Nonce:</strong> {session?.user.nonce}
            </li>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const ServerSeed: React.FC<{ onClose: () => void; serverSeed: string | undefined }> = ({ onClose, serverSeed }) => {
  const inputRef = useRef(null);

  return (
    <li className="list-disc">
      <strong>Current Server Seed:</strong>
      <br />
      <Input
        type="text"
        value={serverSeed || 'Active Server Seed not found.'}
        variant={'transparent'}
        fontSize={'md'}
        paddingRounding={'md'}
        forwardedRef={inputRef}>
        <button
          className="bg-secondary dark:bg-dark_secondary text-text dark:text-dark_text hover:opacity-50 transition-all duration-300"
          onClick={() =>
            // Copy to clipboard
            inputRef.current && navigator.clipboard.writeText((inputRef.current as HTMLInputElement).value)
          }>
          <FaRegCopy
            size={28}
            className="p-1"
          />
        </button>
      </Input>
    </li>
  );
};

const ClientSeed: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { update, data: session } = useSession();
  const { loading, handleAction } = useAction();
  const [seed, setSeed] = useState<string | undefined>(session?.user.seed);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await handleAction(updateSeedAction, formData);
      onClose();
      update();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <li className="list-disc w-full">
      <strong>Current Client Seed:</strong>
      <br />
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          variant={'transparent'}
          fontSize={'md'}
          paddingRounding={'md'}
          name="seed">
          <button
            className="bg-secondary dark:bg-dark_secondary text-text dark:text-dark_text hover:opacity-50 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed px-1"
            type="submit"
            disabled={loading}>
            {loading ? 'Saving...' : 'Change'}
          </button>
        </Input>
      </form>
    </li>
  );
};

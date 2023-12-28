'use client';
import React from 'react';
import { BiNotepad } from 'react-icons/bi';
import { FaCheckCircle } from 'react-icons/fa';

export const GameRules: React.FC = () => {
  return (
    <section className="bg-black/30 w-full h-10 flex flex-col">
      <span className="w-full h-[3px] bg-secondary dark:bg-dark_secondary"></span>
      <div className="w-full h-10 flex items-center px-2">
        <RulesModal />
        <button className="flex flex-row justify-center items-center hover:opacity-70 transition-all duration-250">
          <FaCheckCircle size={20} />
          <p className="ml-1 text-md font-mono font-bold">Provably Fair</p>
        </button>
      </div>
    </section>
  );
};

import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react';

const RulesModal: React.FC = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        className="mr-auto flex flex-row justify-center items-center hover:opacity-70 transition-all duration-250"
        onClick={onOpen}>
        <BiNotepad size={20} />
        <p className="ml-1 text-md font-mono font-bold">Game Rules</p>
      </button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        classNames={{
          body: 'py-6',
          backdrop: 'bg-black/70',
          base: 'border-secondary dark:border-dark_secondary bg-background dark:bg-dark_primary text-text dark:text-dark_text',
          header: 'border-b-[1px] border-secondary dark:border-dark_secondary',
          footer: 'border-t-[1px] border-secondary dark:border-dark_secondary',
          closeButton: 'hover:bg-white/5 active:bg-white/50 transition-all duration-300',
        }}>
        <ModalContent>
          <ModalHeader>
            <h1 className="font-bold text-2xl text-accent">Game Rules</h1>
          </ModalHeader>
          <ModalBody>
            <ul className="px-2">
              {[
                {
                  title: 'Multiple Decks:',
                  description: 'The game uses an unlimited number of decks, keeping things dynamic.',
                },
                {
                  title: 'Insurance Option:',
                  description: 'Players can choose insurance when the dealer shows an Ace face card.',
                },
                {
                  title: 'Tie with Natural Blackjack:',
                  description: "If both the player and dealer get a natural blackjack, it's a tie.",
                },
                {
                  title: "Dealer's Blackjack Ends the Game:",
                  description: 'If the dealer has a natural blackjack, the game ends, and insurance pays out if taken.',
                },
                {
                  title: 'Single Split Allowed:',
                  description: 'Players can split their hand only once.',
                },
                {
                  title: 'Double Down Anytime:',
                  description: 'Doubling the original bet is allowed on any first two cards.',
                },
                {
                  title: 'Double Down after Split:',
                  description: 'Players can double down even after splitting.',
                },
                {
                  title: 'Dealer Stands on Soft 17:',
                  description: 'The dealer stands when holding a soft 17, adding predictability to the game.',
                },
              ].map((rule, index) => (
                <li
                  key={index}
                  className="list-disc">
                  <strong>{rule.title}</strong>
                  <br />
                  {rule.description}
                </li>
              ))}
            </ul>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

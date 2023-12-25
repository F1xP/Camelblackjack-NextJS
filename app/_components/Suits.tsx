import { BsFillSuitClubFill, BsFillSuitHeartFill, BsFillSuitDiamondFill, BsFillSuitSpadeFill } from 'react-icons/bs';

export const suitIcons = () => ({
  Clubs: {
    icon: <BsFillSuitClubFill className="w-4 h-4 md:w-6 md:h-6 xl:h-8 xl:w-8" />,
    suitColor: '#000000',
  },
  Spades: {
    icon: <BsFillSuitSpadeFill className="w-4 h-4 md:w-6 md:h-6 xl:h-8 xl:w-8" />,
    suitColor: '#000000',
  },
  Diamonds: {
    icon: <BsFillSuitDiamondFill className="w-4 h-4 md:w-6 md:h-6 xl:h-8 xl:w-8" />,
    suitColor: '#FF0000',
  },
  Hearts: {
    icon: <BsFillSuitHeartFill className="w-4 h-4 md:w-6 md:h-6 xl:h-8 xl:w-8" />,
    suitColor: '#FF0000',
  },
});

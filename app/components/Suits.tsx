import { BsFillSuitClubFill, BsFillSuitHeartFill, BsFillSuitDiamondFill, BsFillSuitSpadeFill } from 'react-icons/bs';

export const suitIcons = (size: number) => ({
  Clubs: {
    icon: <BsFillSuitClubFill size={size} />,
    color: '#000000',
  },
  Spades: {
    icon: <BsFillSuitSpadeFill size={size} />,
    color: '#000000',
  },
  Diamonds: {
    icon: <BsFillSuitDiamondFill size={size} />,
    color: '#FF0000',
  },
  Hearts: {
    icon: <BsFillSuitHeartFill size={size} />,
    color: '#FF0000',
  },
});

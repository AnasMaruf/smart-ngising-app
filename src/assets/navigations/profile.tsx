import Svg, { Path } from "react-native-svg";

type ProfileIconProps = {
  color: string;
};

export const ProfileIcon = ({ color }: ProfileIconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.9925 20.9917V18.9925C18.9925 17.9321 18.5713 16.915 17.8214 16.1652C17.0716 15.4153 16.0545 14.9941 14.9941 14.9941H8.99647C7.93602 14.9941 6.91901 15.4153 6.16916 16.1652C5.41931 16.915 4.99805 17.9321 4.99805 18.9925V20.9917"
      stroke={color}
      strokeWidth={1.99921}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.9952 10.9957C14.2035 10.9957 15.9937 9.20553 15.9937 6.99726C15.9937 4.78899 14.2035 2.99884 11.9952 2.99884C9.78698 2.99884 7.99683 4.78899 7.99683 6.99726C7.99683 9.20553 9.78698 10.9957 11.9952 10.9957Z"
      stroke={color}
      strokeWidth={1.99921}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

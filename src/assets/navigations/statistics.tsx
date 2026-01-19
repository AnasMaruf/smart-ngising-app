import Svg, { Path } from "react-native-svg";

type StatisticIconProps = {
  color: string;
};

export const StatisticsIcon = ({ color }: StatisticIconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M2.99878 2.99884V18.9925C2.99878 19.5228 3.20941 20.0313 3.58433 20.4062C3.95926 20.7811 4.46777 20.9917 4.99799 20.9917H20.9917"
      stroke={color}
      strokeWidth={1.99921}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.9929 16.9933V8.99646"
      stroke={color}
      strokeWidth={1.99921}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.9949 16.9933V4.99805"
      stroke={color}
      strokeWidth={1.99921}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.99683 16.9933V13.9945"
      stroke={color}
      strokeWidth={1.99921}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

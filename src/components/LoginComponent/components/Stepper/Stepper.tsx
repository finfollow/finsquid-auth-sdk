import { Grid, StepProps, Steps, StepsProps } from "antd";
import "./styles.css";

type Props = StepsProps & {
  containerStyles?: React.CSSProperties;
};

export default function Stepper({ containerStyles, ...props }: Props) {
  const { md } = Grid.useBreakpoint();
  return (
    <div
      style={{ display: "flex", justifyContent: "center", ...containerStyles }}
    >
      <Steps
        type={md ? "default" : "inline"}
        progressDot
        className="bank-login-stepper"
        {...props}
      />
    </div>
  );
}

import { Grid, Steps, StepsProps } from "antd";

type Props = StepsProps & {
  containerStyles?: React.CSSProperties;
};

export default function Stepper({ containerStyles, ...props }: Props) {
  const { xs } = Grid.useBreakpoint();
  console.log("Grid.useBreakpoint(); ", Grid.useBreakpoint());
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 3,
        ...containerStyles,
      }}
    >
      <Steps
        type={xs ? "inline" : "default"}
        progressDot
        className="bank-login-stepper"
        {...props}
      />
    </div>
  );
}

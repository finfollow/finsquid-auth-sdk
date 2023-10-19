import React from "react";
import { StepsProps, Typography, theme } from "antd";
import "./styles.css";

type Props = StepsProps & {
  containerStyles?: React.CSSProperties;
};

const Stepper: React.FC<Props> = ({ current = 0, items, containerStyles }) => {
  const { token } = theme.useToken();
  const activeColor = token.colorPrimary;
  const inactiveColor = token.colorBgContainerDisabled;

  return (
    <div className="stepper" style={containerStyles}>
      {items?.map((step, index) => {
        const isActive = current >= index;

        return (
          <div
            key={index}
            className={`step ${isActive ? "active" : ""}`}
            style={{ width: `${100 / items?.length}%` }}
          >
            <div
              className="step-dot"
              style={{
                borderColor: isActive ? activeColor : inactiveColor,
              }}
            />
            {index < items?.length - 1 && (
              <div
                className={"wiring-line"}
                style={{
                  background: current > index ? activeColor : inactiveColor,
                }}
              />
            )}
            <div className="step-label">
              <Typography.Text style={{ fontSize: 12 }}>
                <b>{step.title}</b>
              </Typography.Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;

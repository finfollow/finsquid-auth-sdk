import { useState } from "react";
import { StepT, steps } from "./constants";
import SelectProvider from "./components/SelectProvider";
import LoginOptions from "./components/LoginOptions";
import Wrapper from "./components/Wrapper";
import ConnectViaSSN from "./components/ConnectViaSSN";
import ScanQrCode from "./components/ScanQrCode";
import SuccessConnect from "./components/SuccessConnect";
import WaitingConnection from "./components/WaitingConnection";
import SelectUserAccount from "./components/SelectUserAccount";
import SelectAccount from "./components/SelectAccount";
import SelectPositions from "./components/SelectPositions";
import SelectReceivingAccount from "./components/SelectReceivingAccount";
import TransactionSummary from "./components/TransactionSummary";
import OpenBankID from "./components/OpenBankID";
import FinalResult from "./components/FinalResult";

type Props = {
  type: LoginComponentType;
  radioBtns?: boolean;
};

export type LoginComponentType = "connect" | "transfer";

export default function ConnectAccount({ type, radioBtns }: Props) {
  const [step, setStep] = useState<StepT>(steps.selectProvider);

  const nextStep: React.Dispatch<React.SetStateAction<StepT>> = (_step) => {
    window.scrollTo(0, 0);
    setStep(_step);
  };

  return (
    <Wrapper
      currentStep={type === "transfer" ? step.wrapperStep : undefined}
      onBack={
        step.prevStep
          ? () => step.prevStep && nextStep(steps[step.prevStep])
          : undefined
      }
    >
      {step.value === "selectProvider" && (
        <SelectProvider
          onSubmit={() => nextStep(steps.loginOptions)}
          radioBtns={radioBtns}
        />
      )}
      {step.value === "loginOptions" && (
        <LoginOptions setNextStep={(step) => nextStep(step)} />
      )}
      {step.value === "provideSSN" && <ConnectViaSSN setNextStep={nextStep} />}
      {step.value === "openBankID" && (
        <OpenBankID onSuccess={() => nextStep(steps.waitingConnection)} />
      )}
      {step.value === "waitingConnection" && (
        <WaitingConnection
          onSuccess={() => nextStep(steps.selectUserAccount)}
          onRetry={() => nextStep(steps.openBankID)}
          onCancel={() => step.prevStep && nextStep(steps[step.prevStep])}
        />
      )}
      {step.value === "scanQRcode" && (
        <ScanQrCode
          setNextStep={nextStep}
          onSuccess={() => nextStep(steps.selectUserAccount)}
          onCancel={() => step.prevStep && nextStep(steps[step.prevStep])}
        />
      )}
      {step.value === "selectUserAccount" && (
        <SelectUserAccount onSuccess={() => nextStep(steps.successConnect)} />
      )}
      {step.value === "successConnect" && (
        <SuccessConnect
          onSubmit={
            type === "transfer"
              ? () => nextStep(steps.selectAccount)
              : undefined
          }
          onBack={() => step.prevStep && nextStep(steps[step.prevStep])}
        />
      )}
      {step.value === "selectAccount" && (
        <SelectAccount
          onSubmit={() => nextStep(steps.selectPositions)}
          radioBtns={radioBtns}
        />
      )}
      {step.value === "selectPositions" && (
        <SelectPositions
          onSubmit={() => nextStep(steps.selectReceivingAccount)}
        />
      )}
      {step.value === "selectReceivingAccount" && (
        <SelectReceivingAccount
          onSubmit={() => nextStep(steps.transactionSummary)}
        />
      )}
      {step.value === "transactionSummary" && (
        <TransactionSummary onSubmit={() => setStep(steps.finalResult)} />
      )}
      {step.value === "finalResult" && (
        <FinalResult onSubmit={() => setStep(steps.selectProvider)} />
      )}
    </Wrapper>
  );
}

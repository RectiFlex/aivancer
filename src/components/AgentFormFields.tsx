import { UseFormReturn } from "react-hook-form";
import BasicInfoFields from "./agent-form/BasicInfoFields";
import ModelFields from "./agent-form/ModelFields";
import PersonalityFields from "./agent-form/PersonalityFields";

interface AgentFormFieldsProps {
  form: UseFormReturn<any>;
  currentStep: number;
}

const AgentFormFields = ({ form, currentStep }: AgentFormFieldsProps) => {
  if (currentStep === 0) {
    return <BasicInfoFields form={form} />;
  }

  if (currentStep === 1) {
    return <ModelFields form={form} />;
  }

  if (currentStep === 2) {
    return <PersonalityFields form={form} />;
  }

  return null;
};

export default AgentFormFields;
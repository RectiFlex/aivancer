import { UseFormReturn } from "react-hook-form";
import BasicInfoFields from "./agent-form/BasicInfoFields";
import ModelFields from "./agent-form/ModelFields";
import PersonalityFields from "./agent-form/PersonalityFields";

interface AgentFormFieldsProps {
  form: UseFormReturn<any>;
  currentStep: number;
}

const AgentFormFields = ({ form, currentStep }: AgentFormFieldsProps) => {
  const getCurrentStepFields = () => {
    const fields: string[] = [];
    switch (currentStep) {
      case 0:
        fields.push("name", "bio", "clients");
        break;
      case 1:
        fields.push("modelProvider", "settings.model", "settings.embeddingModel", "settings.voice.model");
        break;
      case 2:
        fields.push("lore", "topics", "adjectives");
        break;
    }
    return fields;
  };

  // Trigger validation for current step fields
  const validateCurrentStep = async () => {
    const fields = getCurrentStepFields();
    const result = await form.trigger(fields as any);
    return result;
  };

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
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CreateAgent = () => {
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    model: "",
    personality: {
      background: "",
      traits: [],
      style: "",
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    toast({
      title: "Agent Created",
      description: "Your agent has been created successfully!",
    });
    navigate("/agents");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent Name</label>
              <Input
                placeholder="Enter agent name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe your agent's purpose"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Base Model</label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="custom">Custom Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Story</label>
              <Textarea
                placeholder="Define your agent's background"
                value={formData.personality.background}
                onChange={(e) => setFormData({
                  ...formData,
                  personality: { ...formData.personality, background: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Communication Style</label>
              <Select
                value={formData.personality.style}
                onValueChange={(value) => setFormData({
                  ...formData,
                  personality: { ...formData.personality, style: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8 animate-fadeIn">
      <Card className="max-w-2xl mx-auto p-6 glass-card">
        <h1 className="text-3xl font-bold mb-6">
          {template ? `Create ${template.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : "Create New Agent"}
        </h1>
        
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2].map((stepNumber) => (
              <Button
                key={stepNumber}
                variant={step === stepNumber ? "default" : "outline"}
                onClick={() => setStep(stepNumber)}
                className="w-full mx-2"
              >
                Step {stepNumber}
              </Button>
            ))}
          </div>
          <div className="h-2 bg-secondary rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            )}
            {step < 2 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="ml-auto"
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Create Agent
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateAgent;
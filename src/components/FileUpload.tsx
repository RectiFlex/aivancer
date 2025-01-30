import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  agentId: string;
  onUploadComplete?: (filePath: string) => void;
}

const FileUpload = ({ agentId, onUploadComplete }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${agentId}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('agent-files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('agent_files')
        .insert({
          agent_id: agentId,
          file_name: selectedFile.name,
          file_path: filePath,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      setSelectedFile(null);
      onUploadComplete?.(filePath);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          Select File
        </Button>
        <input
          id="file-upload"
          type="file"I'll help you implement the file upload feature in the agent creation form. Let's add the ability to upload and manage files during agent creation.

<lov-code>
First, let's create a new component for file uploads:

<lov-write file_path="src/components/FileUploadField.tsx">
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

interface FileUploadFieldProps {
  onFileUpload: (fileData: { path: string; name: string }) => void;
  agentId?: string;
}

const FileUploadField = ({ onFileUpload, agentId }: FileUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('agent-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('agent_files').insert({
        agent_id: agentId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      });

      if (dbError) throw dbError;

      onFileUpload({ path: filePath, name: file.name });
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="flex-1"
        />
        {isUploading && (
          <Button variant="ghost" size="icon" disabled>
            <Upload className="h-4 w-4 animate-bounce" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUploadField;
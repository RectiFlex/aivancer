import LoadingFallback from "@/components/LoadingFallback";

interface DeploymentStatusProps {
  status: 'idle' | 'creating' | 'deploying' | 'completed' | 'error';
}

const DeploymentStatus = ({ status }: DeploymentStatusProps) => {
  const getMessage = () => {
    switch (status) {
      case 'creating':
        return 'Creating agent...';
      case 'deploying':
        return 'Deploying agent...';
      case 'completed':
        return 'Agent deployed successfully!';
      case 'error':
        return 'Error deploying agent';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingFallback />
      <p className="mt-4 text-lg font-medium">{getMessage()}</p>
    </div>
  );
};

export default DeploymentStatus;
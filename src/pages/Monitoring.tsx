import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const mockData = [
  { time: '00:00', requests: 30 },
  { time: '04:00', requests: 45 },
  { time: '08:00', requests: 75 },
  { time: '12:00', requests: 100 },
  { time: '16:00', requests: 85 },
  { time: '20:00', requests: 55 },
];

const Monitoring = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Monitoring</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-2">Total Requests</h3>
                <p className="text-3xl font-bold text-primary">1,234</p>
              </Card>
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-2">Average Response Time</h3>
                <p className="text-3xl font-bold text-primary">245ms</p>
              </Card>
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                <p className="text-3xl font-bold text-primary">98.5%</p>
              </Card>
            </div>

            <Card className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-6">Request Volume</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Monitoring;
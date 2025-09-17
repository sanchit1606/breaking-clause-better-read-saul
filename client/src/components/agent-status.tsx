import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAgentStatus } from "@/lib/api";
import { AgentStatus as AgentStatusType } from "@shared/schema";

const statusColors = {
  active: "bg-accent text-accent-foreground animate-pulse-soft",
  ready: "bg-accent text-accent-foreground",
  standby: "bg-secondary text-secondary-foreground",
  error: "bg-destructive text-destructive-foreground"
};

export function AgentStatus() {
  const { data: agents, isLoading } = useQuery<AgentStatusType[]>({
    queryKey: ["/api/agents/status"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm" data-testid="agent-status-loading">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-1/2 mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default agents if no data is available
  const defaultAgents: AgentStatusType[] = [
    { name: "Doc Simplifier", status: "active" },
    { name: "Q&A Agent", status: "ready" },
    { name: "Translation Agent", status: "standby" },
    { name: "TTS Agent", status: "standby" }
  ];

  const agentList = agents || defaultAgents;

  return (
    <Card className="shadow-sm" data-testid="agent-status">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">AI Agent Status</h3>
        <div className="space-y-3" data-testid="agents-list">
          {(agentList as AgentStatusType[]).map((agent: AgentStatusType, index: number) => (
            <div 
              key={agent.name}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
              data-testid={`agent-${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' 
                      ? 'bg-accent animate-pulse-soft' 
                      : agent.status === 'ready'
                      ? 'bg-accent'
                      : agent.status === 'error'
                      ? 'bg-destructive'
                      : 'bg-secondary'
                  }`}
                  data-testid={`status-indicator-${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <span 
                  className="text-sm font-medium text-foreground"
                  data-testid={`agent-name-${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {agent.name}
                </span>
              </div>
              <Badge 
                variant="outline"
                className={statusColors[agent.status]}
                data-testid={`agent-status-badge-${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

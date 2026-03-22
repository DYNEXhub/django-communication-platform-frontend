"use client";

import { useEffect, useState } from "react";
import { Users, GitBranch, Megaphone, Mail } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { StatCard } from "@/components/metrics/stat-card";
import { ChartCard } from "@/components/metrics/chart-card";
import { apiClient } from "@/lib/api/client";

interface DashboardStats {
  total_contacts: number;
  active_deals: number;
  total_deal_value: number;
  campaigns_sent: number;
  open_rate: number;
  pipeline_by_stage: Array<{
    name: string;
    color: string;
    deal_count: number;
    total_value: number;
  }>;
  contacts_by_month: Array<{
    month: string;
    count: number;
  }>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<DashboardStats>("/dashboard/stats/")
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[120px] animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your communication platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={formatNumber(stats?.total_contacts ?? 0)}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Active Deals"
          value={formatNumber(stats?.active_deals ?? 0)}
          icon={<GitBranch className="h-4 w-4" />}
        />
        <StatCard
          title="Deal Value"
          value={formatCurrency(stats?.total_deal_value ?? 0)}
          icon={<Megaphone className="h-4 w-4" />}
        />
        <StatCard
          title="Open Rate"
          value={`${stats?.open_rate ?? 0}%`}
          icon={<Mail className="h-4 w-4" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Contacts Over Time"
          description="Contact growth by month"
        >
          <div className="h-[300px]">
            {stats?.contacts_by_month && stats.contacts_by_month.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.contacts_by_month}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    dot={{ fill: "#C9A84C" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No data yet
              </div>
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Deal Pipeline"
          description="Active deals by pipeline stage"
        >
          <div className="h-[300px]">
            {stats?.pipeline_by_stage &&
            stats.pipeline_by_stage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.pipeline_by_stage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Value",
                    ]}
                  />
                  <Bar dataKey="total_value" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No pipeline data yet
              </div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

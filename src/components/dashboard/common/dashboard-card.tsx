import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface DashboardCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  iconColor?: string
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-muted-foreground"
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold pb-2">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
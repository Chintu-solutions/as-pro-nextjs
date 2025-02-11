import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";

const activities = [
  {
    user: "Sarah Wilson",
    action: "added a new website",
    time: "2 minutes ago",
    avatar: "SW",
  },
  {
    user: "Michael Chen",
    action: "reached payout threshold",
    time: "5 minutes ago",
    avatar: "MC",
  },
  {
    user: "Emma Davis",
    action: "updated ad placements",
    time: "10 minutes ago",
    avatar: "ED",
  },
  {
    user: "James Miller",
    action: "joined as publisher",
    time: "15 minutes ago",
    avatar: "JM",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
}
import { getInitials, getAvatarColor } from "@/utils/formatters";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
  lg: "w-14 h-14 text-lg",
};

export const UserAvatar = ({ name, size = "md", className = "" }: UserAvatarProps) => (
  <div className={`rounded-full bg-gradient-to-br ${getAvatarColor(name)} flex items-center justify-center font-semibold text-primary-foreground ${sizes[size]} ${className}`}>
    {getInitials(name)}
  </div>
);

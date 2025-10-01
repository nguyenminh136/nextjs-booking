import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

export type IconName = keyof typeof LucideIcons;

interface DynamicIconProps extends LucideProps {
  name: IconName;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = LucideIcons[name] as React.FC<LucideProps>;
  if (!IconComponent) return null; // fallback
  return <IconComponent {...props} />;
};

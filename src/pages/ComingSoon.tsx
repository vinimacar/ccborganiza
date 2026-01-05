import { MainLayout } from "@/components/layout/MainLayout";
import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <MainLayout>
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Construction className="text-primary" size={48} />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground text-center max-w-md">{description}</p>
        <p className="text-sm text-muted-foreground mt-4">Em breve disponível!</p>
      </div>
    </MainLayout>
  );
}

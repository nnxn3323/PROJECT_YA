import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  label: string;
  title: string;
  description?: string;
};

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-3 pt-2">
      <Badge className="w-fit">{label}</Badge>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}

import Image from 'next/image';

interface EmptyProps {
  label: string;
}

export const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-52 w-52">
        <Image fill src="/empty.png" alt="Empty" />
      </div>
      <p className="text-sm text-center text-muted-foreground">{label}</p>
    </div>
  );
};

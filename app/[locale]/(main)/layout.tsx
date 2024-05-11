import { Toaster } from "sonner";

interface Props {
  hero: React.ReactNode;
  panel: React.ReactNode;
}

export default function Layout({ hero, panel }: Props) {
  return (
    <>
      <Toaster toastOptions={{ duration: 5000 }} />
      {hero}
      {panel}
    </>
  );
}

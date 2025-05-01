import Spinner from "@/components/Spinner";

export default function loadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-5">
      <Spinner size="lg" /> <span>Cargando...</span>
    </div>
  );
}

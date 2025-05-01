// Definición de la interfaz para las ventas
interface Sale {
  id: number;
  amount: number;
  date: string;
}

// Definición de la interfaz para las propiedades de MetricCard
interface MetricCardProps {
  saleData: Sale[];
  title: string;
  value: string;
  isError?: boolean;
}

// Componente para mostrar una tarjeta métrica
function MetricCard({ title, value, isError }: Readonly<MetricCardProps>) {
  return (
    <div className="bg-white rounded-md border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-sm font-medium ${
            isError ? "text-red-500" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <span className="text-gray-400">$</span>
      </div>
      <div className="space-y-1">
        <p
          className={`text-2xl font-bold ${
            isError ? "text-red-500" : "text-gray-900"
          }`}
        >
          {value}
        </p>
        <p className="text-sm text-gray-500">Total de Registros</p>
      </div>
    </div>
  );
}

// Componente para mostrar múltiples tarjetas métricas
export function MetricCards() {
  const saleData: Sale[] = []; // Definir saleData aquí

  return (
    <div className="grid grid-cols-6 gap-4 mb-6 mt-6">
      <MetricCard title="Registros" value={"7"} saleData={saleData} />
      <MetricCard title="Errores" value="3" isError={true} saleData={[]} />
    </div>
  );
}

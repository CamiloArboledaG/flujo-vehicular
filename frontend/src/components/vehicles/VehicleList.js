import { Search } from 'lucide-react';

const mockVehicles = [
  { id: 'LOW417', status: 'Vehículo Detenido', date: '15/11/2023, 1:39 p. m.', coverage: 5 },
  { id: 'LNY954', status: 'Vehículo Detenido', date: '15/11/2023, 1:51 p. m.', coverage: 5 },
  { id: '- SIN ASIGNAR -', status: 'Finaliza Movimiento', date: '16/11/2023, 10:42 a. m.', coverage: 5 },
  { id: 'WNS266', status: 'Vehículo Detenido', date: '28/03/2025, 7:28 a. m.', coverage: 4 },
  { id: 'WMK878', status: 'Finaliza Movimiento', date: '15/11/2023, 1:52 p. m.', coverage: 4 },
];

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-secondary rounded-lg p-4 mb-3 border border-border">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-lg">{vehicle.id}</span>
        {/* Iconos de estado aquí */}
      </div>
      <div className="text-sm mb-1">
        <p className="text-muted-foreground">
          <strong className="text-foreground">Estado:</strong> {vehicle.status}
        </p>
        <p className="text-muted-foreground">
          <strong className="text-foreground">Fecha Evento:</strong> {vehicle.date}
        </p>
        <p className="text-muted-foreground">
          <strong className="text-foreground">Cobertura:</strong> Buena ({vehicle.coverage})
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 p-2 rounded-lg border-none cursor-pointer font-semibold bg-gray-700 text-white">
          Rastrear
        </button>
        <button className="flex-1 p-2 rounded-lg border-none cursor-pointer font-semibold bg-brand text-card">
          Ver detalle
        </button>
      </div>
    </div>
  );
}

export default function VehicleList() {
  return (
    <div className="w-[400px] bg-card p-6 flex flex-col border-r border-border">
      <h2 className="text-2xl font-semibold mb-4">Vehículos activos</h2>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por placa o IMEI"
          className="w-full p-2.5 pl-10 bg-secondary border border-border rounded-lg text-foreground text-base"
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        {mockVehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
      {/* Paginación aquí */}
    </div>
  );
}

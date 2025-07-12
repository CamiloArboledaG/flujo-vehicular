import { Search } from 'lucide-react';
import mockVehicles from '../../../mock.json';
import { useEffect, useState } from 'react';
import config from '../../config/config';

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-secondary rounded-lg p-4 mb-3 border border-border">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-lg">{vehicle.license_plate}</span>
        {/* Iconos de estado aquí */}
      </div>
      <div className="text-sm mb-1">
        <p className="text-muted-foreground">
          <strong className="text-foreground">Modelo:</strong> {vehicle.model}
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
  const [vehicles, setVehicles] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await fetch(`${config.URL_API}/vehicles`);
      const data = await response.json();
      setVehicles(data);
      setFilteredVehicles(data);
    };
    fetchVehicles();
  }, []);

  const handleSearch = (e) => {
    if (e.target.value === '') {
      setFilteredVehicles(vehicles);
    } else {
      const filteredVehicles = vehicles.filter((v) => v.license_plate.includes(e.target.value));
      setFilteredVehicles(filteredVehicles);
    }
    setSearchValue(e.target.value);
  };

  return (
    <div className="w-[400px] bg-card p-6 flex flex-col border-r border-border">
      <h2 className="text-2xl font-semibold mb-4">Vehículos</h2>
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Buscar por placa o IMEI"
          className="w-full p-2.5 pl-10 bg-secondary border border-border rounded-lg text-foreground text-base"
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        {filteredVehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
      {/* Paginación aquí */}
    </div>
  );
}

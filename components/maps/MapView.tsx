"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Map as MapIcon, Navigation, Locate, Loader2, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dynamic from "next/dynamic";
import { healthDataSets, HealthHeatPoint } from "./data/healthData";
import HealthDataStats from "./HealthDataStats";

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

// Interface moved outside the components
interface MapLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "hospital" | "clinic" | "pharmacy";
}

// Sample locations - in a real app, these would come from an API
const sampleLocations: MapLocation[] = [
  { 
    id: "1", 
    name: "All India Institute of Medical Sciences (AIIMS)", 
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi", 
    lat: 28.5672, 
    lng: 77.2100, 
    type: "hospital" 
  },
  { 
    id: "2", 
    name: "Apollo Hospitals", 
    address: "Sarita Vihar, Delhi Mathura Road, New Delhi", 
    lat: 28.5298, 
    lng: 77.2905, 
    type: "hospital" 
  },
  { 
    id: "3", 
    name: "Fortis Hospital", 
    address: "Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj", 
    lat: 28.5179, 
    lng: 77.1613, 
    type: "hospital" 
  },
  { 
    id: "4", 
    name: "Max Super Speciality Hospital", 
    address: "1, 2, Press Enclave Road, Saket", 
    lat: 28.5278, 
    lng: 77.2148, 
    type: "hospital" 
  },
  { 
    id: "5", 
    name: "Moolchand Medcity", 
    address: "Lala Lajpat Rai Marg, Near Defence Colony", 
    lat: 28.5685, 
    lng: 77.2380, 
    type: "clinic" 
  },
  { 
    id: "6", 
    name: "Delhi Pharmacy", 
    address: "Connaught Place, New Delhi", 
    lat: 28.6315, 
    lng: 77.2197, 
    type: "pharmacy" 
  },
];

// Dynamic import of the MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  loading: () => <Skeleton className="w-full h-[500px]" />,
  ssr: false
});

type HealthDataType = 'covid' | 'flu' | 'healthcare_access';

export function MapView() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Heat map states
  const [showHeatMap, setShowHeatMap] = useState<boolean>(false);
  const [heatMapType, setHeatMapType] = useState<HealthDataType>('covid');
  const [heatMapData, setHeatMapData] = useState<HealthHeatPoint[]>([]);
  const [heatMapGradient, setHeatMapGradient] = useState<{[key: string]: string}>(
    healthDataSets.covid.gradient
  );
  const [mapKey, setMapKey] = useState<number>(0); // Used to force re-render of map

  // Initialize heat map data on component mount
  useEffect(() => {
    // Preload all datasets to ensure they're ready when needed
    setHeatMapData(healthDataSets.covid.data);
  }, []);

  // Update the heat map data when the type changes or when heat map is toggled
  useEffect(() => {
    setHeatMapData(healthDataSets[heatMapType].data);
    setHeatMapGradient(healthDataSets[heatMapType].gradient);
    
    // Force map component to refresh when heat map is toggled or data changes
    if (showHeatMap) {
      setMapKey(prev => prev + 1);
    }
  }, [heatMapType, showHeatMap]);

  // Toggle for heat map with map refresh
  const handleHeatMapToggle = (value: boolean) => {
    setShowHeatMap(value);
    // Force map refresh when toggling to ensure heat map renders properly
    setMapKey(prev => prev + 1);
  };

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. " + error.message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  };

  // Function to handle location selection
  const handleLocationSelect = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  // Get formatted name for the current heat map type
  const getCurrentHeatMapName = () => healthDataSets[heatMapType].name;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Healthcare Locations
          </CardTitle>
          <CardDescription>
            Find hospitals, clinics, and pharmacies near you
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          {/* Heat Map Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="heat-map-toggle" 
                checked={showHeatMap} 
                onCheckedChange={handleHeatMapToggle}
              />
              <Label htmlFor="heat-map-toggle" className="cursor-pointer flex items-center gap-1">
                <Thermometer className="h-4 w-4" />
                Heat Map
              </Label>
            </div>
            
            {showHeatMap && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Badge variant="outline" className="rounded-sm px-1 font-normal">
                            {getCurrentHeatMapName()}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Health Data</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setHeatMapType('covid')}>
                          COVID-19 Cases
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setHeatMapType('flu')}>
                          Flu Cases
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setHeatMapType('healthcare_access')}>
                          Healthcare Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select health data to display</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* User Location Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={getUserLocation}
            disabled={isLocating}
            className="flex items-center gap-1"
          >
            {isLocating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Locating...
              </>
            ) : (
              <>
                <Locate className="h-4 w-4" />
                Use My Location
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px] rounded-md overflow-hidden relative">
          <MapComponent 
            key={mapKey} // Force re-render when the key changes
            locations={sampleLocations}
            userLocation={userLocation}
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            showHeatMap={showHeatMap}
            heatMapType={heatMapType}
            heatMapData={heatMapData}
            heatMapGradient={heatMapGradient}
          />
        </div>

        <div className="mt-4 space-y-4">
          {/* Health data statistics, only visible when heat map is enabled */}
          <HealthDataStats 
            dataType={heatMapType}
            data={heatMapData}
            isVisible={showHeatMap}
          />

          <h3 className="font-medium">Nearby Healthcare Facilities</h3>
          <div className="space-y-2">
            {sampleLocations.map((location) => (
              <div 
                key={location.id}
                className={`p-3 border rounded-md hover:bg-secondary/50 transition-colors cursor-pointer ${selectedLocation?.id === location.id ? 'bg-secondary/70 border-primary' : ''}`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-muted-foreground">{location.address}</div>
                <div className="text-xs text-muted-foreground mt-1 capitalize flex items-center gap-1">
                  <span>Type: {location.type}</span>
                  <Navigation className="h-3 w-3 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
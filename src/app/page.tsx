"use client"
import { useGetDummyPlaces } from "@/api";
import CategoryItem from "@/components/CategoryItem";
import Logo from "@/components/icons/Logo";
import Map from "@/components/Map";
import { useState } from "react";

import 'react-leaflet-markercluster/styles'

const categorieList = [
  { value: "Hotels & Accommodations", label : "Hôtels & hébergements"},
  { value: "Restaurants", label : "Restaurants"},
  { value: "Shoppings", label : "Shopping"},
  { value: "Arts", label : "Arts & Culture"},
  { value: "Cafes", label : "Cafés"},
]

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // const d = useGetPlaces(selectedCategories)
  const { data: places , isLoading } = useGetDummyPlaces(selectedCategories)

  const handleToggleCategory = (value: string) => {
    if(selectedCategories.includes(value)) {
      return setSelectedCategories(selectedCategories.filter((cat) => cat !== value))
    }
    setSelectedCategories([ ...selectedCategories, value])
  }

  return (
    <div className={"h-screen  flex flex-col"}>
      <div className="py-10 px-5">
        <div className="mb-7"><Logo/></div>
        <div className="flex flex-row flex-wrap gap-2 ">
          <CategoryItem 
            label={"Tous les lieux"} 
            selected={!selectedCategories.length}
            onClick={() => setSelectedCategories([])}
          /> 
          {categorieList.map(({ label, value }) => (
            <CategoryItem 
              key={value} 
              label={label} selected={selectedCategories.includes(value)}
              onClick={() => handleToggleCategory(value)}
            /> 
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Map places={places || []} loading={isLoading} />
      </div>
    </div>
  );
}

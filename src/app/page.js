"use client"

import { useState } from 'react'

// shadcn components
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// other components
import { CarouselSpinner } from '@/components/carousel-spinner';
import { ModeToggle } from "@/components/mode-toggle";
import { MapData } from "@/components/map-data";

export default function App() {
  const mapData = MapData();
  const numMaps = mapData.length;
  const [mapResult, setMapResult] = useState(Array(mapData.length));

  const [tab, setTab] = useState(mapData[0].name);
  const onTabChange = (value) => {
    console.log(value)
    setTab(value);
  }

  return (
    <main className="flex flex-col items-center p-12 font-warzone">

      <h1 className="pb-4 font-extrabold text-center text-4xl md:text-6xl">WARZONE RANDOMIZER</h1>

      <Tabs value={tab} onValueChange={onTabChange} className='w-full max-w-screen-xl'>

        {/* Selecter (mobile) */}
        <div className="flex gap-x-2">
          <div className="block md:hidden grow">
            <Select value={tab} onValueChange={onTabChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {mapData.map((map, index) => (
                    <SelectItem value={map.name} key={index}>{map.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tab list */}
          <TabsList className="hidden grow md:grid grid-flow-col grid-cols-fit w-full">
            {mapData.map((map, index) => (
              <TabsTrigger value={map.name} key={index} className="max-w-screen-md">{map.name}</TabsTrigger>
            ))}
          </TabsList>

          <ModeToggle/>
        </div>

        {/* Tab content */}

        {mapData.map((map, index) => (
          <TabsContent value={map.name} key={index}>
            <CarouselSpinner data={mapData[index].locations} value={mapResult} setValue={setMapResult} index={index} />
          </TabsContent>
        ))}

      </Tabs>

    </main>
  );
}

"use client"

import { useState } from 'react'

// shadcn components
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// other components
import { ModeToggle } from "@/components/mode-toggle"
import { MapData } from "@/components/map-data"
import { IosPickerItem } from '@/components/ui/ios-picker/ios-picker-item'

export default function App() {
  let mapData = MapData()
  const [mapResult, setMapResult] = useState(Array(mapData.length))

  const [tab, setTab] = useState(mapData[0].name)
  const onTabChange = (value) => {
    setTab(value);
  }

  return (
    <main className="flex flex-col items-center p-12 font-warzone">

      <h1 className="pb-4 font-extrabold text-center text-4xl md:text-6xl">WARZONE RANDOMIZER</h1>

      <Tabs value={tab} onValueChange={onTabChange} className='w-full max-w-screen-xl'>

        {/* Top bar */}
        <div className="flex gap-x-2">

          {/* Selecter (mobile) */}
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

          {/* Tab list (desktop) */}
          <TabsList className="hidden grow md:grid grid-flow-col grid-cols-fit w-full">
            {mapData.map((map, index) => (
              <TabsTrigger value={map.name} key={index} className="max-w-screen-md">{map.name}</TabsTrigger>
            ))}
          </TabsList>

          {/* Theme toggle */}
          <ModeToggle/>
        </div>

        {/* Tab content */}
        {mapData.map((map, index) => (
          <TabsContent value={map.name} key={index}>
            <Card>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center w-full md:max-w-lg">
                    {mapData[index].locations.length > 0  && <IosPickerItem items={mapData[index].locations} duration={40} delay={10}  />}
                    {mapData[index].locations.length == 0 && "Coming soon..."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

      </Tabs>
    </main>
  );
}

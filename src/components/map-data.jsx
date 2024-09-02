// export const MapDataVersion = 1

export const MapData = [
  {
    name: "Rebirth Island",
    locations: [
      "Boat",
      "Control Center",
      "Living Quarters",
      "Tents",
      "Stronghold",
      "Factory",
      "Headquarters",
      "Prison",
      "Harbor",
      "Industry",
      "Chemical Engineering",
      "Bioweapons Lab",
      "Flooded Bunker",
    ]
  },

  {
    name: "Fortune's Keep",
    locations: [
      "Overlook",
      "Town",
      "Graveyard",
      "Terraces",
      "Gatehouse",
      "Keep",
      "Konni Outpost",
      "Ground Zero",
      "Boat",
      "Lighthouse",
      "Winery",
      "Pier",
    ]
  },

  {
    name: "Vondel",
    locations: [
      "Castle",
      "Houses: North of Fire Dept.",
      "University Roof",
      "City Hall",
      "Central Station",
      "Mall",
      "Graveyard",
      "Market",
      "Police Station",
      "Houses: North of Market",
      "Museum",
      "Exhibit",
      "Houses: North of Zoo",
      "Stadium",
      "Castle Outskirts",
      "University Ground",
      "Fire Department",
      "Houses: South of Market",
      "Floating District",
      "Zoo",
      "Cruise Terminal",
      "Houses: East of Stadium",
    ]
  },

  {
    name: "Urzikstan",
    locations: [
      "Levin Resort",
      "Popov Power",
      "Orlov Military Base",
      "Seaport District",
      "Urzikstan Cargo",
      "Old Town",
      "Low Town",
      "Hadiqa Farms",
      "Zaravan City",
      "Zaravan Suburbs",
      "Shahin Manor",
    ]
  },
]

// function UpgradeToVersion(targetVersion, localMapData) {
//   let copy = [...localMapData]
//   switch (targetVersion) {
//     case 1:
//       // Added "John Mode Map"
//       copy.push(MapData.filter((items) => (items.name == "John Mode"))[0])
//       return copy

//     default:
//       break;
//   }
// }

// export function UpgradeMapData(localVersion, localMapData) {

//   if (localVersion > MapDataVersion) {
//     console.log("Resetting data")
//     return [MapDataVersion, [...MapData]]
//   } else {
//     let newVersion = localVersion
//     let newMapData = [...localMapData]

//     while (newVersion < MapDataVersion) {
//       newVersion += 1
//       newMapData = UpgradeToVersion(newVersion, newMapData)
//     }
//     console.log("Upgrading data")
//     return [newVersion, newMapData]
//   }
// }

 
export const GRASS = 0;
export const WATER = 1;
export const TREE = 2;
export const SAND = 3;
export const RUNWAY = 4;
export const RUNWAY_MARKING = 5;

export const LEVEL_DESIGN = `
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WWWWWWWWWWWRRMMRRWWWWWWWWWWWWW
WWWWWWWWWWWRRMMRRWWWWWWWWWWWWW
WWWWWWWWWWWRRMMRRWWWWWWWWWWWWW
WWWWWWWWWWWRRMMRRWWWWWWWWWWWWW
WWWWWWWWWWWRRMMRRWWWWWWWWWWWWW
WWWWWWTTTTTSS55SSTTTTTWWWWWWWW
WWWWWWTTTTTSSSSSSTTTTTWWWWWWWW
WWWWWWTTTTTSSSSSSTTTTTWWWWWWWW
WWWWWWTTSSSSSSSSSSSSTTWWWWWWWW
WWWWWWTTSSTTTTTTTTSSTTWWWWWWWW
WWWWWWTTSSTTTTTTTTSSTTWWWWWWWW
WWWWWWTTSSTTT44TTTSSTTWWWWWWWW
WWWWWWTTSSTTT  TTTSSTTWWWWWWWW
WWWWWWTTSSSSS  SSSSSTTWWWWWWWW
WWWWWWTTTTTTT  TTTTTTTWWWWWWWW
WWWWWWTTTTTTT  TTTTTTTWWWWWWWW
WWWWWWTTSSSSS  SSSSSTTWWWWWWWW
WWWWWWTTSSTTT33TTTSSTTWWWWWWWW
WWWWWWTTSSTTT  TTTSSTTWWWWWWWW
WWWWWWTTSSTTT  TTTSSTTWWWWWWWW
WWWWWWTTSSSSS  SSSSSTTWWWWWWWW
WWWWWWTTSSTTTTTTTTSSTTWWWWWWWW
WWWWWWTTSSTTTTTTTTSSTTWWWWWWWW
WWWWWWTTSSTTT22TTTSSTTWWWWWWWW
WWWWWWTTSSTTT  TTTSSTTWWWWWWWW
WWWWWWTTSSSSS  SSSSSTTWWWWWWWW
WWWWWWTTTTTTT  TTTTTTTWWWWWWWW
WWWWWWTTTTTTT  TTTTTTTWWWWWWWW
WWWWWWTTTTTTT11TTTSSTTWWWWWWWW
WWWWWWTTTTTTT  TTTSSTTWWWWWWWW
WWWWWWSSSSSSS  SSSSSSSWWWWWWWW
WWWWWWSSSSSSS  SSSSSSSWWWWWWWW
WWWWWWSSSSSSSPP SSSSSSWWWWWWWW
WWWWWWWWWWSSSSSSSSWWWWWWWWWWWW
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
`;

export const parseMap = () => {
  const rows = LEVEL_DESIGN.trim().split('\n');
  const height = rows.length;
  const width = rows[0].length;
  const map: number[][] = [];
  const jobs: {x: number, y: number, id: string}[] = [];
  let startPos = { x: 0, y: 0 };
  let planePos = { x: 0, y: 0 };

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const char = rows[y][x];
      let tile = GRASS;
      
      if (char === 'W') tile = WATER;
      else if (char === 'T') tile = TREE;
      else if (char === 'S') tile = SAND;
      else if (char === 'R') tile = RUNWAY;
      else if (char === 'M') tile = RUNWAY_MARKING;
      else if (char === 'P') {
          tile = SAND;
          startPos = { x, y };
      }
      
      if (['1','2','3','4','5'].includes(char)) {
         tile = SAND; 
         if (char !== ' ') {
             const num = parseInt(char);
             const jobId = `job${6 - num}`; 
             if (!jobs.find(j => j.id === jobId && Math.abs(j.x - x) < 2 && Math.abs(j.y - y) < 2)) {
                 jobs.push({ x, y, id: jobId });
             }
         }
      }
      
      if (char === 'R' && planePos.x === 0) {
          planePos = { x: x - 1, y: y }; 
      }

      row.push(tile);
    }
    map.push(row);
  }
  
  return { map, jobs, width, height, startPos, planePos };
};

export const { map: GAME_MAP, jobs: jobPositions, width: MAP_WIDTH, height: MAP_HEIGHT, startPos: INITIAL_POS, planePos: PLANE_POS } = parseMap();
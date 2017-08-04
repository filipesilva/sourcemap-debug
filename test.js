const { SourceMapConsumer, SourceMapGenerator, SourceNode } = require('source-map');
const { readFileSync, writeFileSync } = require('fs');


// Load files.
const original = readFileSync('./files/original.ts', 'utf-8');
const transpile1Content = readFileSync('./files/transpile-1.js', 'utf-8');
const transpile1Map = JSON.parse(readFileSync('./files/transpile-1.js.map', 'utf-8'));
const transpile2Content = readFileSync('./files/transpile-2.js', 'utf-8');
const transpile2Map = JSON.parse(readFileSync('./files/transpile-2.js.map', 'utf-8'));

// Validate originals.
console.log('transpile1Map valid:', validSourceMap(transpile1Content, transpile1Map));
console.log('transpile2Map valid:', validSourceMap(transpile2Content, transpile2Map));

// Create chained maps.
const chain2Into1Map = chainSourceMaps(transpile1Map, transpile2Map);
const chain1Into2Map = chainSourceMaps(transpile2Map, transpile1Map);

// Validate chained maps.
console.log('chain2Into1Map valid:', validSourceMap(transpile2Content, chain2Into1Map));
console.log('chain1Into2Map valid:', validSourceMap(transpile2Content, chain1Into2Map));

// Write chained maps to disk.
writeFileSync('./files/chain-2-into-1.js.map', JSON.stringify(chain2Into1Map));
writeFileSync('./files/chain-1-into-2.js.map', JSON.stringify(chain1Into2Map));

// Visualize these with source-map-visualization/index.html by drag and dropping transpile-2.js plus the chained map.
// This is a modified version of http://sokra.github.io/source-map-visualization/ patched with 
// https://github.com/mozilla/source-map/pull/257 (search for /** PATCH_HERE */ on bundle.js) to bypass the error.
// - transpile-2.js+chain-2-into-1.js.map will show the correct mappings.
// - transpile-2.js+chain-1-into-2.js.map will show incorrect mappings.


// Helpers.

// Test if the sourcemap can be consumed.
// Doesn't guarantee the sourcemap is good, just that it doesn't break source-map.
function validSourceMap(code, map) {
  var consumer = new SourceMapConsumer(map);
  try {
    // This will fail with `TypeError: Cannot read property 'substr' of undefined` on 
    // completely broken sourcemaps.
    // Error also seems to be thrown on some valid sourcemaps though...
    // check out https://github.com/mozilla/source-map/issues/247
    // and https://github.com/mozilla/source-map/pull/257
    // for more info about the substr error.
    SourceNode.fromStringWithSourceMap(code, consumer);
    return true;
  } catch (e) {
    if (e.message === `Cannot read property 'substr' of undefined`) {
      return false;
    }
    throw e;
  }
}

// Create a new sourcemap from sm2 back to the source of sm1.
// Simple chaining example https://github.com/mozilla/source-map/issues/216#issuecomment-150839869
function chainSourceMaps(sm1, sm2) {
  const sm2c = new SourceMapConsumer(sm2);
  const sm2g = SourceMapGenerator.fromSourceMap(sm2c);
  sm2g.applySourceMap(new SourceMapConsumer(sm1));
  return sm2g.toJSON();
}

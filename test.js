const { RawSourceMap, SourceMapConsumer, SourceMapGenerator } = require('source-map');
const { readFileSync, writeFileSync } = require('fs');


const original = readFileSync('./custom-md-icon-registry.ts');

const content = readFileSync('./custom-md-icon-registry.js');
const previousSourceMap = JSON.parse(readFileSync('./custom-md-icon-registry.js.map'));

const newContent = readFileSync('./custom-md-icon-registry.bo.js');
const intermediateSourceMap = JSON.parse(readFileSync('./custom-md-icon-registry.bo.js.map'));

const finalSourceMap = JSON.parse(readFileSync('./custom-md-icon-registry.bo.js.full.map'));



// If there's a previous sourcemap, we're an intermediate loader and we have to chain them.
// Fill in the intermediate sourcemap source as the previous sourcemap file.
intermediateSourceMap.sources = [previousSourceMap.file];
intermediateSourceMap.file = previousSourceMap.file;

// Chain the sourcemaps.
const consumer = new SourceMapConsumer(previousSourceMap);
const generator = SourceMapGenerator.fromSourceMap(consumer);
generator.applySourceMap(new SourceMapConsumer(intermediateSourceMap));
newSourceMap = JSON.stringify(generator.toJSON());

console.log(newSourceMap);
writeFileSync('./test-source-map.js.map', newSourceMap)

const consumer2 = new SourceMapConsumer(finalSourceMap);
const generator2 = SourceMapGenerator.fromSourceMap(consumer2);
newSourceMap2 = JSON.stringify(generator2.toJSON());

// console.log(content)
// console.log(JSON.stringify(previousSourceMap))
// console.log('###')
// console.log(newContent)
// console.log(JSON.stringify(intermediateSourceMap))
// console.log('###')
// console.log(newSourceMap)
// console.log('###')
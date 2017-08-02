import { RawSourceMap, SourceMapConsumer, SourceMapGenerator } from 'source-map';

intermediateSourceMap.sources = [previousSourceMap.file];
intermediateSourceMap.file = previousSourceMap.file;

// Chain the sourcemaps.
const consumer = new SourceMapConsumer(previousSourceMap);
const generator = SourceMapGenerator.fromSourceMap(consumer);
generator.applySourceMap(new SourceMapConsumer(intermediateSourceMap));
newSourceMap = JSON.stringify(generator.toJSON());



console.log(content)
console.log(JSON.stringify(previousSourceMap))
console.log('###')
console.log(newContent)
console.log(JSON.stringify(intermediateSourceMap))
console.log('###')
console.log(newSourceMap)
console.log('###')
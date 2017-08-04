const { RawSourceMap, SourceMapConsumer, SourceMapGenerator, SourceNode } = require('source-map');
const { readFileSync, writeFileSync } = require('fs');


const original = readFileSync('./custom-md-icon-registry.ts', 'utf-8');

const content = readFileSync('./custom-md-icon-registry.js', 'utf-8');
const previousSourceMap = JSON.parse(readFileSync('./custom-md-icon-registry.js.map', 'utf-8'));

const newContent = readFileSync('./custom-md-icon-registry.bo.js', 'utf-8');
const intermediateSourceMap = JSON.parse(readFileSync('./custom-md-icon-registry.bo.js.map', 'utf-8'));

const finalSourceMap = JSON.parse(readFileSync('./custom-md-icon-registry.bo.js.full.map', 'utf-8'));

// Test if the sourcemap can be consumed.
// Doesn't guarantee the sourcemap is good, just that it doesn't break source-map.
function validSourceMap(code, map){
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
    return false;
  }
}


console.log('finalSourceMap valid:', validSourceMap(newContent, finalSourceMap));
console.log('intermediateSourceMap valid:', validSourceMap(newContent, intermediateSourceMap));

// validSourceMap(newContent, finalSourceMap);


// If there's a previous sourcemap, we're an intermediate loader and we have to chain them.
// Fill in the intermediate sourcemap source as the previous sourcemap file.
// intermediateSourceMap.sources = [previousSourceMap.file];
// intermediateSourceMap.file = previousSourceMap.file;

// main chaining example https://github.com/mozilla/source-map/issues/216

// Chain the sourcemaps.
const consumer = new SourceMapConsumer(intermediateSourceMap);
const generator = SourceMapGenerator.fromSourceMap(consumer);
generator.applySourceMap(new SourceMapConsumer(previousSourceMap));
newSourceMapJson = generator.toJSON();
newSourceMap = JSON.stringify(generator.toJSON());

console.log(newSourceMapJson.file);
console.log(newSourceMapJson.sources);
// console.log(newSourceMap);
console.log('test source map valid:', validSourceMap(newContent, newSourceMapJson));
writeFileSync('./test-map.js.map', newSourceMap)


// firstSourceMap 
// var sm1 = new SourceMapConsumer(previousSourceMap);
// console.log(previousSourceMap.file);
// console.log(previousSourceMap.sources);

// // secondSourceMap 
// var sm2 = new SourceMapConsumer(intermediateSourceMap);
// console.log(intermediateSourceMap.file);
// console.log(intermediateSourceMap.sources);

// var smg = SourceMapGenerator.fromSourceMap(sm2)
// smg.applySourceMap(sm1);
// var sm3 = new SourceMapConsumer(smg.toJSON());
// console.log(sm3.file);
// console.log(sm3.sources);
// // console.log(sm3)

// var firstSourceMap = {
//   version: 3,
//   file: 'firstResult.js',
//   names: [],
//   sources: ['source.js'],
//   // sourceRoot: 'http://example.com/www/js/',
//   // mappings: 'AAAA'
//   mappings: ";;;;;;;;;;AAAA,OAAO,EAAE,cAAc,EAAE,MAAM,EAAc,MAAM,eAAe,CAAC;AACnE,OAAO,EAAE,EAAE,EAAE,MAAM,oBAAoB,CAAC;AACxC,OAAO,EAAE,cAAc,EAAE,MAAM,mBAAmB,CAAC;AACnD,OAAO,EAAE,IAAI,EAAE,MAAM,eAAe,CAAC;AACrC,OAAO,EAAE,YAAY,EAAE,MAAM,2BAA2B,CAAC;AAEzD;;;;;;;;;;;;GAYG;AACH,MAAM,CAAC,IAAM,SAAS,GAAG,IAAI,cAAc,CAAqB,UAAU,CAAC,CAAC;AAU5E;;;GAGG;AAEH;IAA0C,wCAAc;IAGtD,8BAAY,IAAU,EAAE,SAAuB,EAAqB,QAAuB;QAA3F,YACE,kBAAM,IAAI,EAAE,SAAS,CAAC,SAEvB;QALO,0BAAoB,GAAe,EAAE,CAAC;QAI5C,KAAI,CAAC,eAAe,CAAC,QAAQ,CAAC,CAAC;;IACjC,CAAC;IAED,8CAAe,GAAf,UAAgB,QAAQ,EAAE,SAAS;QACjC,EAAE,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,QAAQ,CAAC,CAAC,CAAC,CAAC;YACxC,MAAM,CAAC,EAAE,CAAC,IAAI,CAAC,oBAAoB,CAAC,QAAQ,CAAC,CAAC,SAAS,CAAC,IAAI,CAAC,CAAC,CAAC;QACjE,CAAC;QACD,MAAM,CAAC,iBAAM,eAAe,YAAC,QAAQ,EAAE,SAAS,CAAC,CAAC;IACpD,CAAC;IAEO,8CAAe,GAAvB,UAAwB,QAAuB;QAA/C,iBAOC;QANC,IAAM,GAAG,GAAG,QAAQ,CAAC,aAAa,CAAC,KAAK,CAAC,CAAC;QAC1C,QAAQ,CAAC,OAAO,CAAC,UAAA,IAAI;YACnB,mFAAmF;YACnF,GAAG,CAAC,SAAS,GAAG,IAAI,CAAC,SAAS,CAAC;YAC/B,KAAI,CAAC,oBAAoB,CAAC,IAAI,CAAC,IAAI,CAAC,GAAG,GAAG,CAAC,aAAa,CAAC,KAAK,CAAC,CAAC;QAClE,CAAC,CAAC,CAAC;IACL,CAAC;IACI,mCAAc,GAArB,cAA0B,MAAM,CAAC,CAAE,EAAE,IAAI,EAAE,IAAI,EAAE,EAAE,EAAE,IAAI,EAAE,YAAY,EAAE,EAAE,EAAE,IAAI,EAAE,IAAI,EAAE,UAAU,EAAE,CAAC,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,CAAC,SAAS,CAAC,EAAE,CAAC,EAAE,CAAE,CAAC,CAAC,CAAhJ;IAAA,2BAAC;AAAD,CAvBA,AAuBC,CAvByC,cAAc,GAuBvD"
// };
// // var firstSourceMap = previousSourceMap;

// var secondSourceMap = {
//   version: 3,
//   file: 'secondResult.js',
//   names: [],
//   sources: ['firstResult.js'],
//   // sourceRoot: 'http://example.com/www/js/',
//   // mappings: 'AAAA,CAAC,CAAC,CAAC,CAAC'
//   mappings: ";AAUA,OAAO,EAAE,cAAc,EAAE,MAAM,EAAE,MAAM,eAAe,CAAC;AACvD,OAAO,EAAE,EAAE,EAAE,MAAM,oBAAoB,CAAC;AACxC,OAAO,EAAE,cAAc,EAAE,MAAM,mBAAmB,CAAC;AACnD,OAAO,EAAE,IAAI,EAAE,MAAM,eAAe,CAAC;AACrC,OAAO,EAAE,YAAY,EAAE,MAAM,2BAA2B,CAAC;AACzD;;;;;;;;;;;;GAYG;AACH,MAAM,CAAC,IAAI,SAAS,GAAG,IAAI,cAAc,CAAC,UAAU,CAAC,CAAC;AACtD;;;GAGG;AACH,IAAI,oBAAoB,GAAG,CAAC,UAAU,MAAM;IACxC,SAAS,CAAC,oBAAoB,EAAE,MAAM,CAAC,CAAC;IACxC,8BAA8B,IAAI,EAAE,SAAS,EAAE,QAAQ;QACnD,IAAI,KAAK,GAAG,MAAM,CAAC,IAAI,CAAC,IAAI,EAAE,IAAI,EAAE,SAAS,CAAC,IAAI,IAAI,CAAC;QACvD,KAAK,CAAC,oBAAoB,GAAG,EAAE,CAAC;QAChC,KAAK,CAAC,eAAe,CAAC,QAAQ,CAAC,CAAC;QAChC,MAAM,CAAC,KAAK,CAAC;IACjB,CAAC;IACD,oBAAoB,CAAC,SAAS,CAAC,eAAe,GAAG,UAAU,QAAQ,EAAE,SAAS;QAC1E,EAAE,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,QAAQ,CAAC,CAAC,CAAC,CAAC;YACtC,MAAM,CAAC,EAAE,CAAC,IAAI,CAAC,oBAAoB,CAAC,QAAQ,CAAC,CAAC,SAAS,CAAC,IAAI,CAAC,CAAC,CAAC;QACnE,CAAC;QACD,MAAM,CAAC,MAAM,CAAC,SAAS,CAAC,eAAe,CAAC,IAAI,CAAC,IAAI,EAAE,QAAQ,EAAE,SAAS,CAAC,CAAC;IAC5E,CAAC,CAAC;IACF,oBAAoB,CAAC,SAAS,CAAC,eAAe,GAAG,UAAU,QAAQ;QAC/D,IAAI,KAAK,GAAG,IAAI,CAAC;QACjB,IAAI,GAAG,GAAG,QAAQ,CAAC,aAAa,CAAC,KAAK,CAAC,CAAC;QACxC,QAAQ,CAAC,OAAO,CAAC,UAAU,IAAI;YAC3B,mFAAmF;YACnF,GAAG,CAAC,SAAS,GAAG,IAAI,CAAC,SAAS,CAAC;YAC/B,KAAK,CAAC,oBAAoB,CAAC,IAAI,CAAC,IAAI,CAAC,GAAG,GAAG,CAAC,aAAa,CAAC,KAAK,CAAC,CAAC;QACrE,CAAC,CAAC,CAAC;IACP,CAAC,CAAC;IACF,oBAAoB,CAAC,cAAc,GAAG,cAAc,MAAM,CAAC,CAAC,EAAE,IAAI,EAAE,IAAI,EAAE,EAAE,EAAE,IAAI,EAAE,YAAY,EAAE,EAAE,EAAE,IAAI,EAAE,IAAI,EAAE,UAAU,EAAE,CAAC,EAAE,IAAI,EAAE,MAAM,EAAE,IAAI,EAAE,CAAC,SAAS,CAAC,EAAE,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;IAC1K,MAAM,CAAC,oBAAoB,CAAC;AAChC,CAAC,CAAC,cAAc,CAAC,CAAC,CAAC;AACnB,OAAO,EAAE,oBAAoB,EAAE,CAAC;AAChC,uIAAuI"
// };
// // var secondSourceMap = intermediateSourceMap;

// var sm1 = new SourceMapConsumer(firstSourceMap);
// console.log(sm1.file);
// console.log(sm1.sources);
// console.log();
// var sm2 = new SourceMapConsumer(secondSourceMap);
// console.log(sm2.file);
// console.log(sm2.sources);
// console.log();

// var smg = SourceMapGenerator.fromSourceMap(sm2)
// smg.applySourceMap(sm1);
// var sm3 = new SourceMapConsumer(smg.toJSON());
// console.log(sm3.file);
// console.log(sm3.sources);
// console.log();



// const consumer2 = new SourceMapConsumer(finalSourceMap);
// consumer2.eachMapping((m) => console.log(m))
// const generator2 = SourceMapGenerator.fromSourceMap(consumer2);
// newSourceMap2 = JSON.stringify(generator2.toJSON());

// console.log(content)
// console.log(JSON.stringify(previousSourceMap))
// console.log('###')
// console.log(newContent)
// console.log(JSON.stringify(intermediateSourceMap))
// console.log('###')
// console.log(newSourceMap)
// console.log('###')
var budo = require('budo');
var tsify = require('tsify');

budo('./examples/cancellable-counter/index.tsx', {
    live: true,             // setup live reload
    port: 8000,             // use this port
    browserify: {
        transform: tsify()   // ES6
    }
}).on('connect', function (ev) {
    console.log('Server running on %s', ev.uri);
    console.log('LiveReload running on port %s', ev.livePort);
}).on('update', function (buffer) {
    console.log('bundle - %d bytes', buffer.length);
});

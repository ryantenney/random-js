(function(undefined) {

// Create a length 624 array to store the state of the generator
var MT = [],
    index = 0,
    init = false;

// Initialize the generator from a seed
function initializeGenerator(seed) {
    MT[0] = seed;
    for (var i = 1; 624 > i; ++i) { // loop over each other element
        MT[i] = (0x6c078965 * (MT[i-1] ^ (MT[i] >> 30)) + i) & 0xffffffff;
    }
}

// Extract a tempered pseudorandom number based on the index-th value,
// calling generateNumbers() every 624 numbers
function extractNumber() {
    if (index == 0) {
        if (!init) {
            initializeGenerator(+new Date);
        }
        generateNumbers();
    }

    var y = MT[index];
    y ^= (y >> 11);
    y ^= (y <<  7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >> 18);
    index = (index + 1) % 624;
    return y / 0x80000000;
}

// Generate an array of 624 untempered numbers
function generateNumbers() {
    for (var i = 0; 624 > i; ++i) {
        var y = (MT[i] & 0x80000000) | (MT[(i+1) % 624] & 0x7fffffff);
        MT[i] = MT[(i + 397) % 624] ^ (y >> 1);
        if (y % 2 == 1) {
            MT[i] ^= 0x9908b0df;
        }
    }
}

Math.randomMT = function (ubound, flr) {
    var rnd = extractNumber();

    if (ubound != undefined) {
        rnd *= ubound;
    }

    return flr ? ~~rnd : rnd;
};

}());
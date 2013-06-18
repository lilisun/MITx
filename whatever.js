var buttons = [ 1, 2, 3, '/' ];

var translations = {
    '/': '&divide;'
};
var functions = {
    '/': insert,
    'MC': clear_memory
};

var insert = function(btn) {
    // inserts text or translation
}

var clear_memory = function() {
    //...
}


//------


// button spec = { ....

var buttons = [ // array of button specs
    { disp: '&divide;', op: '/' },
    { disp: 'MC', call: clear_memory }
];


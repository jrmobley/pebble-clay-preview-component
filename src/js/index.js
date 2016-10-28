
'use strict';

function initialize(minified, clayConfig) {
    var self = this;

    var useSunlight = self.config.sunlight !== false;
    var sunlightColorMap = {
        '000000': '000000', '000055': '001e41', '0000aa': '004387', '0000ff': '0068ca',
        '005500': '2b4a2c', '005555': '27514f', '0055aa': '16638d', '0055ff': '007dce',
        '00aa00': '5e9860', '00aa55': '5c9b72', '00aaaa': '57a5a2', '00aaff': '4cb4db',
        '00ff00': '8ee391', '00ff55': '8ee69e', '00ffaa': '8aebc0', '00ffff': '84f5f1',
        '550000': '4a161b', '550055': '482748', '5500aa': '40488a', '5500ff': '2f6bcc',
        '555500': '564e36', '555555': '545454', '5555aa': '4f6790', '5555ff': '4180d0',
        '55aa00': '759a64', '55aa55': '759d76', '55aaaa': '71a6a4', '55aaff': '69b5dd',
        '55ff00': '9ee594', '55ff55': '9de7a0', '55ffaa': '9becc2', '55ffff': '95f6f2',
        'aa0000': '99353f', 'aa0055': '983e5a', 'aa00aa': '955694', 'aa00ff': '8f74d2',
        'aa5500': '9d5b4d', 'aa5555': '9d6064', 'aa55aa': '9a7099', 'aa55ff': '9587d5',
        'aaaa00': 'afa072', 'aaaa55': 'aea382', 'aaaaaa': 'ababab', 'ffffff': 'ffffff',
        'aaaaff': 'a7bae2', 'aaff00': 'c9e89d', 'aaff55': 'c9eaa7', 'aaffaa': 'c7f0c8',
        'aaffff': 'c3f9f7', 'ff0000': 'e35462', 'ff0055': 'e25874', 'ff00aa': 'e16aa3',
        'ff00ff': 'de83dc', 'ff5500': 'e66e6b', 'ff5555': 'e6727c', 'ff55aa': 'e37fa7',
        'ff55ff': 'e194df', 'ffaa00': 'f1aa86', 'ffaa55': 'f1ad93', 'ffaaaa': 'efb5b8',
        'ffaaff': 'ecc3eb', 'ffff00': 'ffeeab', 'ffff55': 'fff1b5', 'ffffaa': 'fff6d3'
    };

    /**
     * @param {number} value
     * @returns {string}
     */
    function colorBinding(value) {
        var color = value.toString(16).toLowerCase();
        while (color.length < 6) {
            color = '0' + color;
        }
        return '#' + (useSunlight ? sunlightColorMap[color] : color);
    }

    /**
     * @param {boolean} value
     * @returns {string}
     */
    function showBlockBinding(value) {
        return value ? 'block' : 'none';
    }

    /**
     * @param {boolean} value
     * @returns {string}
     */
    function hideBlockBinding(value) {
        return value ? 'none' : 'block';
    }

    var bindingFunctions = {
        color: colorBinding,
        show: showBlockBinding,
        hide: hideBlockBinding
    };

    /**
     * @param {object} item
     * @param {object} binding
     * @returns {void}
     */
    function handleChange(item, binding) {
        var rawValue = item.get();
        var mappedValue;
        if (typeof binding.map === 'string') {
            var bindfunc = bindingFunctions[binding.map];
            if (bindfunc) {
                mappedValue = bindfunc(rawValue);
            }
        } else if (typeof binding.map === 'object') {
            var key = rawValue.toString();
            if (binding.map.hasOwnProperty(key)) {
                mappedValue = binding.map[key];
            }
        } else {
            mappedValue = rawValue;
        }

        if (mappedValue) {
            var elements = self.$element.select(binding.selector);
            elements.set(binding.set, mappedValue);
        }
    }

    clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function () {

        if (self.config.bindings) {
            self.config.bindings.forEach(function (binding) {
                var item;
                if (binding.source.startsWith('#')) {
                    var id = binding.source.slice(1);
                    item = clayConfig.getItemById(id);
                } else {
                    item = clayConfig.getItemByMessageKey(binding.source);
                }

                if (item) {
                    handleChange(item, binding);
                    item.on('change', function () {
                        handleChange(this, binding);
                    });
                }
            });
        }
    });
}

var Preview = function (template, style) {
    this.name = 'preview';
    this.template = template;
    this.style = style;
    this.manipulator = 'html';
    this.initialize = initialize;
};

module.exports = Preview;
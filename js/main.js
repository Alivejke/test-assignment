// Helpers
function extend (Parent, Child) {
    var F = function() {};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.super = Parent.prototype;
}

function getXhr (url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(this.statusText);
            }
        }

        xhr.onerror = function (xhr) {
            reject('Error');
        }

        xhr.send();
    });
}

function parseCSV (csvString) {
    var stingValuesArray = csvString.split('\r\n');
    var keysArray = stingValuesArray.shift().split(';');
    var parsedData = [];
    
    for (var i = 0; i < stingValuesArray.length; i++) {
        // Remove array element if it's empty
        if (!stingValuesArray[i]) {
            delete stingValuesArray[i];
            continue;
        }

        var valuesArray = stingValuesArray[i].split(';');
        var valuesObj = {};

        for (var j = 0; j < valuesArray.length; j++) {
            valuesObj[keysArray[j]] = valuesArray[j];
        }

        parsedData.push(valuesObj);
    }

    return parsedData;
};

function objExtend () {
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                arguments[0][key] = arguments[i][key];
            }
        }
    }
    return arguments[0];
};

function LineChart (options) {
    var settings = {};
    var defaultSettings = {
        offset: {
            top: 20,
            right: 40,
            left: 40,
            bottom: 60
        },
        labelsFont: '16px Arial',
        textColor: '#000',
        linesColor: '#C2C2C2'
    };
    objExtend(settings, defaultSettings, options);

    var ctx;
    var canvas;
    var values;
    var yPeriod;
    var yPeriodMax;
    var xMax;
    var yMax;
    var xStep;
    var yStep;

    function drawBackground (settings) {
        ctx.fillStyle = "#F1F1F1";
        ctx.fillRect(settings.offset.left, settings.offset.top, xMax, yMax);
    }

    function drawLabels (settings) {
        for (var i = 0, xPos = settings.offset.left; i < values.length; i++) {
            ctx.font = settings.labelsFont;
            ctx.fillStyle = settings.textColor;
            var xTextSize = ctx.measureText(values[i].x);
            ctx.fillText(values[i].x, xPos + (xStep - xTextSize.width) / 2, settings.height - settings.offset.bottom / (i % 2 === 0 ? 1.8 : 5));
            if (i > 0) {
                drawLine(xPos, settings.height - settings.offset.bottom, xPos, settings.height - settings.offset.bottom + 5, settings.linesColor);
            }
            xPos += xStep;
        }

        drawLine(settings.offset.left, settings.offset.top, settings.offset.left, settings.height - settings.offset.bottom + 5, settings.linesColor);
        drawLine(xPos, settings.offset.top, xPos, settings.height - settings.offset.bottom + 5, settings.linesColor);

        for (var i = 0, yPos = settings.offset.top; i <= yPeriodMax; i = i + yPeriod) {
            ctx.font = settings.labelsFont;
            ctx.fillStyle = settings.textColor;
            var yText = yPeriodMax - i;
            var yTextSize = ctx.measureText(yText);
            ctx.fillText(yText, settings.offset.left - yTextSize.width - 10, yPos + 5); // 5 and 10 are just text offsets

            drawLine(settings.offset.left, Math.round(yPos), settings.width - settings.offset.right, Math.round(yPos), settings.linesColor);

            yPos += yStep;
        }
    }

    function getXPointOffset (x) {
        return settings.offset.left + x * xStep + xStep / 2;
    }

    function getYPointOffset (y) {
        return settings.offset.top + yMax - y * yStep / yPeriod;
    }

    function drawChartLine (settings) {
        var prevX = getXPointOffset(0);
        var prevY = getYPointOffset(values[0].y);

        for (var i = 0; i < values.length; i++) {
            var newX = getXPointOffset(i);
            var newY = getYPointOffset(values[i].y);
            drawLine(prevX, prevY, newX, newY, 'blue');
            ctx.beginPath();
            ctx.arc(newX, newY, 4, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'blue';
            ctx.fill();
            prevX = newX;
            prevY = newY;
        }
    }

    function drawLine (startX, startY, endX, endY, color) {
        ctx.strokeStyle = color || settings.textColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();
    }

    function renderCanvas (settings) {
        if (canvas) {
            canvas.parentNode.removeChild(canvas);
        }
        canvas = document.createElement('canvas');
        canvas.width = settings.width;
        canvas.height = settings.height;
        settings.el.appendChild(canvas);
        return canvas.getContext('2d');
    }

    function init (options) {
        objExtend(settings, options);

        values = [];
        for (key in settings.data) {
            if (settings.data.hasOwnProperty(key)) {
                values.push({
                    x: key,
                    y: settings.data[key]
                });
            }
        }
        yPeriod = 10;
        yPeriodMax = 100;
        xMax = settings.width - settings.offset.left - settings.offset.right;
        yMax = settings.height - settings.offset.top - settings.offset.bottom;
        xStep = xMax / values.length;
        yStep = yMax / yPeriodMax * yPeriod;

        ctx = renderCanvas(settings);
        drawBackground(settings);
        drawLabels(settings);
        drawChartLine(settings);
    }

    init({});

    this.refreshCanvas = function (settings) {
        init(settings);
    }
}

// GFK Assignment BizzAppz
(function () {
    var el = document.getElementById('gfkAssignmentBizzAppzResult');
    var amount = 100;
    var result = [];

    for (var i = 1; i <= amount; i++) {
        var currentElement = '';

        if (i % 3 === 0) {
            currentElement += 'Bizz';
        }

        if (i % 5 === 0) {
            currentElement += 'Appz';
        }

        result.push(currentElement || i);
    }

    el.innerHTML = result.join(' ');
})();

// GFK Assignment prototype example
(function () {
    function Animal (options) {
        this.age = options.age;
    }

    Animal.prototype.getAge = function () {
        return this.age;
    }

    function Dog (options) {
        Dog.super.constructor.call(this, options);
        this.gender = options.gender;
    }

    extend(Animal, Dog);

    Dog.prototype.getGender = function () {
        return this.gender;
    }

    function protoExampleTpl (data) {
        var tpl = [
            '<div>Init child class instance `dog` with data:</div>',
            JSON.stringify(data),
            '<div>Child class instance `dog` instanceof `Animal`:</div>',
            dog instanceof Animal,
            '<div>Child class instance `dog` instanceof `Dog`:</div>',
            dog instanceof Dog,
            '<div>Child class instance method `dog.getAge()` result:</div>',
            dog.getAge(),
            '<div>Child class instance method `dog.getGender()` result:</div>',
            dog.getGender()
        ];

        return tpl.join('');
    }

    function renderProtoExample (options) {
        options.el.innerHTML = protoExampleTpl(options.data);
    }

    var data = {
        gender: 'male',
        age: 6
    };
    var dog = new Dog (data);
    renderProtoExample({
        el: document.getElementById('gfkAssignmentProtoResult'),
        data: data
    });
})();

// GFK Assignment chart
(function () {
    function getYesPercentageByDate(data) {
        var groupedByDate = {};
        var yesPercentageByDate = {};

        for (var i = 0; i < data.length; i++) {
            var date = data[i].DATE;
            var answer = data[i].ANSWER;

            groupedByDate[date] = groupedByDate[date] || {};
            groupedByDate[date].total = ++groupedByDate[date].total || 1;
            if (answer === 'yes') {
                groupedByDate[date].yes = ++groupedByDate[date].yes || 1;
            }
        }

        for (date in groupedByDate) {
            if (groupedByDate.hasOwnProperty(date)) {
                yesPercentageByDate[date] = groupedByDate[date].yes / groupedByDate[date].total * 100; // 100%;
            }
        }

        return yesPercentageByDate;
    }

    var el = document.getElementById('gfkAssignmentChartResult');
    var yesByDateChart;

    getXhr('/mocks/data.csv').then(function (response) {
        var parsedData = parseCSV(response);
        var chartData = getYesPercentageByDate(parsedData);
        yesByDateChart = new LineChart({
            el: el,
            data: chartData,
            width: 800,
            height: 400
        });

        return yesByDateChart;
    }).catch(function (error) {
        el.innerHTML = error + ': Because of Cross origin policy this example should be checked at server(local/remote)';
    });
})();


// GFK Assignment promise example
(function () {
    var el = document.getElementById('gfkAssignmentPromiseResult');

    /**
     * Used https insted of http becouse iframe construction to 
     * retrive redirection url would be overloaded in this example
     */
    Promise.all([
        getXhr('https://cdn.gfkdaphne.com/tests/async.php?a=1'),
        getXhr('https://cdn.gfkdaphne.com/tests/async.php?a=2')
    ]).then(function (response) {
        el.innerHTML = response.join(' ');
    }).catch(function (error) {
        el.innerHTML = error;
    });
})();
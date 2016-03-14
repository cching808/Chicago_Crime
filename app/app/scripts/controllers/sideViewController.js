
(function(options, getCrimesPerHour, getCrimeAttribute) {
    'use strict';
    angular.module('chicagoControllers')
        .controller('SideViewCtrl', ['$scope', '$http', SideViewCtrl]);

    function SideViewCtrl($scope, $http) {
        console.log('--> in SideViewCtrl');

        // Initialize the calendar
        $('input[name="daterange"]').daterangepicker(options, function(start, end, label) {
            console.log("New date range selected: " + start.format("YYYY-MM-DD") + " to " + end.format("YYYY-MM-DD") + " (predefined range: " + label + ")");
        });

        $scope.changeView = function(type) {
            if(type == 'heatmap') {
                $scope.$parent.map.removeLayer($scope.$parent.iconLayer);
                $scope.$parent.map.removeLayer($scope.$parent.heatLayer);
                $scope.$parent.heatLayer = $scope.$parent.createHeatLayer($scope.$parent.data);
                updateAreaChart();
            }
            else {
                $scope.$parent.map.removeLayer($scope.$parent.iconLayer);
                $scope.$parent.map.removeLayer($scope.$parent.heatLayer);
                $scope.$parent.iconLayer = $scope.$parent.createIconLayer($scope.$parent.data);
                updateAreaChart();
            }
        };

        var panorama;
        function loadStreetMap(lat, lng) {
            panorama = new google.maps.StreetViewPanorama(
                document.getElementById('street-view'),
                {
                    position: {lat: lat, lng: lng},
                    pov: {heading: 165, pitch: 0},
                    zoom: 1
                });
        }
        $scope.$parent.loadStreetMap = loadStreetMap;

        function formatAxes(x, y) {
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(8)
                .tickFormat(function(d, i) {
                    return moment(d).format("ha");
                });
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
            return { 
                x: xAxis,
                y: yAxis
            };
        }

        function initAreaChart(primaryType) {
            var day = '1';
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = $(window).width() * 0.3 - margin.left - margin.right;
            var height = $(window).height() * 0.3 - margin.left - margin.right;
            var data = $scope.$parent.data[day];

            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);

            var svg = d3.select('#area-chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate('+margin.left+', '+margin.top+')');
 
            // Find the number of crimes per hours
            data = getCrimesPerHour(data);

            x.domain(d3.extent(data, function(d) { return d.Date; }));
            y.domain([0, d3.max(data, function(d) { return d["Crimes Within This Hour"]; })]);

            var axes = formatAxes(x, y);

            // Create the area chart path and axes
            svg.append("path")
                .data([data])
                .attr("class", "area")
                .attr('d', getArea(data))
                .transition().duration(2500)
                .attr('d', getArea(data, 'Crimes Within This Hour'));
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(axes.x);
            svg.append("g")
                .attr("class", "y axis")
                .call(axes.y)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -50)
                .attr("y", -45)
                .attr("dy", ".71em")
                .attr("class", "y-axis-text")
                .style("text-anchor", "end")
                .text("Frequency of Total Crime");

            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 4.5);

            focus.append("foreignObject")
                .attr("x", -50)
                .attr("dy", ".35em");

            svg.append("rect")
                .attr("class", "overlay")
                .attr('width', width)
                .attr('height', height + margin.bottom)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", generateMousemove(data));

        } // end of initAreaChart
        $scope.$parent.initAreaChart = initAreaChart;

        function updateAreaChart(primaryType) {
            var day = '1';
            // Find the number of crimes per hours
            var data = getCrimesPerHour($scope.$parent.data[day]);
            var yAxisText;
            var xPos;
            if(primaryType) {
                data = _.filter(data, function(crime) {
                    return crime["Primary Type"] === primaryType;
                });

                var primaryType = primaryType.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                })
                
                yAxisText = "Frequency of "+primaryType;
                xPos = -35 + primaryType.length;
            } else {
                yAxisText = "Frequency of Total Crime";
                xPos = -50;
            }

            d3.select(".y-axis-text")
                .attr("x", xPos)
                .text(yAxisText);

            d3.select('.area')
                .data([data])
                .attr('d', getArea(data))
                .transition().duration(1500)
                .attr('d', getArea(data, 'Crimes Within This Hour'))
                .style('fill', function(d) { 
                    return primaryType ? getCrimeAttribute(primaryType.toUpperCase()).color : '#adbce6'
                })
        }
        $scope.$parent.updateAreaChart = updateAreaChart;
        
        function getArea(datum, field) {
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = $(window).width() * 0.3 - margin.left - margin.right;
            var height = $(window).height() * 0.3 - margin.left - margin.right;
            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);

            x.domain(d3.extent(datum, function(d) { return d.Date; }));
            y.domain([0, d3.max(datum, function(d) { return d["Crimes Within This Hour"]; })]);
                
            var axes = formatAxes(x, y);

            d3.select('.x.axis').call(axes.x);
            d3.select('.y.axis').call(axes.y)

            d3.select(".overlay")
                .on("mousemove", generateMousemove(datum));

            return d3.svg.area()
                .x(function(d) { return x(d.Date); })
                .y0(height)
                .y1(function(d) { return y(d[field] || 0); });
        };

      function generateMousemove(data) {
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = $(window).width() * 0.3 - margin.left - margin.right;
            var height = $(window).height() * 0.3 - margin.left - margin.right;
            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);
            x.domain(d3.extent(data, function(d) { return d.Date; }));
            y.domain([0, d3.max(data, function(d) { return d["Crimes Within This Hour"]; })]);

            return function() {
                var bisectDate = d3.bisector(function(d) { return d.Date; }).left
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
                var focus = d3.select(".focus");
                focus.attr("transform", "translate(" + x(d.Date) + "," + y(d["Crimes Within This Hour"]) + ")");
                focus.select("foreignObject").html(
                    '<div class="d3-tooltip">' +
                        '<p>' +
                            '<b>' + moment(d.Date).format('h:mm a').toString().trim() + '</b>' +
                            '<br>' +
                            d["Primary Type"].charAt(0) +
                            d["Primary Type"].toLowerCase().slice(1) +
                        '</p>' +
                    '</div>'
                );
            }
        }

        function initCalendarChart() {
                
            var width = 960,
                height = 136,
                cellSize = 17; // cell size

            // var percent = d3.format(".1%"),
            //     format = d3.time.format("%Y-%m-%d");

            var color = d3.scale.quantize()
                .domain([-.05, .05])
                .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

            var svg = d3.select("#calendar-chart").selectAll("svg")
                .data([2016])
              .enter().append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "RdYlGn")
              .append("g")
                .attr("transform", "translate(" + ((width * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

            svg.append("text")
                .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
                .style("text-anchor", "middle")
                .text(function(d) { return d; });

            var crimes = JSON.parse(JSON.stringify($scope.$parent.data));
            var arr = [];
            _(crimes).each(function(elem, key) {
                arr.push(elem);
            });

            var rect = svg.selectAll(".day")
                .data(arr)
              .enter().append("rect")
                .attr("class", "day")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function(d) {
                    return moment(d[0].Date).week() * cellSize;
                })
                .attr("y", function(d) { return +moment(d[0].Date).day() * cellSize; })
                .on('mouseover', function(e) { 
                    console.log(e.length);
                })

            rect.append("title")
                .text(function(d) { return d[0].length; });

            svg.selectAll(".month")
                .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
              .enter().append("path")
                .attr("class", "month")
                .attr("d", monthPath);

            function monthPath(t0) {
              var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                  d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
                  d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
              return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
                  + "H" + w0 * cellSize + "V" + 7 * cellSize
                  + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
                  + "H" + (w1 + 1) * cellSize + "V" + 0
                  + "H" + (w0 + 1) * cellSize + "Z";
            }

            var data = d3.nest()
                .key(function(d, i) { return d.Date; })

            rect.filter(function(d) {
                    return d in data; 
                })
                .attr("fill", "red")
                .select("title")
                .text(function(d) { return d + ": " + 5 });

        }
        $scope.$parent.initCalendarChart = initCalendarChart;
    
    }

})(util.datepickerOptions, util.getCrimesPerHour, util.getCrimeAttribute);


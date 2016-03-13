
(function(options, getCrimesPerHour) {
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
            }
            else {
                $scope.$parent.map.removeLayer($scope.$parent.iconLayer);
                $scope.$parent.map.removeLayer($scope.$parent.heatLayer);
                $scope.$parent.iconLayer = $scope.$parent.createIconLayer($scope.$parent.data);
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
            var axes = formatAxes(x, y);

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
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Crime");

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
            console.log('Updating area chart to show: '+primaryType);
            var day = '1';
            // Find the number of crimes per hours
            var data = getCrimesPerHour($scope.$parent.data[day]);
            data = _.filter(data, function(crime) {
                return crime["Primary Type"] === primaryType;
            });

            d3.select('.area')
                .data([data])
                .attr('d', getArea(data))
                .transition().duration(2500)
                .attr('d', getArea(data, 'Crimes Within This Hour'));
        }
        $scope.$parent.updateAreaChart = updateAreaChart;
        
        function getArea(datum, field) {
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = $(window).width() * 0.3 - margin.left - margin.right;
            var height = $(window).height() * 0.3 - margin.left - margin.right;
            var x = d3.time.scale().range([0, width]);
            var y = d3.scale.linear().range([height, 0]);
            var axes = formatAxes(x, y);

            x.domain(d3.extent(datum, function(d) { return d.Date; }));
            y.domain([0, d3.max(datum, function(d) { return d["Crimes Within This Hour"]; })]);
                
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
    
    }

})(util.datepickerOptions, util.getCrimesPerHour);


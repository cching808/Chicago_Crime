
(function(options) {
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

        function loadAreaChart() {
            var day = '1';
            var margin = {top: 20, right: 20, bottom: 30, left: 50};
            var width = $(window).width() * 0.3 - margin.left - margin.right;
            var height = $(window).height() * 0.3 - margin.left - margin.right;
            var crimes = $scope.$parent.data[day];

            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var area = d3.svg.area()
                .x(function(d) { return x(d.date); })
                .y0(height)
                .y1(function(d) { return y(d.close); });

            var svg = d3.select('#area-chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate('+margin.left+', '+margin.top+')');
            
            // crimes.forEach(function(d) {
            //     var dayNum = moment(data[i].Date, 'YYYY-MM-DDTHH:mm:ss').date();
            //     console.log(d.Date);
            // });

            // x.domain(d3.extent(data, function(d) { return d.hour; }));
            // y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

            d3.tsv("data/data.tsv", function(error, data) {
              if (error) throw error;

              var parseDate = d3.time.format("%d-%b-%y").parse;

              data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.close = +d.close;
              });

              x.domain(d3.extent(data, function(d) { return d.date; }));
              y.domain([0, d3.max(data, function(d) { return d.close; })]);

              svg.append("path")
                  .datum(data)
                  .attr("class", "area")
                  .attr("d", area);

              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

              svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Price ($)");
            });

        }

        $scope.$parent.loadAreaChart = loadAreaChart;
    }

})(util.datepickerOptions);


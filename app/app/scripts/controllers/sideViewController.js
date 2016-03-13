
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
            var data = $scope.$parent.data[day];

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
                .x(function(d) { return x(d.Date); })
                .y0(height)
                .y1(function(d) { return y(d["Crimes Within This Hour"]); });

            var svg = d3.select('#area-chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate('+margin.left+', '+margin.top+')');

 
            // Interval array containing tuples of crime data with their index
            var interval = [];
            var currentHour = 0;

            for(let i = 0; i < data.length; i++) {
                var hour = moment(data[i].Date, 'YYYY-MM-DDTHH:mm:ss').hour();
                
                // For the same hour, push the current crime in the interval for the hour
                if(currentHour === hour) {
                    interval.push({ index: i });
                } else {
                    // For a new hour, iterate through the interval array to assign "Crimes Within This Hour"
                    for(let j = 0; j < interval.length; j++) {
                        data[interval[j].index]["Crimes Within This Hour"] = interval.length;
                    }

                    //  Clear the interval array and push the new crime
                    interval = [];
                    interval.push({ index: i });
                }

                currentHour = hour;
                data[i].Date = moment(data[i].Date, 'YYYY-MM-DDTHH:mm:ss').toDate();
            }

            //  Iterate through the interval array to assign "Crimes Within This Hour"
            for(let j = 0; j < interval.length; j++) {
                data[interval[j].index]["Crimes Within This Hour"] = interval.length;
            }

            x.domain(d3.extent(data, function(d) { return d.Date; }));
            y.domain([0, d3.max(data, function(d) { return d["Crimes Within This Hour"]; })]);

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
                .text("Crime");

            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("circle")
                .attr("r", 4.5);

            focus.append("foreignObject")
                .attr("x", -90)
                .attr("dy", ".35em");

            svg.append("rect")
                .attr("class", "overlay")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);
                    
            function mousemove() {
                var bisectDate = d3.bisector(function(d) { return d.Date; }).left
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.Date) + "," + y(d["Crimes Within This Hour"]) + ")");
                focus.select("foreignObject").html(
                    '<div class="d3-tooltip">' +
                        '<p>' +
                            moment(d.Date).format('h:mm a').toString().trim() +
                        '</p>' +
                        '<p>' +
                            d["Primary Type"].charAt(0) +
                            d["Primary Type"].toLowerCase().slice(1) +
                        '</p>' +
                    '</div>'
                );
            }

        }

        $scope.$parent.loadAreaChart = loadAreaChart;
    }

})(util.datepickerOptions);


angular.module('ui.minicalendar',[])
    .provider('uiMiniCalendar',[function(){
        var now = new Date(),
            settings = {
            year:now.getFullYear(),
            month:now.getMonth()+1,
            date:now.getDate(),
            minDate:null,
            maxDate:null,
            daysHasEvents:['2015-12-03','2015-12-08'],
            showTodayBtn:true,
            todayText:'Today',
            weekText:['Sun','Mon','Tue','Wen','Thr','Fri','Sat'],
            monthText:["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            onCellClick:function(year,month,date,hasEvent,isFill,isToday){console.info([year,month,date,hasEvent,isFill,isToday].join('/'));},
            onPrevMonth:function(year,month){console.info([year,month].join("*"));},
            onNextMonth:function(year,month){console.info([year,month].join("*"));}
        };
        this.$get = function(){
            return {
                getOptions:getOptions
            };
        };
        this.setOptions = setOptions;
        function getOptions(){
            return settings;
        }
        function setOptions(){
            if(!arguments.length){
                return false;
            }
            if(typeof arguments[0] === 'string'){
                settings[arguments[0]] = arguments[1];
                return true;
            }
            settings = angular.extend(settings,arguments[0],{},true);
            return true;
        }
    }])
    .directive('uiMiniCalendar',['uiMiniCalendar',function(uiCalendar){
        return {
            restrict: 'E',
            scope:{
                calOptions:'='
            },
            templateUrl:function(){
                return '__ui_minicalendar.html';
            },
            replace:true,
            controller:["$scope","$element","$attrs",function($scope,$element,$attrs){

                $scope.today = new Date();
                $scope.disableButtonNext = false;
                $scope.disableButtonPrev = false;
                $scope.calOptions = angular.extend(uiCalendar.getOptions(),$scope.calOptions);
                $scope.calOptions.currentActiveDateStr = [$scope.calOptions.year,String($scope.calOptions.month).replace(/^([\d])$/,'0$1'),String($scope.calOptions.date).replace(/^([\d])$/,'0$1')].join('-');
            }],
            link:function($scope,$element,$attrs){
                $scope.nextMonth = nextMonth;
                $scope.prevMonth = prevMonth;
                $scope.goToClickDay = goToClickDay;
                $scope.goToToday = goToToday;
                $scope.$watch('calOptions',function(newVal,oldVal){watchChange(newVal)},true);

                function watchChange(newVal){
                    $scope.datesRow = getDatesRow(Number(newVal.year),Number(newVal.month));
                    $scope.disableButtonPrev = isDisabledButton(-1);
                    $scope.disableButtonNext = isDisabledButton(1);
                }

                function nextMonth(){
                    if(!isSmallThanMaxDate($scope.calOptions.year,Number($scope.calOptions.month),1)){
                        return false;
                    }
                    $scope.calOptions.year = Number($scope.calOptions.year);
                    $scope.calOptions.month = Number($scope.calOptions.month);
                    $scope.calOptions.month == 12 ? (( $scope.calOptions.month = 1) && ($scope.calOptions.year++)) : $scope.calOptions.month++;
                    $scope.calOptions.onNextMonth && (typeof $scope.calOptions.onNextMonth == 'function') && $scope.calOptions.onNextMonth($scope.calOptions.year,$scope.calOptions.month);
                }

                function prevMonth(){
                    if(!isLargeThanMinDate($scope.calOptions.year,Number($scope.calOptions.month)-1,1)){
                        return false;
                    }
                    $scope.calOptions.year = Number($scope.calOptions.year);
                    $scope.calOptions.month = Number($scope.calOptions.month);
                    $scope.calOptions.month == 1 ? (($scope.calOptions.month = 12) && ($scope.calOptions.year--)) : $scope.calOptions.month--;
                    $scope.calOptions.onPrevMonth && (typeof $scope.calOptions.onPrevMonth == 'function') && $scope.calOptions.onPrevMonth($scope.calOptions.year,$scope.calOptions.month);
                }

                function goToClickDay(cell){
                    cell && cell.isFill && ($scope.calOptions.currentActiveDateStr = cell.dateStr);
                    $scope.calOptions.onCellClick && (typeof $scope.calOptions.onCellClick == 'function') && cell && $scope.calOptions.onCellClick($scope.calOptions.year,$scope.calOptions.month,cell.dateToDisplay,cell.hasEvent,cell.isFill,cell.isToday);
                }

                function goToToday(){
                    $scope.calOptions.year = $scope.today.getFullYear();
                    $scope.calOptions.month = $scope.today.getMonth()+1;
                    $scope.calOptions.date = $scope.today.getDate();
                    $scope.calOptions.currentActiveDateStr = $scope.cellToday.dateStr;
                    $scope.calOptions.onCellClick && (typeof $scope.calOptions.onCellClick == 'function') && $scope.calOptions.onCellClick($scope.calOptions.year,$scope.calOptions.month,$scope.cellToday.dateToDisplay,$scope.cellToday.hasEvent,$scope.cellToday.isFill,$scope.cellToday.isToday);
                }

                function isDisabledButton(direction){
                    var year,month;
                    year = Number($scope.calOptions.year);
                    month = Number($scope.calOptions.month);
                    if(direction>0){
                        return !isSmallThanMaxDate(year,month,1);
                    }
                    return !isLargeThanMinDate(year,month-1,1);
                }

                function getDatesRow(year, month) {
                    month = month-1;
                    var date = new Date(year, month, 1),
                        result = [[],[],[],[],[],[]],
                        dayOfFirstDate = date.getDay(),
                        i=0;
                    while(i<dayOfFirstDate){
                        result[0].push(null);
                        dayOfFirstDate--;
                    }
                    while (date.getMonth() === month) {
                        if(result[i].length==7){
                            i++;
                        }
                        var curr = new Date(date),currTimeYear = curr.getFullYear(),currTimeMonth = curr.getMonth(),currTimeDate = curr.getDate();
                        var isFill= isLargeThanMinDate(currTimeYear,currTimeMonth,currTimeDate+1) && isSmallThanMaxDate(currTimeYear,currTimeMonth,currTimeDate);
                        var isToday = ( (currTimeYear==$scope.today.getFullYear()) && (currTimeMonth==$scope.today.getMonth()) && (currTimeDate==$scope.today.getDate()));
                        var hasEvent = (!($scope.calOptions.daysHasEvents) ||  !($scope.calOptions.daysHasEvents.length)) ? false : $scope.calOptions.daysHasEvents.indexOf([currTimeYear,fillZero(currTimeMonth+1),fillZero(currTimeDate)].join('-')) > -1;
                        var cell = {dateToDisplay:curr.getDate(),dateStr:[year,fillZero(month+1),fillZero(curr.getDate())].join('-'),isFill:isFill,isToday:isToday,hasEvent:hasEvent};
                        if(isToday){
                            $scope.cellToday = cell
                        }
                        result[i].push(cell);
                        date.setDate(date.getDate() + 1);
                    }
                    return result;
                }

                function isLargeThanMinDate(year,month,date){
                    if(!$scope.calOptions.minDate){
                        return true;
                    }
                    var dateToTime = (new Date(year,month,date)).getTime();
                    var minDate = (new Date($scope.calOptions.minDate)).getTime();
                    return dateToTime>=minDate;
                }
                function isSmallThanMaxDate(year,month,date){
                    if(!$scope.calOptions.maxDate){
                        return true;
                    }
                    var dateToTIme = (new Date(year,month,date)).getTime();
                    var maxDate = (new Date($scope.calOptions.maxDate)).getTime();
                    return dateToTIme<maxDate;
                }

                function fillZero(str){
                    return String(str).replace(/^([\d])$/,'0$1');
                }
            }
        }
    }])
    .run(['$templateCache',function($templateCache){
        $templateCache.put(
            '__ui_minicalendar.html',
            '<div class="__ui_minicalendar_container">'+
                '<div class="__ui_minicalendar_top">'+
                    '<div class="__ui_minicalendar_pull_left">'+
                        '<button class="__ui_minicalendar_icon" ng-disabled="disableButtonPrev" ng-class=" disableButtonPrev?\'__ui_minicalendar_disabled\':\'\' " ng-click="prevMonth();">'+
                            '<svg width="512" height="512" viewBox="0 0 512 512">'+
                                '<path d="m344 155c0 3-1 5-3 7l-112 112 112 113c2 1 3 4 3 6 0 3-1 5-3 7l-14 14c-2 2-5 3-7 3-2 0-5-1-7-3l-133-133c-2-2-3-4-3-7 0-2 1-4 3-6l133-133c2-2 5-3 7-3 2 0 5 1 7 3l14 14c2 2 3 4 3 6z"></path>'+
                            '</svg>'+
                        '</button>'+
                    '</div>'+
                        '<div>'+
                            '<span ng-bind="calOptions.year"></span>'+
                            '<span ng-repeat="($index,month) in calOptions.monthText" ng-if="$index+1==calOptions.month" ng-bind="month"></span>'+
                            '<a ng-if="calOptions.showTodayBtn" ng-click="goToToday();" ng-bind="calOptions.todayText"></a>'+
                        '</div>'+
                    '<div class="__ui_minicalendar_pull_right">'+
                        '<button class="__ui_minicalendar_icon" ng-disabled="disableButtonNext" ng-class=" disableButtonNext?\'__ui_minicalendar_disabled\':\'\' " ng-click="nextMonth();">'+
                            '<svg width="512" height="512" viewBox="0 0 512 512">'+
                                '<path d="m335 274c0 3-1 5-3 7l-133 133c-2 2-5 3-7 3-2 0-5-1-7-3l-14-14c-2-2-3-4-3-7 0-2 1-5 3-6l112-113-112-112c-2-2-3-4-3-7 0-2 1-4 3-6l14-14c2-2 5-3 7-3 2 0 5 1 7 3l133 133c2 2 3 4 3 6z"></path>'+
                            '</svg>'+
                        '</button>'+
                    '</div>'+
                '</div>'+
                '<div class="__ui_minicalendar_content">'+
                    '<table>'+
                        '<thead>'+
                            '<tr>'+
                                '<td ng-repeat="week in calOptions.weekText" ng-bind="week"></td>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr ng-if="row.length" ng-repeat="row in datesRow track by $index">'+
                                '<td ng-repeat="cell in row track by $index" ng-click="goToClickDay(cell);" ng-class=" (cell.isFill?\'__ui_minicalendar_cell_fill\':\'\')+\' \'+(cell.isToday?\'__ui_minicalendar_cell_today\':\'\')+\' \'+(cell.hasEvent?\'__ui_minicalendar_cell_has_event\':\'\')+\' \'+(cell.dateStr==calOptions.currentActiveDateStr?\'__ui_minicalendar_cell_active\':\'\')" ng-bind="cell.dateToDisplay">'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</div>'+
            '</div>'
        );
    }])
    .filter('fillzero',[function(){
        return function(input){
            return String(input).replace(/^([\d])$/,'0$1');
        };
    }])
    .config(['uiMiniCalendarProvider',function(uiMiniCalendarProvider){
        uiMiniCalendarProvider.setOptions();
    }])
;
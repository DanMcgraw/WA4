$(function() {

    var visitsData;
    var countryData;
    var browserData;
    var osData;



    loadCountries();
    loadBrowsers();
    loadOSs();
    // set up google charts
    google.charts.load('current', {'packages':['corechart', 'geochart']});

    readVisitsAndBuildTable();



    function readVisitsAndBuildTable() {
      $.get("http://www.randyconnolly.com/funwebdev/services/visits/visits.php","continent=EU&month=1&limit=100")
           .done(function(data) {
               visitsData = data;
               makeVisitsTable(data);
               makePieChart();
           })
           .fail(function(xhr,status,error) {
               alert("failed loading visits data - status=" + status + " error=" + error);
           });
    }

    function makeVisitsTable(visits) {

        $.each(visits, function(index, value) {

          var row = $('<tr></tr>');

          var td1 = $('<td>' + value.id + '</td>').appendTo(row);

          var displayDate = new Date( value.visit_date );
          var td2 = $('<td class="mdl-data-table__cell--non-numeric">' + displayDate.toDateString() + '</td>').appendTo(row);
          var td2 = $('<td class="mdl-data-table__cell--non-numeric">' + value.country + '</td>').appendTo(row);
          var td3 = $('<td class="mdl-data-table__cell--non-numeric">' + value.browser+ '</td>').appendTo(row);
          var td4 = $('<td class="mdl-data-table__cell--non-numeric">' + value.operatingSystem + '</td>').appendTo(row);

          row.appendTo("#visitsBody");
      });
    }


    function makePieChart() {

        // first calculate aggregates that will be charted
        $.each(visitsData, function(index1,visit) {
            for (var i=0 ; i < browserData.length; i++) {
                if (visit.browser_id == browserData[i].id) {
                    browserData[i].count++;
                }
            }
        });

        // now display the Google pie chart
        google.charts.setOnLoadCallback(drawPieChart);

        // callback function
        function drawPieChart() {
            // create a data array in format expected by the chart
            var table = [ ['Browser', 'Count'] ];
            for (var i=0 ; i < browserData.length; i++) {
                if (browserData[i].count > 0) {
                    table.push( [ browserData[i].name, browserData[i].count ] );
                }
            }

            var data = google.visualization.arrayToDataTable(table);
            var options = {
                legend: 'none',
                chartArea:{left:0,top:0,width:'100%',height:'100%'}
            };
            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            chart.draw(data, options);
        }
    }

    function loadOSs() {
      $.get("http://www.randyconnolly.com/funwebdev/services/visits/os.php")
        .done(function(data){
          osData = data;
          for (var index in data) {
              var op = $('<option value=\'' + (index + 1) + '\'>' + data[index].name + '</option>');
              op.appendTo('#filterOS');
              data[index].count = 0;
          }
        })
        .fail(function(xhr, status, error) {
          alert("failed loading country data - status= " + status + " error= " + error);
        });
    }

    function loadBrowsers() {
      $.get("http://www.randyconnolly.com/funwebdev/services/visits/browsers.php")
        .done(function(data){
          browserData = data;
          for (var index in data) {
              var op = $('<option value=\'' + (index + 1) + '\'>' + data[index].name + '</option>');
              op.appendTo('#filterBrowser');
              data[index].count = 0;

          }
        })
        .fail(function(xhr, status, error) {
          alert("failed loading country data - status= " + status + " error= " + error);
        });
    }

    function loadCountries() {

      $.get("http://www.randyconnolly.com/funwebdev/services/visits/countries.php?continent=EU")
        .done(function(data){
          countryData = data;
          for (var index in data) {
              var op = $('<option value=\'' + (index + 1) + '\'>' + data[index].name + '</option>');
              op.appendTo('#filterCountry');
              data[index].count = 0;

          }
        })
        .fail(function(xhr, status, error) {
          alert("failed loading country data - status= " + status + " error= " + error);
        });

    }
});

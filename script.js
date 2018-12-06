var results, os, ctry;
var brsr = new Array();
loadCountries();
loadBrowsers();
loadOSs();


$(document).ready(function() {
   fetchResults();
   google.charts.load('current', {'packages':['corechart', 'geochart', 'bar']});

   var selectors = $(".filters>select");
   $(".filters select").change(function(e) {
      var tempData = results;
      //alert(e.target.text);

      for (index in selectors) {
         if (selectors[index].id == null)
            continue;
         tempData = filter(selectors[index].id.substr(6), selectors[index].value, tempData);
      }
      displayData(tempData);
   });

});

function makeCharts() {

   // first calculate aggregates that will be charted
   $.each(results, function(index1, visit) {
      for (var i = 0; i < brsr.length; i++) {
         if (visit.browser_id == brsr[i].id) {
            brsr[i].count++;
         }
      }
      for (var i = 0; i < os.length; i++) {
         if (visit.os_id == os[i].id) {
            os[i].count++;
         }
      }
      for (var i = 0; i < ctry.length; i++) {
         if (visit.country_code === ctry[i].iso) {
            ctry[i].count++;
         }
      }
   });

   // now display the Google pie chart
   google.charts.setOnLoadCallback(drawPieChart);
   google.charts.setOnLoadCallback(drawColumnChart);
   google.charts.setOnLoadCallback(drawRegionsChart);

   function drawRegionsChart() {

           var table = [
              ['Country', 'Count']
           ];
           for (var i = 0; i < ctry.length; i++) {
              if (ctry[i].count > 0) {
                 table.push([ctry[i].name, ctry[i].count]);
              }
           }

           var data = google.visualization.arrayToDataTable(table);

           var options = {
             region: '150'
           };

           var chart = new google.visualization.GeoChart(document.getElementById('geochart'));

           chart.draw(data, options);
         }

   // callback function
   function drawPieChart() {
      // create a data array in format expected by the chart
      var table = [
         ['Browser', 'Count']
      ];
      for (var i = 0; i < brsr.length; i++) {
         if (brsr[i].count > 0) {
            table.push([brsr[i].name, brsr[i].count]);
         }
      }

      var data = google.visualization.arrayToDataTable(table);
      var options = {
         legend: 'none',
         chartArea: {
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
         }
      };
      var chart = new google.visualization.PieChart(document.getElementById('piechart'));
      chart.draw(data, options);
   }

   function drawColumnChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Operating System');
      data.addColumn('number', 'Users');

      var table = [
         ['Operating System', 'Users']
      ];
      for (var i = 0; i < os.length; i++) {
         if (os[i].count > 0) {
            table.push([os[i].name, os[i].count]);
         }
      }

      var data = google.visualization.arrayToDataTable(table);

      var options = {
        hAxis: {
          title: 'Type of OS',
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Users'
        }
      };

      var chart = new google.visualization.ColumnChart(
        document.getElementById('columnchart'));

      chart.draw(data, options);
    }
}

function filter(type, filter, data) {
   var name;
   var tempData = new Array();
   if (filter == 0)
      return data;
   switch (type) {
      case "OS":
         //name = os.find(x => x.id === filter).name;
         console.log(type);
         for (index in data) {
            if (data[index].os_id == filter)
               tempData.push(data[index]);
         }
         break;

      case "Country":
         //name = ctry.find(x => x.id === filter).name;
         console.log(filter);

         for (index in data) {
            if (data[index].country_code === ctry[filter - 1].iso)
               tempData.push(data[index]);
         }
         break;

      case "Browser":
         //name = brsr.find(x => x.id === filter).name;
         console.log(type);

         for (index in data) {
            if (data[index].browser_id == filter)
               tempData.push(data[index]);
         }
         break;
   }
   return tempData;
}

function loadBrowsers() {
   $.get("https://randyconnolly.com/funwebdev/services/visits/browsers.php").done(function(data) {
      brsr = data;
      for (var index in data) {

         var op = $("<option value='" + String(parseInt(index) + 1) + "'>" + data[index].name + "</option>");
         op.appendTo("#filterBrowser");
         brsr[index].count = 0;
      }
   })
}

function fetchResults() {
   $.get("https://randyconnolly.com/funwebdev/services/visits/visits.php?continent=EU&month=1&limit=500").done(function(data) {
      results = data;
      displayData(data);
      makeCharts();


   })
}

function displayData(data) {
   $("#visitsBody").empty();
   for (var index in data) {
      $("#visitsBody").append(createRow(data[index]));
   }
}

function createRow(data) {
   var row = "<tr><td>" + data.id + "</td><td>" + data.visit_date + "</td><td>" + data.country + "</td><td>" + data.browser + "</td><td>" + data.operatingSystem + "</td></tr>";
   return row;
}

function loadOSs() {
   $.get("https://randyconnolly.com/funwebdev/services/visits/os.php").done(function(data) {
      os = data;
      for (var index in data) {
         var op = $("<option value='" + String(parseInt(index) + 1) + "'>" + data[index].name + "</option>");
         op.appendTo("#filterOS");
         os[index].count = 0;

      }
   })
}

function loadCountries() {
   $.get("https://randyconnolly.com/funwebdev/services/visits/countries.php?continent=EU").done(function(data) {
      ctry = data;
      for (var index in data) {
         var op = $("<option value='" + String(parseInt(index) + 1) + "'>" + data[index].name + "</option>");
         op.appendTo("#filterCountry");
         ctry[index].count = 0;

      }
   })
}

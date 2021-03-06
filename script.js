(function() {
  var getData = function(cb) {
    var dataUrl = 'https://raw.githubusercontent.com/supersam654/cs2200-clicks/gh-pages/data.json'

    var httpRequest = new XMLHttpRequest()
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          var dataPoints = httpRequest.responseText.split('\n')
          var data = []
          for (var i = 0; i < dataPoints.length; i++) {
            var dataPoint = dataPoints[i]
            if (dataPoint.length === 0) {
              continue
            }
            var jsonData = JSON.parse(dataPoint)
            // Convert date string into real date object before exposing data.
            jsonData.date = new Date(jsonData.date)
            data.push(jsonData)
          }
          cb(data)
        }
      }
    }
    httpRequest.open('GET', dataUrl)
    httpRequest.send()
  }

  function sortBy(data, field, shouldReverse) {
    data.sort(function(a, b) {
      return a[field] < b[field]
    })

    if (shouldReverse) {
      data.reverse()
    }
  }
// Response rate by prof
// Response rate by time of class
// Response count by day of week

  function makeRow(dataPoint) {
    return '' +
      "<div class='row'>" +
      dataPoint.time + ' | ' + dataPoint.description + ' | ' + dataPoint.responses +
      "</div>"
  }

  function showRecentData(data) {
    sortBy(data, 'date')

    var lastDate = data[0].date
    console.log(lastDate)

    var dataDiv = document.getElementById('recent')
    dataDiv.innerHTML = 'Data from ' + lastDate.toLocaleDateString()

    for (var i = 0; i < data.length; i++) {
      var row = data[i]
      if (row.date.getTime() != lastDate.getTime()) {
        break
      }
      dataDiv.innerHTML += makeRow(row)
    }
  }

  function showQuestionCountByProfessor(data) {
    var professorCount = 0
    var substituteCount = 0
    for (var i = 0; i < data.length; i++) {
      if (data[i].comments === 'RAMA') {
        substituteCount++
      } else {
        professorCount++
      }
    }

    var professorPercent = professorCount / data.length * 100
    var substitutePercent = substituteCount / data.length * 100
    document.querySelector('#professor .filler').style.height = professorPercent + '%'
    document.querySelector('#substitute .filler').style.height = substitutePercent + '%'
  }

  function showQuestionRateByDayOfWeek(data) {
    var countsByWeekday = {}
    for (var i = 0; i < data.length; i++) {
      var date = data[i].date
      var day = date.getDay()
      countsByWeekday[day] = countsByWeekday[day] || 0
      countsByWeekday[day]++
    }

    var mondayPercent = countsByWeekday[1] / data.length * 100
    var wednesdayPercent = countsByWeekday[3] / data.length * 100
    var fridayPercent = countsByWeekday[5] / data.length * 100

    document.querySelector('#monday .filler').style.height = mondayPercent + '%'
    document.querySelector('#wednesday .filler').style.height = wednesdayPercent + '%'
    document.querySelector('#friday .filler').style.height = fridayPercent + '%'
  }

  getData(function(data) {
    console.log(data)
    showRecentData(data)
    showQuestionCountByProfessor(data)
    showQuestionRateByDayOfWeek(data)
    // showResponseRateOverTime(data)
    // showResponseRateByMinute(data)
  })
})()

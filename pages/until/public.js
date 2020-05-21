
function http(dataUrl, callBack) {
  wx.request({
    url: dataUrl,
    method: 'GET',
    data: {},
    header: {
      'Content-Type': 'never'
    },
    success: function (res) {
      callBack(res.data)
    }
  })
}
function starsArray(stars) {
 
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array;
  console.log(array)
}
function castsArray(casts) {
  var castArray = [];
  for (var i in casts) {
    var temp = {
      img: casts[i].avatars.large,
      name: casts[i].name
    }
    castArray.push(temp);
  }
  return castArray;
}
function castsName(casts) {
  var catasName = "";
  for (var i in casts) {
    catasName = catasName + casts[i].name + "/"
  }
  return catasName.substring(0, catasName.length - 1);
}
module.exports = {
  http: http,
  starsArray: starsArray,
  castsArray: castsArray,
  castsName: castsName
}
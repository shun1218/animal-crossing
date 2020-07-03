"use strict";

function adjustScrolling() {
  let height = $(window).height() - $('#header').outerHeight() - $('#alertRow').outerHeight();
  $('#itemList').css({'height': height, 'overflow': 'auto'});
}

function compareNum(a, b) {
  return a - b;
}

function displayTime(num, times) {
  let svgTag = 'svg' + String(num);
  let svg = document.getElementById(svgTag);
  let initX = 20;
  let initY = Math.round($('#' + svgTag).height() / 2);;
  let positionX = initX;
  let positionY = initY;
  let offsetX = Math.round(($('#' + svgTag).width() - 20) / 25);
  let offsetY = 0;
  let smallScale = 5;
  let bigScale = 10;
  let bigScaleAt = 6;
  let count = 25;

  let polylines = [];
  polylines.push([positionX, positionY]);
  for(let i = 0; i < count; i++){
    offsetY = i % bigScaleAt ? smallScale : bigScale;
    polylines.push([positionX, positionY]);
    positionY -= offsetY
    polylines.push([positionX, positionY]);
    positionY += offsetY
    polylines.push([positionX, positionY]);
    positionX += offsetX;
  }
  let polylineTag = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  let numberLineId = 'numberLine' + String(num);
  polylineTag.setAttribute('id', numberLineId);
  polylineTag.setAttribute('stroke', 'black');
  polylineTag.setAttribute('fill', 'none');
  svg.appendChild(polylineTag);

  let point = svg.createSVGPoint();
  polylines.forEach(function(n){
    point.x = n[0];
    point.y = n[1];
    document.getElementById(numberLineId).points.appendItem(point);
  });

  let colorPolylines = [];
  let colorPolyline = [];
  positionX = initX;
  positionY = initY;
  colorPolyline.push([positionX, positionY]);
  for(let i = 0; i < count; i++){
    if (times.indexOf(i) >= 0) {
      colorPolyline.push([positionX, positionY - 2.5]);
      if (times.indexOf(i + 1) < 0) {
        colorPolyline.push([positionX + offsetX, positionY - 2.5]);
        colorPolylines.push(colorPolyline);
        colorPolyline = [];
      }
    }
    positionX += offsetX;
  }
  colorPolylines.push(colorPolyline);

  colorPolylines.forEach((value, index) => {
    let colorPolylineTag= document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    let lineId = 'line' + String(num) + String(index);
    colorPolylineTag.setAttribute('id', lineId);
    colorPolylineTag.setAttribute('stroke', '#528161');
    colorPolylineTag.setAttribute('stroke-width', '5px');
    colorPolylineTag.setAttribute('fill', 'none');
    svg.appendChild(colorPolylineTag);

    let point = svg.createSVGPoint();
    value.forEach(function(n){
      point.x = n[0];
      point.y = n[1];
      document.getElementById(lineId).points.appendItem(point);
    });
  });
  
  let texts = [];
  let adjustNumY = 2;
  let displayNum = 0;
  for(let i = 0; i < count; i += bigScaleAt){
    let adjustNumX = displayNum.toString().length * 5;
    texts.push([displayNum, initX + offsetX * i - adjustNumX, initY - bigScale - adjustNumY]);
    displayNum += bigScaleAt;
  }
  texts.forEach(function(x){
    let t= document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('id', 'text');
    t.textContent = x[0];
    t.setAttribute('x', x[1]);
    t.setAttribute('y', x[2]);
    svg.appendChild(t);
  });
}

function displayUpdatingSpinner() {
  let tag = document.getElementById('alert');
  if (tag.firstChild) {
    tag.removeChild(tag.firstChild);
  }
  let updating = document.createElement('div');
  updating.classList.add('spinner-border');
  updating.setAttribute('role', 'status');
  let span = document.createElement('span');
  span.classList.add('sr-only');
  span.innerHTML = 'Loading...';
  updating.appendChild(span);
  tag.appendChild(updating);
}

function displayUpdatingSuccess(data) {
  let tag = document.getElementById('alert');
  tag.removeChild(tag.firstChild);
  let success = document.createElement('div');
  success.classList.add('alert', 'alert-success');
  success.setAttribute('role', 'alert');
  success.innerHTML = data.message;
  tag.appendChild(success);
}

function displayUpdatingFailure(error) {
  let tag = document.getElementById('alert');
  tag.removeChild(tag.firstChild);
  let failure = document.createElement('div');
  failure.classList.add('alert', 'alert-danger');
  failure.setAttribute('role', 'alert');
  failure.innerHTML = error.responseJSON.error;
  tag.appendChild(failure);
}
document.addEventListener("DOMContentLoaded", function() {

    //var colorsJSON = '[{"name": "Red", "hex": "#FF0000", "koreanName": "빨강", "category1": "Primary", "category2": "Warm"}, {"name": "Green", "hex": "#00FF00", "koreanName": "초록", "category1": "Primary", "category2": "Cool"}, {"name": "Blue", "hex": "#0000FF", "koreanName": "파랑", "category1": "Primary", "category2": "Cool"}, {"name": "Yellow", "hex": "#FFFF00", "koreanName": "노랑", "category1": "Primary", "category2": "Warm"}, {"name": "Cyan", "hex": "#00FFFF", "koreanName": "하늘색", "category1": "Secondary", "category2": "Cool"}, {"name": "Magenta", "hex": "#FF00FF", "koreanName": "자홍색", "category1": "Secondary", "category2": "Warm"}, {"name": "Purple", "hex": "#800080", "koreanName": "보라색", "category1": "Primary", "category2": "Cool"}, {"name": "Orange", "hex": "#FFA500", "koreanName": "주황색", "category1": "Secondary", "category2": "Warm"}, {"name": "Brown", "hex": "#A52A2A", "koreanName": "갈색", "category1": "Neutral", "category2": "Warm"}, {"name": "Pink", "hex": "#FFC0CB", "koreanName": "분홍색", "category1": "Secondary", "category2": "Warm"}]';
    //var colors = JSON.parse(colorsJSON);
    var colors = [];
    var colorListDiv = document.getElementById("color-list");
    var colorDetailDiv = document.getElementById("color-detail");
    var colorRecentDiv = document.getElementById("color-recent");
    var searchInput = document.getElementById("search-input");
    var searchForm = document.getElementById("form-search");
    var categoryCheckboxes = document.querySelectorAll("#category-filter input[type='checkbox']");
    var allCheckbox = document.getElementById("all-checkbox");
    var selectedColors = []; // 최근 선택한 색상 정보를 저장할 배열

    fetch("color.json")
    .then((res) => {
      return res.json()
    })
    .then((obj) => {
        colors = obj;
        console.log(colors)
        renderColors();
    })


    function renderColors() {
      colorListDiv.innerHTML = '';
      var searchKeyword = searchInput.value.toLowerCase();
      colors.forEach(function(color) {
        if (
          color.eng.toLowerCase().includes(searchKeyword) ||
          color.kor.toLowerCase().includes(searchKeyword) ||
          color.code.toLowerCase().includes(searchKeyword) ||
          color.page.toLowerCase().includes(searchKeyword) ||
          color.hex.toLowerCase().includes(searchKeyword) ||
          color.term2.toLowerCase().includes(searchKeyword)
        ) {
          var showColor = false;
          if (allCheckbox.checked) {
            showColor = true;
          } else {
            categoryCheckboxes.forEach(function(checkbox) {
              if (checkbox.checked) {
                if (color.term1 === checkbox.value || color.term2 === checkbox.value) {
                  showColor = true;
                }
              }
            });
          }
          if (showColor) {
            var colorBox = document.createElement("a");
            colorBox.className = "color-box";
            colorBox.style.backgroundColor = color.hex;
            colorBox.title = color.eng + " - " + color.kor + " - "  + color.page + " - " + color.hex + " - " + color.term2;
            colorBox.addEventListener('click', function() {
              showColorRecent(color);
            });
            colorListDiv.appendChild(colorBox);
          }
        }
      });
    }

    function showColorRecent(color) {
      // 최근 선택한 색상 정보 배열에 추가
      selectedColors.unshift(color);
      // 최근 선택한 색상이 2개 이상이면 마지막 항목 제거
      if (selectedColors.length > 3) {
        selectedColors.pop();
      }
      // 최근 선택한 색상의 상세 정보 표시
      var detail_box = document.querySelectorAll(".detail-box");
      var color_hex = document.querySelectorAll(".detail-color");
      var color_name = document.querySelectorAll(".detail-info b");
      var color_code = document.querySelectorAll(".detail-info input");
      var i = 0;
      selectedColors.forEach(function(selectedColor) {
        if(detail_box[i].classList.contains('reset')) detail_box[i].classList.remove('reset');
        color_hex[i].style.backgroundColor = selectedColor.hex;
        color_name[i].innerHTML = selectedColor.eng;
        color_code[i].value = selectedColor.code;
        i++;
      });
    }

    searchForm.addEventListener('submit', function(e){
      e.preventDefault();
      categoryCheckboxes.forEach(function(cb) {
          cb.checked = false;
      });
      allCheckbox.checked = true;
      renderColors();
    });

    categoryCheckboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          categoryCheckboxes.forEach(function(cb) {
            if (cb !== checkbox){
              cb.checked = false;
            }
          });
        }
        //allCheckbox.checked = false;
        renderColors();
      });
    });

    allCheckbox.addEventListener('change', function() {
      /*
      if (this.checked) {
        categoryCheckboxes.forEach(function(cb) {
          cb.checked = false;
        });
      }*/
      renderColors();
    });

    var btn_copy = document.querySelectorAll(".btn-copy");

    btn_copy.forEach(function(btn) {
        btn.addEventListener('click', function() {
            prev(this, 'input').select();
            document.execCommand('copy');
            prev(this, 'input').blur();
            alert('색상 코드가 클립보드에 복사되었습니다.')
        });
    });
    function prev(el, selector) {
        const prevEl = el.previousElementSibling;
        if (!selector || (prevEl && prevEl.matches(selector))) {
            return prevEl;
        }
        return null;
    }

    document.getElementById("form_calc").addEventListener('submit', function(e){
      var width = document.getElementById("calc_input01").value;
      var height = document.getElementById("calc_input02").value;
      var area = parseFloat(width) * parseFloat(height);
      var paint = area * 0.2;
      document.getElementById("calc_result01").innerHTML = parseFloat(area.toFixed(2));
      document.getElementById("calc_result02").innerHTML = parseFloat(paint.toFixed(2));
      e.preventDefault();
    });

    document.getElementById("btn-reset").addEventListener('click', function(e){
      var detail_box = document.querySelectorAll(".detail-box");
      selectedColors.pop();
      selectedColors.pop();
      detail_box[1].classList.add('reset');
      detail_box[2].classList.add('reset');
    });

  });

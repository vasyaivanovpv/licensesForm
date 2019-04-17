window.onload = init;

function init() {
  var licenses = document.getElementsByClassName("license"),
      currentState = false,
      totalElem = document.getElementById("total"),
      totalValue = document.getElementById("sum");

  getData();

  function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data-licenses.json', true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
      } else {
        try {
          var dataArr = JSON.parse(xhr.responseText);
        } catch(e) {
          alert("Некорректный ответ " + e.message);
        }
        setPrice(dataArr);
        for (var i = 0; i < licenses.length; i++) {
          if (licenses[i].classList.contains("selected")) {
            setNumber(licenses[i], dataArr);
          }
        }
        selectedLicense.addEventListener("click", function(e) {selectLicense(e, dataArr)}, true);
        amountLicenses.addEventListener("change", function() {setTotal(this.options[this.selectedIndex].value, dataArr)}, false);
      }
    }
  }

  function setPrice(arr) {
    var priceObjects = document.getElementsByClassName("priceLicense");

    for (var j = 0; j < priceObjects.length; j++) {
      var license = arr[j];
      var price = license["price"];
      priceObjects[j].innerHTML = "$" + price + " " + priceObjects[j].innerHTML;
    }
  }

  function selectLicense(e, arr) {
    var target = e.target;
    while (target != selectedLicense) {
      if (target.classList.contains("license") & !target.classList.contains("selected")) {
        for (var i = 0; i < licenses.length; i++) {
          if (licenses[i].classList.contains("selected")) {
            licenses[i].classList.remove("selected");
          }
        }
        target.classList.add("selected");

      setNumber(target, arr);
      }

    target = target.parentNode;
    }
  }

  function setNumber(target, arr) {
    for (var i = 0; i < arr.length; i++) {
      var license = arr[i];
      var id = license["id"];
      var amount = license["amount"];
      var price = license["price"];
      if (target.dataset.name == id) {
        selectedPlan.innerHTML = "Selected plan: ";
        selectedPlan.innerHTML = selectedPlan.innerHTML+ "#" + id;
        amountLicenses.innerHTML = "";
        for (var j = 0; j < amount; j++) {
          var option = document.createElement("option");
          option.innerHTML = j + 1;
          option.value = j + 1;
          amountLicenses.appendChild(option);
        }
        option.setAttribute("selected", "true");
        setTotal(option, price);
      }
    }

  }

  function setTotal(option, price) {
    var optValue;

    if (typeof option === "object") {
      optValue = +option.getAttribute('value');
    }
    if (typeof option === "string" & typeof price === "object") {
      optValue = +option;

      for (var i = 0; i < licenses.length; i++) {
        if (licenses[i].classList.contains("selected") & licenses[i].lastElementChild.classList.contains("priceLicense")) {
          var currentValue = licenses[i].lastElementChild.innerHTML;
          price = currentValue.match(/\d{2,}/im);
        }
      }
    }

    var total = calculateTotal(optValue, price);
    var textValue = "$" + total + "<sup>us</sup>";
    totalValue.innerHTML = textValue;
    totalValue.classList.add('sum')

    if (!currentState) {
      totalValue.innerHTML = "";
      totalValue.innerHTML = textValue;
    }
    result.insertBefore(totalValue, result.childNodes[2]);

  }

  function calculateTotal(optValue, price) {
    return optValue * price;
  }
}

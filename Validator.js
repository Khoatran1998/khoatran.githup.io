function Validator(formSelector, options) {
  //
  if (!options) {
    options = {};
  }

  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var formRules = {};

  // Qui ước tạo rule:
  // -Nếu có lỗi thì return 'message lỗi'
  // - Nếu không có lỗi thì return 'undefined'
  var validateRules = {
    required: function (value) {
      return value ? undefined : "Vui Lòng nhập trường này";
    },
    email: function (value) {
      var regax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regax.test(value) ? undefined : "Vui lòng nhập emall đúng";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Vui lòng nhập đầy đủ ${min} kí tự`;
      };
    },
  };

  // Lấy ra form element trong DOM theo 'formSelector'
  var formElement = document.querySelector(formSelector);

  // Chỉ xử lí khi có element trong DOM

  if (formElement) {
    var inputs = formElement.querySelectorAll("[name][rules]");

    for (var input of inputs) {
      var rules = input.getAttribute("rules").split("|");

      for (var rule of rules) {
        var isRulesValue = rule.includes(":");
        var ruleInfo;

        if (isRulesValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        var ruleFunc = validateRules[rule];
        if (isRulesValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }

      // Lắng nghe sự kiện để validate (blur,change)

      input.onblur = handleValidate;
      input.oninput = handleClearerror;
    }

    // Hàm thực hiện validate
    function handleValidate(event) {
      var rules = formRules[event.target.name];
      var errorMessage;

      rules.some(function (rule) {
        errorMessage = rule(event.target.value);
        return errorMessage;
      });

      // Nếu có lỗi thì hiển thị message lỗi ra UI
      if (errorMessage) {
        var formGroud = getParent(event.target, ".form-group");

        if (formGroud) {
          formGroud.classList.add("invalid");

          var formMessage = formGroud.querySelector(".form-message");
          if (formMessage) {
            formMessage.innerText = errorMessage;
          }
        }
      }

      return !errorMessage;
    }

    // Hàm clear message lỗi
    function handleClearerror(event) {
      var formGroud = getParent(event.target, ".form-group");
      if (formGroud.classList.contains("invalid")) {
        formGroud.classList.remove("invalid");

        var formMessage = formGroud.querySelector(".form-message");
        if (formMessage) {
          formMessage.innerText = "";
        }
      }
    }
  }

  // Xử lí hành vi submid form

  formElement.onsubmit = function (event) {
    event.preventDefault();

    var inputs = formElement.querySelectorAll("[name][rules]");
    var isValid = true;

    for (var input of inputs) {
      if (!handleValidate({ target: input })) {
        isValid = false;
      }
    }

    // Khi không có lỗi submit form

    if (isValid) {
      if (typeof options.onSubmit === "function") {
        options.onSubmit();
      } else {
        formElement.submit();
      }
    }
  };
}

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// onclick
const show = $(".header__nav-menu");
const navBar = $("#header__navbar");
const close = $(".header__nav-close");
navBar.onclick = function () {
  show.classList.add("open");
};
close.onclick = function () {
  show.classList.remove("open");
};
// sumit
const showForm = $(".form");
const showBtn = $(".header__sub-btn");
const formClose = $(".form__close");

showBtn.onclick = function () {
  showForm.classList.add("show");
};

formClose.onclick = function () {
  showForm.classList.remove("show");
};

// active
const tabs = $$(".tab-item");
const pans = $$(".tab-pane ");

tabs.forEach(function (tab, index) {
  const pane = pans[index];

  tab.onclick = function () {
    $(".tab-item.active").classList.remove("active");
    $(".tab-pane.active").classList.remove("active");

    this.classList.add("active");
    pane.classList.add("active");
  };
});





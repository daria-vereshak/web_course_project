const url = "../../db.json";

const getMainInfo = () => {
  const fillMainPage = (data) => {
    const container = document.querySelector(".cart__container");
    const template = document.querySelector("#cart_row");

    data.forEach((element) => {
      const clone = template.content.cloneNode(true);

      const image = clone.querySelector(".card__img");
      image.src = "../" + element.img;

      const name = clone.querySelector(".card__text");
      name.textContent = element.name;

      const options = clone.querySelectorAll("option");
      options.forEach((option) => {
        if (option.value == element.isFree) {
          option.selected = true;
        }
      });

      const notification = clone.querySelector("use");
      notification.href.baseVal =
        "./assets/main_sprites.svg#notification_" + element.notification;

      container.appendChild(clone);
    });
  };

  fetch(url).then((response) => {
    if (response.ok) {
      response.json().then((json) => {
        fillMainPage(json.cart);
      });
    } else {
      console.log(
        "Network request for products.json failed with response " +
          response.status +
          ": " +
          response.statusText
      );
    }
  });
};

const getAnalyticsInfo = () => {
  const fillAnalyticsPage = (data) => {
    const container = document.querySelector(".table");
    const template = document.querySelector("#row");

    data.forEach((element) => {
      const clone = template.content.cloneNode(true);

      const duration = clone.querySelector(".duration");
      duration.textContent = element.duration;

      const status = clone.querySelector(".status");
      status.querySelector(".status-stat").textContent = element.status.stat;
      status.querySelector(".work-type").textContent = element.status.type;

      const getInnerHTML = (arr, isResult) => {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
          if (i !== 0) str += "<br />";
          if (isResult) str += arr[i];
          else
            str +=
              "<span>" +
              arr[i].substring(0, arr[i].indexOf(":")) +
              "</span>" +
              arr[i].substring(arr[i].indexOf(":"));
        }
        return str;
      };

      const jobs = clone.querySelector(".jobs").querySelector(".line");
      jobs.innerHTML = getInnerHTML(element.jobs, false);

      const result = clone.querySelector(".result");
      result.querySelector(".line").innerHTML = getInnerHTML(
        element.result.text,
        true
      );

      if (element.result.isChecked)
        result.querySelector("use").href.baseVal =
          "./assets/analytics_sprite.svg#checked";

      const user = clone.querySelector(".user");
      user.textContent = element.user;

      container.appendChild(clone);
    });
  };

  fetch(url).then((response) => {
    if (response.ok) {
      response.json().then((json) => {
        fillAnalyticsPage(json.analytics);
      });
    } else {
      console.log(
        "Network request for products.json failed with response " +
          response.status +
          ": " +
          response.statusText
      );
    }
  });
};

const getTab = (tab) => {
  const container = document.querySelector(".container");
  const file = tab + ".html";
  fetch("pages/" + file)
    .then((response) => response.text())
    .then((html) => {
      container.innerHTML = html;
      tab === "main" ? getMainInfo() : getAnalyticsInfo();
    })
    .catch((error) => console.error("Error fetching " + file, error));
};

const tabButtons = document.querySelectorAll(".tab");

const changeTab = (event) => {
  const currentTab = getCurrentTab();

  if (!event.target.classList.contains(currentTab.substring(1))) {
    tabButtons.forEach((button) => {
      if (button === event.target) button.classList.add("tab-current");
      else button.classList.remove("tab-current");
    });
    getTab(event.target.attributes.href.value.substring(1));
  }
};

let tab = window.location.hash;

if (tab.length === 0 || tab === "#main") {
  document.querySelector(".main").classList.add("tab-current");
  getTab("main");
} else if (tab === "#analytics") {
  document.querySelector(".analytics").classList.add("tab-current");
  getTab("analytics");
} else {
  getTab("error");
}

const getCurrentTab = () => {
  return window.location.hash;
};

tabButtons.forEach((button) => {
  button.addEventListener("click", changeTab);
});

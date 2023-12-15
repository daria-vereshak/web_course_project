const url = "../db.json";

let currentId = -1;
const getMainInfo = () => {
  currentId = -1;
  const container = document.querySelector(".cart__container");

  const cartItemClick = (event) => {
    const element = event.target.closest(".item");
    currentId = element.querySelector(".card__id").value;
    changeTab("analytics");
  };
  container.addEventListener("click", cartItemClick);

  const fillMainPage = (data) => {
    let nodes = container.querySelectorAll(".item");
    nodes.forEach((node) => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
    nodes = container.querySelectorAll("hr");
    nodes.forEach((node) => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });

    const template = document.querySelector("#cart_row");

    data.forEach((element) => {
      const clone = template.content.cloneNode(true);

      clone.querySelector(".card__id").value = element.id;

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

      container.appendChild(clone);
    });
  };

  let allData = {};
  const searchProcess = (event) => {
    const text = event.target.value.toUpperCase();
    if (!!text) {
      const searchRes = allData.all.filter((item) =>
        item.name.toUpperCase().includes(text)
      );
      document.querySelector(".fav__title").style.display = "none";
      fillMainPage(searchRes);
    } else {
      document.querySelector(".fav__title").style.display = "block";
      fillMainPage(allData.favorite);
    }
  };

  document
    .querySelector(".search__input")
    .addEventListener("change", searchProcess);

  fetch(url).then((response) => {
    if (response.ok) {
      response.json().then((json) => {
        allData = json;
        fillMainPage(json.favorite);
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

    if (!data) {
      container.firstChild.display = "none";
      container.innerHTML =
        'Информация о приборе не найдена или запрос не коректен<br><a href="./index.html">Вернуться на главную</a>';
      return;
    }

    async function changeFav(id, isAdding) {
      const json = {"id": id};
      if(isAdding)
        await fetch('addFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(json)
        });
      else
        await fetch('deleteFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(json)
        });
    }

    document.querySelector(".favorite").addEventListener("click", (event) => {
      const icon =
        event.target.closest("use") || event.target.querySelector("use");
      icon.classList.toggle("fav");
      changeFav(data[0].id, icon.classList.contains("fav"));
    });

    const cardHead = document.querySelector(".card-top");
    cardHead.querySelector("img").src = "../" + data[0].img;
    cardHead.querySelector(".name").textContent = data[0].name;
    if (data[0]["is_favorite"])
      cardHead.querySelector(".non-fav").classList.add("fav");

    data.forEach((element) => {
      const clone = template.content.cloneNode(true);

      const duration = clone.querySelector(".duration");
      duration.textContent = element.deadline;

      const status = clone.querySelector(".status");
      status.querySelector(".status-stat").textContent = element.status;

      const getInnerHTML = (arr = "", isResult = false) => {
        let str = "";
        if (isResult) str += arr;
        else
          str +=
            "<span>" +
            arr.substring(0, arr.indexOf(":")) +
            "</span>" +
            arr.substring(arr.indexOf(":"));
        return str;
      };

      const jobs = clone.querySelector(".jobs").querySelector(".line");
      jobs.innerHTML = getInnerHTML(element.task, false);

      const result = clone.querySelector(".result");
      result.querySelector(".line").innerHTML = getInnerHTML(
        element.result.text,
        true
      );

      if (element.result)
        result.querySelector("use").href.baseVal =
          "./assets/analytics_sprite.svg#checked";

      const user = clone.querySelector(".user");
      user.textContent = element["id_user"] || "не определен";

      container.appendChild(clone);
    });
  };

  fetch(url).then((response) => {
    const need = "analytics-" + currentId;
    if (response.ok) {
      response.json().then((json) => {
        fillAnalyticsPage(json[need]);
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
const changeTab = (tab) => {
  tabButtons.forEach((button) => {
    if (button.value === tab) button.classList.add("tab-current");
    else button.classList.remove("tab-current");
  });
  getTab(tab);
};

document.querySelector(".main").classList.add("tab-current");
document.querySelector(".main").addEventListener("click", () => {
  if (document.querySelector(".wrapper-analytics")) changeTab("main");
});
getTab("main");

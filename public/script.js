const getTab = (tab) => {
  const container = document.querySelector(".container");
  const file = tab + ".html";
  // check using
  fetch("pages/" + file)
    .then((response) => response.text())
    .then((html) => {
      container.innerHTML = html;
    })
    .catch((error) => console.error("Error fetching " + file, error));
};

const tabButtons = document.querySelectorAll(".tab");

const changeTab = (event) => {
  const currentTab = getCurrentTab(); //на самом деле таб до клика
  //console.log(event.target);
  //console.log(currentTab);

  if (!event.target.classList.contains(currentTab.substring(1))) {
    tabButtons.forEach((button) => {
      if (button === event.target) button.classList.add("tab-current");
      else button.classList.remove("tab-current");
    });
    console.log(event.target.attributes.href.value.substring(1));
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

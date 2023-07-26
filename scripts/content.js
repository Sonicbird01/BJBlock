console.log("This script only runs on http://www.example.com/");
window.onload = async function () {
  const search = window.location.search;
  if (search === "?hash=all") {
    const broad = document.getElementById("broadlist_area");
    await blocking(broad);
  } else if (
    search === "?hash=game" ||
    search === "?hash=bora" ||
    search === "?hash=sports"
  ) {
    const broad = document.getElementById("broadlist_area");
    await blocking(broad);
    let observer = new MutationObserver(async function (mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          const broad = document.getElementById("broadlist_area");
          await blocking(broad);
        }
      }
    });

    let targetNode = document.getElementById("broadlist_area");
    let config = { subtree: true, childList: true };

    observer.observe(targetNode, config);
  } else {
    const broad = document.getElementById("prefer_broadlist_area");
    await blocking(broad);
  }
};

async function blocking(broad) {
  const list = broad.getElementsByTagName("li");
  const blockList = await getBlockList();
  const blockSet = new Set(blockList);
  const regex = /https:\/\/play\.afreecatv\.com\/([^\/]+)\//;

  for (let li of list) {
    const a = li.firstElementChild.getElementsByTagName("a");
    console.log(a);
    const url = a[0].href;

    if (blockSet.has(url.match(regex)[1])) {
      li.style.display = "none";
    }
  }
}

async function getBlockList() {
  const savedObj = await chrome.storage.sync.get();
  return savedObj.id;
}

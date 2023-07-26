document.getElementById("block").addEventListener("click", block);

let blockingId = "";

chrome.storage.onChanged.addListener(async function (changes) {
  console.log(changes);
  const newValue = changes.id.newValue;
  const oldValue = changes.id.oldValue;
  const noBlockText = document.getElementById("blockStatus");
  if (newValue.length > oldValue.length) {
    const li = document.createElement("li");
    const blockId = document.createTextNode(blockingId);
    const clearBtn = document.createElement("button");
    const btnName = document.createTextNode("해제");
    li.appendChild(blockId);
    clearBtn.appendChild(btnName);
    clearBtn.setAttribute("type", "button");
    clearBtn.setAttribute("class", "clearBtn");
    li.setAttribute("id", blockingId);
    clearBtn.addEventListener("click", blockClear(blockingId));
    li.appendChild(clearBtn);
    const list = document.getElementById("blockList");
    list.appendChild(li);
    noBlockText.className = "blocking";
    console.log(list);
  } else {
    const li = document.getElementById(blockingId);
    li.remove();

    if (newValue.length === 0) {
      noBlockText.className = "nonBlocking";
    }
  }
});

async function block() {
  const blockBjId = document.getElementById("bjId").value;
  const invalidText = document.getElementById("invalid");
  if (!blockBjId.match(/^[a-z0-9]*$/)) {
    invalidText.className = "invalid";
    document.getElementById("bjId").value = "";
    return;
  }
  invalidText.className = "valid";
  const savedObj = await chrome.storage.sync.get();
  savedObj.id.push(blockBjId);
  blockingId = blockBjId;
  console.log(savedObj);
  await chrome.storage.sync.set(savedObj);
  document.getElementById("bjId").value = "";
}

function blockClear(id) {
  return async function () {
    console.log("blockClear");
    const savedObj = await chrome.storage.sync.get();
    const list = savedObj.id;
    const index = list.indexOf(id);
    console.log("id: " + id);
    console.log("idx: " + index);
    blockingId = id;
    list.splice(index, 1);
    await chrome.storage.sync.set(savedObj);
  };
}

window.onload = async function () {
  const savedObj = await chrome.storage.sync.get();
  if ("id" in savedObj) {
    const list = savedObj.id;
    const noBlockText = document.getElementById("blockStatus");
    if (list.length !== 0) {
      noBlockText.className = "blocking";
      list.forEach((id) => {
        const li = document.createElement("li");
        const blockId = document.createTextNode(id);
        const clearBtn = document.createElement("button");
        const btnName = document.createTextNode("해제");
        li.appendChild(blockId);
        clearBtn.appendChild(btnName);
        clearBtn.setAttribute("type", "button");
        clearBtn.setAttribute("class", "clearBtn");
        li.setAttribute("id", id);
        clearBtn.addEventListener("click", blockClear(id));
        li.appendChild(clearBtn);
        const list = document.getElementById("blockList");
        list.appendChild(li);
        console.log(list);
      });
    } else {
      noBlockText.className = "nonBlocking";
    }
  } else {
    chrome.storage.sync.set({ id: [] });
  }
};

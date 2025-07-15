const folderMain = document.getElementById("folder-main");
const contextMenu = document.getElementById("context-menu");
const tree = [
  {
    type: "folder",
    name: "src",
    children: [
      {
        type: "folder",
        name: "components",
        children: [
          { type: "file", name: "Header.js" },
          { type: "file", name: "Footer.js" },
          { type: "file", name: "Button.js" },
        ],
      },
      {
        type: "folder",
        name: "pages",
        children: [
          {
            type: "file",
            name: "HomePage.js",
          },
          {
            type: "file",
            name: "AboutPage.js",
          },
        ],
      },
      {
        type: "folder",
        name: "utils",
        children: [
          {
            type: "file",
            name: "formatDate.js",
          },
          {
            type: "file",
            name: "validator.js",
          },
        ],
      },
      { type: "file", name: "index.js" },
      { type: "file", name: "App.js" },
    ],
  },
  {
    type: "folder",
    name: "public",
    children: [
      { type: "file", name: "index.html" },
      { type: "file", name: "hello.txt" },
    ],
  },
  {
    type: "folder",
    name: "config",
    children: [
      { type: "file", name: "vite.config.js" },
      { type: "file", name: "tailwind.config.js" },
    ],
  },
  { type: "file", name: ".gitignore" },
  { type: "file", name: "README.md" },
  { type: "file", name: "package.json" },
];
let currentTarget;

const handlerMenuContext = (e) => {
  e.preventDefault();
  contextMenu.style.top = `${e.pageY}px`;
  contextMenu.style.left = `${e.pageX}px`;
  contextMenu.classList.toggle("hidden");
  currentTarget = e.target.closest(".documentItem");
};

folderMain.addEventListener("contextmenu", handlerMenuContext);

function renderFolderItem(folder) {
  const div = document.createElement("div");
  div.className = "w-full flex gap-1 cursor-pointer select-none documentItem";

  const divIcon = document.createElement("div");
  divIcon.className = "flex items-center folder-header w-full p-1"; // đánh dấu vùng click

  const expandIcon = document.createElement("i");
  expandIcon.className =
    "fas fa-chevron-right w-3 h-3 mr-1 text-[#cccccc] text-xs transition-transform duration-200";

  const folderIcon = document.createElement("i");

  if (folder.type === "folder") {
    div.classList.add("flex-col", "items-start", "relative");
    folderIcon.className = "fas fa-folder mr-2 text-[#90a4ae]";
    divIcon.appendChild(expandIcon);

    div.dataset.expand = "false";

    // Gắn click vào phần header, không toàn div
    divIcon.addEventListener("click", (e) => {
      e.stopPropagation();

      // Bỏ highlight các folder khác
      document.querySelectorAll(".folder-header").forEach((el) => {
        el.classList.remove("bg-[#323842]", "border", "border-[#323842]");
      });

      // Highlight chính div cha
      divIcon.classList.add("bg-[#323842]", "border", "border-[#323842]");

      toggleFolder(div, expandIcon, folderIcon);
    });
  } else {
    div.classList.add("items-center");
    folderIcon.className = "fa-solid fa-file mr-2 text-[#dcb67a]";
  }

  const folderText = document.createElement("p");
  folderText.className = "text-[#cccccc] text-sm";
  folderText.textContent = folder.name;

  divIcon.appendChild(folderIcon);
  divIcon.appendChild(folderText);

  div.appendChild(divIcon);

  return div;
}

// Hàm toggle folder
function toggleFolder(folderDiv, expandIcon, folderIcon) {
  const isExpand = folderDiv.dataset.expand === "true";
  const childrenContainer = folderDiv.querySelector(".children-container"); // Tạo 1 lớp bọc, bao tất cả thẻ con

  if (isExpand) {
    // Đóng folder
    folderDiv.dataset.expand = "false";
    expandIcon.style.transform = "rotate(0deg)";
    folderIcon.className = "fas fa-folder mr-2 text-[#90a4ae]";
    if (childrenContainer) {
      childrenContainer.style.display = "none";
    }
  } else {
    // Mở folder
    folderDiv.dataset.expand = "true";
    expandIcon.style.transform = "rotate(90deg)";
    folderIcon.className = "fas fa-folder-open mr-2 text-[#90a4ae]";
    if (childrenContainer) {
      childrenContainer.style.display = "block";
    }
  }
}

const renderFolder = (tree, folder, level = 0) => {
  tree.forEach((t) => {
    const folderItem = renderFolderItem(t);
    folderItem.style.marginLeft = `${level * 16}px`;
    folder.appendChild(folderItem);

    if (t.children) {
      const childrenContainer = document.createElement("div");
      childrenContainer.className = "children-container space-y-1 w-[90%]";
      childrenContainer.style.display = "none";

      folderItem.appendChild(childrenContainer);

      renderFolder(t.children, childrenContainer, level + 1);
    }
  });
};

renderFolder(tree, folderMain);

document.addEventListener("click", (e) => {
  if (!contextMenu.contains(e.target)) {
    contextMenu.classList.add("hidden");
    currentTarget = null;
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".folder-header")) {
    document.querySelectorAll(".folder-header").forEach((el) => {
      el.classList.remove("bg-[#323842]", "border", "border-[#323842]");
    });
  }
});

document.querySelectorAll(".context-menu-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    const action = e.target.textContent.trim();

    if (currentTarget) {
      if (action === "Rename") {
        handleRename(currentTarget);
      } else if (action === "Delete") {
        handleDelete(currentTarget);
      }
    }

    contextMenu.classList.add("hidden");
    currentTarget = null;
  });
});

function handleRename(target) {
  const textElement = target.querySelector("p");
  const currentName = textElement.textContent;

  const input = document.createElement("input");
  input.value = currentName;
  input.className =
    "w-full border border-transparent focus:border-[#323842] outline-none text-white";

  textElement.style.display = "none ";
  textElement.parentNode.appendChild(input);

  input.focus();

  const renameInput = () => {
    if (input.value && input.value !== currentName) {
      textElement.textContent = input.value;
    } else {
      textElement.textContent = currentName;
    }

    input.remove();
    textElement.style.display = "";
  };

  input.addEventListener("blur", renameInput);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") renameInput();
  });
}

function handleDelete(target) {
  const documentName = target.querySelector("p").textContent;
  if (confirm(`Bạn có chắc chắn muốn xoá ${documentName}`)) {
    target.remove();
  }
}

const input = document.getElementById("search");
const table = document.getElementById("table");
const rows = Array.from(table.querySelectorAll("tbody tr"));

rows.forEach((row) => {
  row.querySelectorAll("td").forEach((td) => {
    td.dataset.originalHtml = td.innerHTML;
  });
});

input.addEventListener("input", () => {
  const value = input.value.trim().toLowerCase();

  let currentMarketRow = null;
  let firstMatchRow = null;

  rows.forEach((row) => {
    row.style.display = "none";
    row.querySelectorAll("td").forEach((td) => {
      td.innerHTML = td.dataset.originalHtml;
    });
  });

  if (!value) {
    rows.forEach((row) => (row.style.display = ""));
    return;
  }

  rows.forEach((row) => {
    if (row.classList.contains("market")) {
      currentMarketRow = row;
      return;
    }

    const rowText = row.textContent.toLowerCase();

    if (rowText.includes(value)) {
      row.style.display = "";

      if (currentMarketRow) {
        currentMarketRow.style.display = "";
      }

      row.querySelectorAll("td").forEach((td) => {
        highlightNode(td, value);
      });

      if (!firstMatchRow) {
        firstMatchRow = currentMarketRow || row;
      }
    }
  });

  if (firstMatchRow) {
    firstMatchRow.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
});

function highlightNode(node, search) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    const lower = text.toLowerCase();
    const index = lower.indexOf(search);

    if (index !== -1) {
      const before = text.slice(0, index);
      const match = text.slice(index, index + search.length);
      const after = text.slice(index + search.length);

      const fragment = document.createDocumentFragment();

      if (before) fragment.appendChild(document.createTextNode(before));

      const span = document.createElement("span");
      span.className = "highlight";
      span.textContent = match;
      fragment.appendChild(span);

      if (after) fragment.appendChild(document.createTextNode(after));

      node.replaceWith(fragment);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    Array.from(node.childNodes).forEach((child) =>
      highlightNode(child, search)
    );
  }
}

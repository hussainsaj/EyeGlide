import { textVide } from 'text-vide'

function applyBionicReading(text) {
  return textVide(text);
}

function processTextNodes(node, textProcessor) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Split the text node by punctuation marks and apply Bionic Reading to each part
    const text = node.textContent;
    const parts = text.split(/([.,;]+)/);
    const highlightedParts = parts.map((part) => {
      if (part.match(/[.,;]/)) {
        // If the part is a punctuation mark, return it as-is
        return part;
      }
      return textProcessor(part);
    });
    // Replace the original text node with the highlighted parts
    const parent = node.parentNode;
    highlightedParts.forEach((part) => {
      const newNode = document.createTextNode(part);
      parent.insertBefore(newNode, node);
    });
    parent.removeChild(node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Recurse into the child nodes of the element
    for (let i = 0; i < node.childNodes.length; i++) {
      processTextNodes(node.childNodes[i], textProcessor);
    }
  }
}

function isTextNode(node) {
  return node.nodeType === Node.TEXT_NODE;
}

function isElementNode(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}

function walkDOM(node, callback) {
  if (isTextNode(node)) {
    callback(node);
  } else if (isElementNode(node)) {
    Array.from(node.childNodes).forEach((childNode) => walkDOM(childNode, callback));
  }
}

function applyBionicReadingToElement(element) {
  const nodeName = element.nodeName.toLowerCase();
  if (nodeName === 'a') {
    // If the element is a hyperlink, apply Bionic Reading to the text content of the hyperlink and wrap the result in the original hyperlink
    const text = element.textContent.trim();
    const highlightedText = applyBionicReading(text);
    const span = document.createElement('span');
    span.innerHTML = highlightedText;
    element.innerHTML = span.innerHTML;
  } else if (nodeName === 'ul' || nodeName === 'ol') {
    // If the element is an unordered or ordered list, process each list item inside it
    const listItems = element.getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
      applyBionicReadingToElement(listItems[i]);
    }
  } else if (nodeName === 'p' || nodeName === 'span' || nodeName === 'li') {
    // If the element is a paragraph or a span, process the text nodes inside it one by one
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeType === Node.TEXT_NODE) {
        const highlightedText = applyBionicReading(childNode.textContent);
        const fragment = document.createDocumentFragment();
        const span = document.createElement('span');
        span.innerHTML = highlightedText;
        while (span.firstChild) {
          fragment.appendChild(span.firstChild);
        }
        element.replaceChild(fragment, childNode);
      } else {
        applyBionicReadingToElement(childNode);
      }
    }
  }
}

function applyBionicReadingToPage() {
  const elements = document.querySelectorAll('p, ul, ol');
  elements.forEach((element) => {
    applyBionicReadingToElement(element);
  });
}


applyBionicReadingToPage();

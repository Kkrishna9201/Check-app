var allDFCustomElements = {};

const getDfMessengerChat = () => {
  return allDFCustomElements['df-messenger-chat'];
};

const getDfMessengerTitlebar = () => {
  return allDFCustomElements['df-messenger-titlebar'];
} 

const getDfMessengerList = () => {
  return allDFCustomElements['df-message-list'];
};

const getDfMessengerUserInput = () => {
  return allDFCustomElements['df-messenger-user-input'];
}

const svgRefreshElement = () => {
  return `<svg fill="#fff" xmlns="http://www.w3.org/2000/svg"  id="refreshIcon" style="cursor:pointer; margin: 0 15px;" viewBox="0 0 30 30" width="25px" height="25px"><path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"/></svg>`
}

const isCustomElement = (el) => {
  return el.localName.includes("-");
}

const findAllDFMessengerElements = (nodes, allDFCustomElements = {}) => {
  for (let i = 0, el; (el = nodes[i]); ++i) {
    if (el.shadowRoot) {
      isCustomElement(el) &&
        (allDFCustomElements[el.localName] = el.shadowRoot);
      findAllDFMessengerElements(
        el.shadowRoot.querySelectorAll("*"),
        allDFCustomElements
      );
    }
  }
  return allDFCustomElements;
}

const initChatFontSize = () => {
  const dfMessageList = getDfMessengerList();
  const dfMessagerUserInput = getDfMessengerUserInput();
  const dfMessengerTitlebar = getDfMessengerTitlebar();

  if (!dfMessageList || !dfMessagerUserInput || !dfMessengerTitlebar) return;

  const messageListStyle = dfMessageList.querySelector('style');
  const messagerUserInputStyle =  dfMessagerUserInput.querySelector('style');
  const messengerTitlebarStyle =  dfMessengerTitlebar.querySelector('style');

  let messageListStyleTxt = messageListStyle.innerText;
  let messagerUserInputStyleTxt = messagerUserInputStyle.innerText;
  let messengerTitlebarStyleTxt = messengerTitlebarStyle.innerText;

  messageListStyleTxt += `
    #messageList .message {
      font-size: calc(var(--df-messenger-message-font-size, 14) * 1px);
    }
    #messageList #typing {
      font-size: calc(var(--df-messenger-message-font-size, 14) * 1px);
    }
  `;

  messagerUserInputStyleTxt += `
    .input-container input {
      font-size: calc(var(--df-messenger-input-placeholder-font-size, 14) * 1px);
    }
    #sendIcon:hover {
      fill: var(--df-messenger-send-icon);
    }
  `;

  messengerTitlebarStyleTxt += `
    .title-wrapper {
      font-size: calc(var(--df-messenger-title-font-size, 18) * 1px);
    }
  `;

  messageListStyle.innerHTML = messageListStyleTxt;
  messagerUserInputStyle.innerHTML = messagerUserInputStyleTxt;
  messengerTitlebarStyle.innerHTML = messengerTitlebarStyleTxt;
}

const initChatWidthAndHeight = () => {
  const dfMessageChat = getDfMessengerChat();
  if (!dfMessageChat) return;

  const chatWrapperStyle = dfMessageChat.querySelector('style');

  let chatWrapperStyleTxt = chatWrapperStyle.innerText;

  chatWrapperStyleTxt += `
    @media screen and (min-width: 501px) {
      div.chat-wrapper[opened="true"] {
        width: calc(var(--df-messenger-width, 370) * 1px);
        height: calc(var(--df-messenger-height, 560) * 1px);
      }
    }
  `;

  chatWrapperStyle.innerHTML = chatWrapperStyleTxt;
}

const initChatRefreshButton = () => {
  const titleBar = getDfMessengerTitlebar();

  if (!titleBar) return;

  const titleWrapper = titleBar.querySelector('.title-wrapper');

  const minimizeIcon = titleWrapper.querySelector('#minimizeIcon');
  minimizeIcon.style.cursor = 'pointer';

  const firstElementChild = titleWrapper.firstElementChild;
  firstElementChild.style.marginRight = "auto";

  const div = document.createElement('div');
  div.innerHTML = svgRefreshElement();

  div.addEventListener('click', () => {
    dfMessenger.initializeDFMessenger_();
  });

  titleWrapper.appendChild(div);
}

const dfMessenger = document.querySelector("df-messenger");

dfMessenger.addEventListener("df-messenger-loaded", function (event) {
  const nodes = event.target.shadowRoot.querySelectorAll("*");
  allDFCustomElements = findAllDFMessengerElements(nodes);

  initChatFontSize();
  initChatWidthAndHeight();
  initChatRefreshButton();
});


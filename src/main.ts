// 元のソースコード
// https://github.com/NasuPanda/frontend-practices/blob/main/10-vanilla-projects/Virtual-Keyboard/Keyboard/Keyboard.js

type KeyboardType = {
  elements: {
    main: HTMLDivElement | null;
    keysContainer: HTMLDivElement | null;
    keys: string[];
  };
  eventHandlers: {
    oninput: null;
    onclose: null;
  };
  properties: {
    value: string;
    capsLock: boolean;
  };
  init: () => void; //返り値なし
  _createKeys: () => void;
  _triggerEvent: (handlerName: string) => void;
  _toggleCapsLock: () => void;
  open: (initialValue: string, oninput: string, onclose: string) => void;
  close: () => void;
};

const Keyboard: KeyboardType = {
  elements: {
    // null = 空っぽ
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    // キーボードの入力
    value: "",
    capsLock: false,
  },

  init() {
    // main要素を制作
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // main要素をセットアップ
    this.elements.main.classList.add("Keyboard", "1keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");

    // DOMの追加
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
  },
  _createKeys() {
    const fragment = document.createDocumentFragment();
    // prettier-ignore
    const keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "space"
    ];

    const createIconHTML = (icon_name: string) => {
      return `<i class="material-icons>${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

      // 属性/クラスを追加
      keyElement.setAttribute("type", "button");
      //全てのキーに必要なクラス
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
      }
    });
  },
  _triggerEvent(handlerName) {
    console.log("Event Triggered! Event Name:" + handlerName);
  },
  _toggleCapsLock() {
    console.log("Caps Lock Toggled!");
  },
  // textarea に既に入力があった場合、その入力をスタート値にする
  open(initialValue, oninput, onclose) {},
  close() {},
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});

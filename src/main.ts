// 元のソースコード
// https://github.com/NasuPanda/frontend-practices/blob/main/10-vanilla-projects/Virtual-Keyboard/Keyboard/Keyboard.js

type Keyboard = {
  elements: {
    main: HTMLDivElement | null;
    keysContainer: HTMLDivElement | null;
    keys: NodeListOf<Element> | null;
  };
  eventHandlers: {
    oninput: ((value: string) => void) | null;
    onclose: ((value: string) => void) | null;
  };
  properties: {
    value: string;
    capsLock: boolean;
  };
  init: () => void; //返り値なし
  _createKeys: () => DocumentFragment;
  _triggerEvent: (handlerName: "oninput" | "onclose") => void;
  _toggleCapsLock: () => void;
  open: (
    initialValue: string,
    oninput: (value: string) => void,
    onclose?: (value: string) => void
  ) => void;
  close: () => void;
};

// interface HTMLButtonElementEvent<T extends HTMLButtonElement> extends MouseEvent {
//   target: T;
// }
type HTMLButtonElementEvent = MouseEvent & {
  target: HTMLButtonElement;
};

const keyboard: Keyboard = {
  elements: {
    // null = 空っぽ
    main: null,
    keysContainer: null,
    keys: null,
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
    this.elements.main = document.querySelector(".keyboard");
    this.elements.keysContainer = document.createElement("div");

    // main要素をセットアップ
    // this.elements.main.classList.add("Keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    // keysにkeyElementを追加
    this.elements.keys =
      this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // DOMの追加
    // this.elements.main?.appendChild(this.elements.keysContainer);
    this.elements.main?.appendChild(this.elements.keysContainer);
    // document.body.appendChild(this.elements.main);

    // 特定のクラスを持つ要素では自動的にキーボードを使う
    const textareaElement = document.querySelector<HTMLTextAreaElement>(
      ".use-keyboard-input"
    );
    textareaElement?.addEventListener("focus", () => {
      this.elements.main?.classList.add("keyboard--show");
      this.open(textareaElement.value, (currentValue) => {
        textareaElement.value = currentValue;
      });
    });

    // document.getElementsByClassName("text");
    // // querySelector=指定したclass/IDの最初の文字列を指定
    // document.querySelector<HTMLParagraphElement>("text")?.innerHTML = "a"
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
      console.log("createIconHTML", icon_name);
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      const keyElement = document.createElement("button");
      const insertLineBreak =
        ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

      // type="button" を追加
      keyElement.setAttribute("type", "button");
      // class="keyboard__key" を追加
      keyElement.classList.add("keyboard__key");
      keyElement.setAttribute("value", key);

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            // 0からvalue-1の文字までをvalueに代入
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent("oninput");
          });
          break;

        case "caps":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--can-activate"
          );
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle(
              "keyboard__key--active",
              this.properties.capsLock
            );
          });
          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });
          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra--wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });
          break;

        case "done":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--dark"
          );
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", (event: MouseEvent) => {
            if (event.target instanceof HTMLButtonElement) {
              this.properties.value += this.properties.capsLock
                ? key.toUpperCase()
                : key.toLowerCase();
              this._triggerEvent("oninput");
              console.log(this.properties.value);
            }
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName]?.(this.properties.value);
    }
    console.log("Event Triggered! Event Name:" + handlerName);
  },
  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    // if->()が0以外の場合、1を返して実行、0の場合実行されない
    // nullは0値
    if (this.elements.keys) {
      for (const key of this.elements.keys) {
        if (key.childElementCount === 0 && key.textContent) {
          key.textContent = this.properties.capsLock
            ? key.textContent.toUpperCase()
            : key.textContent.toLowerCase();
        }
      }
    }
    console.log("Caps Lock Toggled!");
  },
  // textarea に既に入力があった場合、その入力をスタート値にする
  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose ?? null; // onclose ? onclose: null
    this.elements.main?.classList.remove("keyboard--hidden");
  },
  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = null;
    this.eventHandlers.onclose = null;
    this.elements.main?.classList.remove("keyboard--show");
  },
};

window.addEventListener("DOMContentLoaded", () => {
  keyboard.init();
});

import * as React from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlocker(blocker, when = true) {
  const { navigator } = React.useContext(NavigationContext);
// describtion
//The NavigationContext is a context provided by react-router-dom that allows access to the navigation properties and methods of the Navigator component. React.useContext(NavigationContext) is used to access the navigator object from the context, which is an instance of the Navigator component.
// The navigator object has a method block that can be used to block navigation transitions. The block method takes a function as an argument, which will be called whenever a navigation is attempted. If the function returns undefined, the navigation is blocked.
// For example, in the code you provided, blocker is a function that is passed to the block method. When a navigation is attempted, blocker will be called, and the navigation will only be allowed if window.confirm(message) returns true.

  React.useEffect(() => {
    if (!when) return;
    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
}

export default function usePrompt(message, when = true) {
  const blocker = React.useCallback(
    (tx) => {
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );
  useBlocker(blocker, when); // Main call starts here
}

// This code was node tested inside this app yet.
// source : https://denislistiadi.medium.com/react-router-v6-preventing-transitions-2389806e8556 
// another version : https://codesandbox.io/s/navigating-prompt-rizh7n?fontsize=14&hidenavigation=1&theme=dark&file=/package.json 

//This code defines two React hooks: useBlocker and usePrompt.
// The useBlocker hook takes in two parameters: blocker and when. The blocker parameter is a function that will be called when the user navigates away from the current page. The when parameter is a boolean value that determines whether the hook should run or not.

// The hook uses the React useEffect hook and the NavigationContext from react-router-dom to add a "blocker" to the navigation process. The navigator.block method is called with the blocker function as a parameter. This means that every time the user tries to navigate away from the current page, the blocker function will be called. If the when parameter is false, the hook returns without setting up the blocker.

// The usePrompt hook is a convenience hook that uses the useBlocker hook to display a confirmation prompt to the user when they try to navigate away from the current page. The message parameter is the prompt message that will be displayed to the user. The when parameter determines whether the hook should run or not.

// The hook sets up the blocker function by passing it to useBlocker as the blocker parameter. The blocker function uses the window.confirm method to display the prompt message to the user. If the user confirms the prompt, the navigation is retried; otherwise, the navigation is cancelled.
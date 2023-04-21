import { UNSAFE_NavigationContext } from "react-router-dom";
import {useContext, useEffect} from "react";

export const useBackListener = (callback) => {
    const navigator = useContext(UNSAFE_NavigationContext).navigator;

    useEffect(() => {
        const listener = ({ location, action }) => {
            if (action === "POP") {
                callback({ location, action });
            }
        };

        const unlisten = navigator.listen(listener);
        return unlisten;
    }, [callback, navigator]);
};
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// export const useBackListener = (callback) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleBack = (e) => {
//       e.preventDefault();
//       callback();
//     };

//     const unlisten = navigate.listen((location, action) => {
//       if (action === "POP") {
//         handleBack();
//       }
//     });

//     return () => {
//       unlisten();
//     };
//   }, [callback, navigate]);
// };


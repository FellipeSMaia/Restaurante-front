import { useEffect, useRef } from "react";
import { useFooter } from "../contexts/FooterContext";

export const useFooterControl = (shouldShow = false, options = {}) => {
  const { showFooterComponent, hideFooterComponent, showFooter, toggleFooter } =
    useFooter();

  const { hideOnUnmount = true, onShow, onHide } = options;
  const callbacksRef = useRef({ onShow, onHide });

  callbacksRef.current = { onShow, onHide };

  useEffect(() => {
    if (shouldShow) {
      showFooterComponent();
      callbacksRef.current.onShow?.();
    } else {
      hideFooterComponent();
      callbacksRef.current.onHide?.();
    }

    return () => {
      if (hideOnUnmount) {
        hideFooterComponent();
        callbacksRef.current.onHide?.();
      }
    };
  }, [shouldShow, showFooterComponent, hideFooterComponent, hideOnUnmount]);

  return {
    showFooter,
    show: showFooterComponent,
    hide: hideFooterComponent,
    toggle: toggleFooter,
  };
};

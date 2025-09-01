import { useState, useEffect } from "react";

export function MobileTabletOnly({ children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(window.innerWidth < 1024);
    check(); // initial check
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return show ? children : null;
}

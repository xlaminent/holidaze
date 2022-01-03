import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AccessContext = React.createContext([null, () => {}]);

export const AccessProvider = (props) => {
	const [auth, setAuth] = useLocalStorage("holidaze-token", null);
	return <AccessContext.Provider value={[auth, setAuth]}>{props.children}</AccessContext.Provider>;
	
};

export default AccessContext;

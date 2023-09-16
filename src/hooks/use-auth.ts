import { useMemo } from "react";

const useAuth = () => {
    const isAuth = useMemo(() => false, []);

    return { isAuth };
};

export default useAuth;
